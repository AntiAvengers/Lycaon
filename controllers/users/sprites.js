import * as crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import 'dotenv/config';
import { client } from '../../utils/sui/config.js';
import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/sui/bcs';
import { database } from '../../database/firebaseConfig.js';

import * as ed from '@noble/ed25519';

const PACKAGE_ID = process.env.SUI_PACKAGE_ID;
const MODULE_NAME = 'sprite_token';
const MINT_FUNCTION = 'mint';

const pantry = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database/pantry.json'), 'UTF-8'));
const sprites = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database/sprites.json'), 'UTF-8'));
const natures = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database/traits.json'), 'UTF-8'));

//Basic stuff regarding Creatures
export const get_lore = async(req, res) => {
    return res.status(200).json({ response: sprites });
}

export const update_sprite = async (req, res) => {
    const { id, nickname, favorite, food_type } = req.body;
    const { address } = req.user;
    try {
        if(!id) {
            return res.status(400).json({ error: "missing ID (label) of creature from request body "});
        }
        if(nickname && typeof nickname !== "string") {
            return res.status(400).json({ error: "nickname has to be a string" });
        } 
        if(favorite && typeof favorite !== "boolean") {
            return res.status(400).json({ error: "favorite has to be boolean" });
        } 
        if(food_type && typeof food_type !== "string") {
            return res.status(400).json({ error: "food_type has to be string" });
        } 
        const hashed = crypto.createHash('sha256').update(address).digest('hex');

        const collection_ref = database.ref(`collections/${hashed}/${id}`);
        const snapshot = await collection_ref.once("value");
        if(!snapshot.exists()) {
            return res.status(400).json({ error: `${id} does not exist` });
        }
        const update_obj = {};
        if(nickname) update_obj.nickname = nickname;
        if(favorite !== undefined && favorite !== null) update_obj.favorite = favorite;
        if(food_type) {
            const pantry_ref = database.ref(`pantry/${hashed}`);
            const pantry_snapshot = await pantry_ref.once("value");
            const { [food_type]: num } = pantry_snapshot.val()
            if(num > 0) {
                const { hunger, stage } = snapshot.val()
                if(stage == 0) {
                    return res.status(400).json({ error: `Cannot feed an egg sprite` });
                } else if(hunger >= 8) {
                    return res.status(200).json({ response: `Sprite is already full!` });
                }
                pantry_ref.update({ [food_type]: (num - 1) });
                update_obj.hunger = Math.min(8, (hunger + pantry[food_type].value));
            }
        }
        collection_ref.update(update_obj);
        if(food_type) update_obj.food_value = pantry[food_type].value;
        return res.status(200).json({ response: update_obj });
    } catch(err) {
        return res.status(403).json({ error: err });
    }
}

export const evolve_sprite = async (req, res) => {
    const { id } = req.body;
    const { address } = req.user;

    if(!id) {
        return res.status(400).json({ error: "missing ID (label) of creature from request body "});
    }

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const collections_ref = database.ref(`collections/${hashed}/${id}`);
    const snapshot = await collections_ref.once("value");
    const { can_evolve, traits: sprite_traits, stage, type, name } = snapshot.val();

    if(!can_evolve) {
        return res.status(400).json({ error: "Sprite cannot evolve!" });
    }

    let { traits } = natures;
    const index = Math.floor(Math.random() * traits.length);

    const updated_traits = {};
    
    if(sprite_traits[0] == "?") {
        updated_traits[0] = traits[index];
        updated_traits[1] = sprite_traits[1];
    } else if(sprite_traits[1] == "?") {
        updated_traits[0] = sprite_traits[0];
        updated_traits[1] = traits[index];
    }

    const new_name = stage !== 2 ? sprites[type].name[stage + 1] : name;

    collections_ref.update({
        can_evolve: false,
        experience: 0,
        traits: updated_traits,
        hunger: 8,
        stage: stage + 1,
        name: new_name,
        evo_notify: true
    });

    return res.status(200).json({ response: updated_traits });
}

//Sui Blockchain
export const request_mint_tx = async (req, res) => {
    try {
        const { id } = req.body;
        const { address } = req.user;
         
        const hashed = crypto.createHash('sha256').update(address).digest('hex');
        
        const collections_ref = database.ref(`collections/${hashed}/${id}`);
        const snapshot = await collections_ref.once("value");

        if(!snapshot.exists()) {
            return res.status(400).json({ error: "Sprite ID does not exist for player" });
        }

        const { minted_ID, type, rarity, stage } = snapshot.val();
        const stage_to_string = stage == 0 ? 'Egg' : stage == 1 ? 'Stage 1' : 'Stage 2';

        if(minted_ID) {
            return res.status(400).json({ error: "Sprite is already minted!" });
        }

        const uuid = crypto.randomUUID().replace(/-/g, '');

        const MyStruct = bcs.struct('MyStruct', {
            uuid: bcs.byteVector(),
            expiration: bcs.u64(),
            sprite_type: bcs.byteVector(),
            sprite_rarity: bcs.byteVector(),
            sprite_stage: bcs.byteVector()
        });

        const struct = MyStruct.serialize({ 
            uuid: new TextEncoder().encode(uuid),
            expiration: Date.now() + (1000 * 60 * 5),
            sprite_type: new TextEncoder().encode(type),
            sprite_rarity: new TextEncoder().encode(rarity),
            sprite_stage: new TextEncoder().encode(stage_to_string)
        })
        .toBytes();

        const private_key = ed.utils.randomPrivateKey();
        const public_key = await ed.getPublicKeyAsync(private_key);
        const signature = await ed.signAsync(struct, private_key);

        const tx = new Transaction();

        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::${MINT_FUNCTION}`,
            arguments: [
                tx.pure(bcs.vector(bcs.u8()).serialize(struct)),
                tx.pure(bcs.vector(bcs.u8()).serialize(signature)),
                tx.pure(bcs.vector(bcs.u8()).serialize(public_key)), 
                tx.object(process.env.UUID_REGISTRY),
                tx.object('0x6'),
            ],
        });

        tx.setGasBudget(100_000_000);
    
        const simulation = await client.devInspectTransactionBlock({
            sender: address,
            transactionBlock: tx,
        });
    
        if(simulation.effects.status.status == 'failure') {
            throw simulation.effects.status.error;
        }
    
        const serialized = await tx.toJSON();
        
        console.log('. . . Created Minting Transaction for address', address);
        return res.status(200).json({ transactionBlock: serialized });
    } catch(err) {
        console.error(err);
    } 
};

export const execute_mint_tx = async (req, res) => {
    const { bytes, signature, id } = req.body;
    const { address } = req.user;

    if(!bytes) {
        return res.status(400).json({ error: "Missing 'bytes' parameter from request body" });
    }

    if(!signature) {
        return res.status(400).json({ error: "Missing 'signature' parameter from request body" });
    }

    const result = await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        requestType: 'WaitForLocalExecution',
        options: {
            showEffects: true,
            showObjectChanges: true
        },
    });

    if(result.effects.status.status != "success") {
        return res.status(503).json({ error: result.effects.status.status });
    }

    const transaction = await client.waitForTransaction({
        digest: result.digest,
        options: {
            showObjectChanges: true,
            showEffects: true,
            showRawEffects: true
        },
    });

    if(transaction.effects.status.status != "success") {
        return res.status(503).json({ error: result.effects.status.status });
    }

    console.log(result);
    console.log('---------------------------------');
    console.log(transaction);
    console.log('---------------------------------');
    console.log(transaction.effects.created);

    if(transaction.objectChanges) {
        if(transaction.objectChanges.length > 0) {
            const { objectId } = transaction.objectChanges
                .filter(obj => obj.type == 'created' && obj.objectType.includes('sprite_token'))
                [0];

            const hashed = crypto.createHash('sha256').update(address).digest('hex');
            const collection_ref = database.ref(`collections/${hashed}/${id}`);
            const snapshot = await collection_ref.once("value");
            collection_ref.update({ minted_ID: objectId });
            console.log('. . . Executed Minting Transaction for address', address);
            console.log('. . . . . . Minted Object ID:', objectId);
        }
    }

    return res.status(200).json({ response: transaction });
}
