import * as crypto from 'crypto';
import 'dotenv/config';
import { client } from '../../utils/sui/config.js';
import { get_transaction_block } from '../../utils/sui/client.js';
// import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/sui/bcs';
import { database } from '../../database/firebaseConfig.js';

import * as ed from '@noble/ed25519';

const PACKAGE_ID = process.env.SUI_PACKAGE_ID;
const MODULE_NAME = 'sprite_token';
const MINT_FUNCTION = 'mint';

//Basic stuff regarding Creatures
export const read_sprite = async (req, res) => {
    const { id } = req.body;
    const { address } = req.user;
    try {
        const hashed = crypto.createHash('sha256').update(address).digest('hex');
        if(!id) {
            return res.status(400).json({error: 'Missing parameter "id" (UUID) from Request Body'})
        }
        const collection_ref = database.ref(`collections/${hashed}/${id}`);
        const snapshot = await collection_ref.once("value");
        if(!snapshot.exists()) {
            return res.status(400).json({ error: `${id} does not exist` });
        }
        return res.status(200).json({ response: sprite });
    } catch(err) {
        return res.status(403).json({ error: err });
    }
}

export const read_all_sprites = async (req, res) => {
    const { address } = req.user;
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
    const { id, nickname, favorite, hunger } = req.body;
    const { address } = req.user;
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

        const collection_ref = database.ref(`collections/${hashed}/${id}`);
        const snapshot = await collection-ref.once("value");
        // const snapshot = await collection.orderByChild("id").equalTo(id).once("value");
        // const key = Object.keys(snapshot.val())[0];
        if(!snapshot.exists()) {
            return res.status(400).json({ error: `${id} does not exist` });
        }
        collection_ref.update(update_obj);
        return res.status(200).json({ response: update_obj });
    } catch(err) {
        return res.status(403).json({ error: err });
    }
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

        const { minted_ID, type, rarity } = snapshot.val();

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
            showEffects: true
        },
    });

    if(transaction.effects.status.status != "success") {
        return res.status(503).json({ error: result.effects.status.status });
    }

    console.log(result);
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
