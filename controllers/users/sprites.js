import * as crypto from 'crypto';
import 'dotenv/config';
import { client } from '../../utils/sui/config.js';
import { get_transaction_block } from '../../utils/sui/client.js';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { bcs } from '@mysten/sui/bcs';
import { database } from '../../database/firebaseConfig.js';

import * as ed from '@noble/ed25519';

const PACKAGE_ID = process.env.SUI_PACKAGE_ID;
const MODULE_NAME = 'sprite_token';
const MINT_FUNCTION = 'mint';

//Basic stuff regarding Creatures
export const read_sprite = async (req, res) => {
    const { address, id } = req.body;
    try {
        const hashed = crypto.createHash('sha256').update(address).digest('hex');
        if(!id) throw new Error("Missing Sprite id (UUID) from Request Body");
        const collection = database.ref(`collections/${hashed}`);
        const snapshot = await collection.orderByChild("id").equalTo(id).once("value");
        const key = Object.keys(snapshot.val())[0];
        console.log(key);
        const sprite = await collection.child(key).once("value");
        return res.status(200).json({ response: sprite });
    } catch(err) {
        return res.status(403).json({ error: err });
    }
}

export const read_all_sprites = async (req, res) => {
    const { address } = req.body;
    try {
        const hashed = crypto.createHash('sha256').update(address).digest('hex');
        const collection = database.ref(`collections/${hashed}`);
        const snapshot = await collection.once("value");
        if(!snapshot.exists()) { return res.status(200).json({ response: [] }); }
        const output = snapshot.val();
        return res.status(200).json({ response: output });
    } catch(err) {
        return res.status(403).json({ error: err });
    }
}

export const update_sprite = async (req, res) => {
    const { address, id, nickname, favorite, hunger } = req.body;
    try {
        if(nickname && typeof nickname !== "string") {
            res.status(400).json({ error: "nickname has to be a string" });
        } 
        if(favorite && typeof favorite !== "boolean") {
            res.status(400).json({ error: "favorite has to be boolean" });
        } 
        if(hunger && typeof hunger !== "number") {
            res.status(400).json({ error: "hunger has to be integer" });
        } 
    
        const update_obj = {};
        if(nickname) update_obj.nickname = nickname;
        if(favorite) update_obj.favorite = favorite;
        //Missing Validation of Frontend using "Item"
        if(hunger) update_obj.hunger = hunger;

        const hashed = crypto.createHash('sha256').update(address).digest('hex');

        const collection = database.ref(`collections/${hashed}`);
        const snapshot = await collection.orderByChild("id").equalTo(id).once("value");
        const key = Object.keys(snapshot.val())[0];

        database.ref(`collections/${hashed}/${key}`).update(update_obj);
        return res.status(200).json({ response: update_obj });
    } catch(err) {
        return res.status(403).json({ error: err });
    }
}

//Minting Creatures
export const request_mint_tx = async (req, res) => {
    try {
        const { address, id } = req.body;

        const hashed = crypto.createHash('sha256').update(address).digest('hex');
        
        const collections = database.ref(`collections/${hashed}`);
        const snapshot = await collections.orderByChild("id").equalTo(id).once("value");
        
        if(!snapshot.exists()) {
            return res.status(400).json({ error: "Sprite ID does not exist for player" });
        }

        const key = Object.keys(snapshot.val())[0];
        const sprite = await collections.child(key).once("value");

        const { minted_ID, type, rarity } = sprite.val();

        if(minted_ID) {
            return res.status(400).json({ error: "Sprite is already minted!" });
        }

        const uuid = crypto.randomUUID().replace(/-/g, '');

        const MyStruct = bcs.struct('MyStruct', {
            uuid: bcs.byteVector(),
            expiration: bcs.u64(),
            sprite_type: bcs.byteVector(),
            sprite_rarity: bcs.byteVector(),
        });

        const struct = MyStruct.serialize({ 
            uuid: new TextEncoder().encode(uuid),
            expiration: Date.now() + (1000 * 60 * 5),
            sprite_type: new TextEncoder().encode(type),
            sprite_rarity: new TextEncoder().encode(rarity)
        })
        .toBytes();

        const private_key = ed.utils.randomPrivateKey();
        const public_key = await ed.getPublicKeyAsync(private_key);
        const signature = await ed.signAsync(struct, private_key);

        const tx = new TransactionBlock();

        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::${MINT_FUNCTION}`,
            arguments: [
                tx.pure(bcs.vector(bcs.u8()).serialize(struct)),
                tx.pure(bcs.vector(bcs.u8()).serialize(signature)),
                tx.pure(bcs.vector(bcs.u8()).serialize(pubKey)), 
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
    
        const serialized = await tx.serialize();
    
        return res.status(200).json({ transactionBlock: serialized });
    } catch(err) {
        console.error(err);
    } 
};

export const update_minted_digest = async (req, res) => {
    try {
        const { address, digest, id } = req.body;

        if(!digest) {
            return res.status(400).json({ error: "Missing Digest for Transaction Block!" })
        } 
        if(!id) {
            return res.status(400).json({ error: "Missing ID of sprite to reference database!" })
        }
    
        const tx = await get_transaction_block(digest);
        console.log(tx);
        console.log(Object.keys(tx));
        
        if(tx.objectChanges) {
            console.log('tx.objectChanges');
            if(tx.objectChanges.length > 0) {
                const { objectId } = tx.objectChanges
                    .filter(obj => obj.type == 'created' && obj.objectType.includes('sprite_token'))
                    [0];

                const hashed = crypto.createHash('sha256').update(address).digest('hex');
            
                const collection = database.ref(`collections/${hashed}`);
                const snapshot = await collection.orderByChild("id").equalTo(id).once("value");
                const key = Object.keys(snapshot.val())[0];
                database.ref(`collections/${hashed}/${key}`).update({ minted_ID: objectId });
            }
        }
        return res.status(200);
    } catch(err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
};

//TEST F - B - SUI - B - F model
export const execute_mint_tx = async (req, res) => {
    const { bytes, signature } = req.body;

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
        },
    });

    const transaction = await client.waitForTransaction({
        digest: result.digest,
        options: {
            objectChanges: true,
            showEffects: true
        },
    });
}
