import crypto from 'crypto';
import { client } from '../../utils/sui/config.js';
import { get_transaction_block, get_object } from '../../utils/sui/client.js';
import { TransactionBlock } from '@mysten/sui.js/transactions';

import { database, schema } from '../../database/firebaseConfig.js';
import { request_mint_tx } from '../users/sprites.js';

const PACKAGE_ID = process.env.SUI_PACKAGE_ID;
const MODULE_NAME = 'marketplace';
const CREATE_FUNCTION = 'create';
const BUY_FUNCTION = 'buy';
const CANCEL_FUNCTION = 'cancel';

export const check_tx = async(req, res) => {
    const { digest, id } = req.body;
    const a = await get_transaction_block(digest);
    // const a = await get_object(id);
    console.dir(a, { depth: null, color: true });
    return res.status(200);
}

//Sui Blockchain
export const request_listing_tx = async (req, res) => {
    const { asking_price, id } = req.body;
    const { address } = req.user;

    try {
        const hashed = crypto.createHash('sha256').update(address).digest('hex');
        const collections = database.ref(`collections/${hashed}`);
        const snapshot = await collections.orderByChild("id").equalTo(id).once("value");
        
        if(!snapshot.exists()) {
            return res.status(400).json({ error: "Sprite ID does not exist for player" });
        }

        const key = Object.keys(snapshot.val())[0];
        const sprite = await collections.child(key).once("value");

        const { minted_ID } = sprite.val();

        if(!minted_ID) {
            return res.status(400).json({ error: "You can only list a minted creature!" });
        }

        if(asking_price <= 0 || asking_price.isNaN) {
            return res.status(400).json({ error: "Asking price must be a positive number" });
        }

        //Move Module
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::${CREATE_FUNCTION}`,
            arguments: [
                tx.object(minted_ID),
                tx.pure(asking_price)
            ],
        });

        tx.setGasBudget(100_000_000);
        
        const simulation = await client.devInspectTransactionBlock({
            sender: address,
            transactionBlock: tx,
        });

        if(simulation.effects.status.status == 'failure') throw simulation.effects.status.error;

        const serialized = await tx.serialize();

        return res.status(200).json({ transactionBlock: serialized });
    } catch(err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
}

export const execute_listing_tx = async (req, res) => {
    const { bytes, signature, id, asking_price } = req.body;
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
            showInputs: true,
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
            showInputs: true,
            showObjectChanges: true,
            showEffects: true
        },
    });

    if(transaction.effects.status.status != "success") {
        return res.status(503).json({ error: result.effects.status.status });
    }

    console.dir(result, { depth: null, colors: true });
    console.dir(transaction, { depth: null, colors: true });

    if(transaction.objectChanges) {
        if(transaction.objectChanges.length > 0) {
            const { objectId: listing_object_ID } = transaction.objectChanges
                 .filter(obj => obj.type == 'created' && obj.objectType.includes('marketplace'))
                 [0];
            const { objectId: sprite_token_object_ID } = transaction.objectChanges
                .filter(obj => obj.type == 'created' && obj.objectType.includes('sprite_token'))
                [0];
            
            const tx_data = await get_transaction_block(transaction.digest);
            const sprite_data = await get_object(sprite_token_object_ID);
            // const listing_data = await get_object(listing_object_ID);

            const listing_price = tx_data.transaction.data.transaction.inputs
                .filter(obj => {
                    if(obj.type == 'pure') {
                        if(obj.valueType && obj.value) {
                            if(obj.valueType == 'u64') {
                                return true;
                            }
                        }
                    }
                    return false;
                })
                [0].value;
            
            const { sprite_rarity, sprite_type } = sprite_data.data.content.fields.value.fields;

            const listing_obj = {
                id: listing_object_ID,
                // owner: address,
                price: parseInt(listing_price),
                type: sprite_type,
                rarity: sprite_rarity
            }

            const hashed = crypto.createHash('sha256').update(address).digest('hex');
            const marketplace_ref = database.ref(`marketplace/${hashed}`);
            const snapshot = await marketplace_ref.once("value");

            //First listing
            if(!snapshot.exists()) {
                marketplace_ref.set({ [0]: listing_obj });
                return res.status(200).json({ response: listing_obj });
            }

            const listings = snapshot.val();
            const len = Object.keys(listings).length;
            marketplace_ref.update({ [len]: listing_obj });
            console.log('. . . Executing Listing of Sprite for address', address);
            return res.status(200).json({ response: listing_obj });
        }
    }
}

export const request_buy_tx = async (req, res) => {
    const { id } = req.body;
    const { address } = req.user;
}

export const execute_buy_tx = async (req, res) => {
    const { bytes, signature } = req.body;
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
            showInputs: true,
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
            showInputs: true,
            showObjectChanges: true,
            showEffects: true
        },
    });

    if(transaction.effects.status.status != "success") {
        return res.status(503).json({ error: result.effects.status.status });
    }

    console.dir(result, { depth: null, colors: true });
    console.dir(transaction, { depth: null, colors: true });

    //Missing DB update logic
}

export const request_cancel_tx = async (req, res) => {
    const { id } = req.body;
    const { address } = req.user;

    try {
        const hashed = crypto.createHash('sha256').update(address).digest('hex');
        const marketplace_ref = database.ref(`marketplace/${hashed}/${id}`);
        const snapshot = await marketplace_ref.once("value");
        // const snapshot = await marketplace_ref.orderByChild("id").equalTo(id).once("value");
        
        //Impossible
        if(!snapshot.exists()) {
            return res.status(400).json({ error: "Listing does not exist for player" });
        }

        const listing = snapshot.val();
        const { id: objectId } = listing;

        console.log('LISTING:');
        console.log(listing);

        //Move Module
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::${CANCEL_FUNCTION}`,
            arguments: [
                tx.object(minted_ID)
            ],
        });

        tx.setGasBudget(100_000_000);
        
        const simulation = await client.devInspectTransactionBlock({
            sender: address,
            transactionBlock: tx,
        });

        if(simulation.effects.status.status == 'failure') throw simulation.effects.status.error;

        const serialized = await tx.serialize();

        return res.status(200).json({ transactionBlock: serialized });
    } catch(err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
}

export const execute_cancel_tx = async (req, res) => {
    const { bytes, signature } = req.body;
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
            showInputs: true,
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
            showInputs: true,
            showObjectChanges: true,
            showEffects: true
        },
    });

    if(transaction.effects.status.status != "success") {
        return res.status(503).json({ error: result.effects.status.status });
    }

    console.dir(result, { depth: null, colors: true });
    console.dir(transaction, { depth: null, colors: true });

    //Missing DB update logic
}

//Backend API calls
export const get_listings = async (req, res) => {
    const marketplace = database.ref('marketplace');
    const snapshot = await marketplace.once("value");

    return res.status(200).json({ response: snapshot.val() });
}

export const read_listing = async (req, res) => {
    const { address, asking_price, creature} = req.body;
    const { type, rarity, minted_ID } = creature;

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const marketplace = database.ref('marketplace');
    const snapshot = await marketplace.once("value");

    const all_listings = snapshot.val();
    const player_listings = all_listings.filter(obj => obj.minted_ID == minted_ID);

    return res.status(200).json({ response: player_listings });
}

export const read_all_listings = async (req, res) => {
    const { address, asking_price, creature} = req.body;
    const { type, rarity, minted_ID } = creature;

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const marketplace = database.ref('marketplace');
    const snapshot = await marketplace.once("value");

    const all_listings = snapshot.val();
    const player_listings = all_listings.filter(obj => obj.address == address);

    return res.status(200).json({ response: player_listings });
}

export const update_listing = async (req, res) => {
    const { address, asking_price, creature, id } = req.body;
    const { type, rarity, minted_ID } = creature;

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const collections = database.ref('collections');
    const snapshot = await collections.orderByKey().equalTo(hashed).once("value");
    const pCollection = snapshot.val();

    if(!snapshot.exists()) {
        return res.status(400).json({ error: "Wallet Address " });
    }

    if(snapshot.val().length == 0) {
        return res.status(400).json({ error: "User has nothing to sell" });
    }

    if(!pCollection.minted_ID) {
        return res.status(400).json({ error: "You can only sell a minted creature!" });
    }

    if(asking_price <= 0 || asking_price.isNaN) {
        return res.status(400).json({ error: "Asking price must be a positive number" });
    }

    const player_listing = {
        id: id,
        address: address,
        creature: creature,
        asking_price: asking_price,
    };

    const marketplace = database.ref('marketplace');
    const market_snapshot = await marketplace.once("value");
    const listings = market_snapshot.val() || [];

    if(!listings.length == 0) {
        return res.status(200).json({ error: "Can't update listing that doesn't exist" });
    }

    const index = listings.findIndex(obj => obj.minted_ID == minted_ID && obj.id == id);

    if(index !== -1) {
        listings.splice(index, 1, player_listing);
    }

    listings.push(player_listing);

    await marketplace.set(listings)
    return res.status(200).json({ response: `Listing succesfully created!`, listing: player_listing })
}

export const delete_listing = async (req, res) => {
    
}