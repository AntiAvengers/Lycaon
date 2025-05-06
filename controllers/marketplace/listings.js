import crypto from 'crypto';
import { client } from '../../utils/sui/config.js';
import { get_transaction_block, get_object } from '../../utils/sui/client.js';
// import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Transaction } from '@mysten/sui/transactions';

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
        const collections = database.ref(`collections/${hashed}/${id}`);
        const snapshot = await collections.once("value");
        
        if(!snapshot.exists()) {
            return res.status(400).json({ error: "Sprite ID does not exist for player" });
        }

        const { minted_ID } = snapshot.val();

        if(!minted_ID) {
            return res.status(400).json({ error: "You can only list a minted creature!" });
        }

        if(asking_price <= 0 || asking_price.isNaN) {
            return res.status(400).json({ error: "Asking price must be a positive number" });
        }

        //Move Module
        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::${CREATE_FUNCTION}`,
            arguments: [
                tx.object(minted_ID),
                tx.pure.u64(asking_price)
            ],
        });

        tx.setGasBudget(100_000_000);
        
        const simulation = await client.devInspectTransactionBlock({
            sender: address,
            transactionBlock: tx,
        });

        if(simulation.effects.status.status == 'failure') throw simulation.effects.status.error;

        const serialized = await tx.toJSON();

        console.log('. . . Created Marketplace Listing Transaction for address', address);
        return res.status(200).json({ transactionBlock: serialized });
    } catch(err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
}

export const execute_listing_tx = async (req, res) => {
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
            showEffects: true,
            showRawEffects: true
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

            marketplace_ref.update({ [id]: listing_obj });

            const collections_ref = database.ref(`collections/${hashed}/${id}`);
            collections_ref.update({ on_marketplace: true });
            console.log('. . . Executing Marketplace Listing of Sprite for address', address);
            console.log('. . . . . . Updating Sprite Info - Marketplace UUID:', id)
            return res.status(200).json({ response: transaction });
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
            showEffects: true,
            showRawEffects: true
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
        
        if(!snapshot.exists()) {
            return res.status(400).json({ error: "Listing does not exist for player" });
        }

        const listing = snapshot.val();
        const { id: object_ID } = listing;

        //Move Module
        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::${CANCEL_FUNCTION}`,
            arguments: [
                tx.object(object_ID)
            ],
        });

        tx.setGasBudget(100_000_000);
        
        const simulation = await client.devInspectTransactionBlock({
            sender: address,
            transactionBlock: tx,
        });

        if(simulation.effects.status.status == 'failure') throw simulation.effects.status.error;

        const serialized = await tx.toJSON();

        console.log('REQUEST FOR CANCELLATION APPROVED');
        return res.status(200).json({ transactionBlock: serialized });
    } catch(err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
}

export const execute_cancel_tx = async (req, res) => {
    console.log('EXECUTING CANCEL TRANSACTION');
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
            showEffects: true,
            showRawEffects: true
        },
    });

    if(transaction.effects.status.status != "success") {
        return res.status(503).json({ error: result.effects.status.status });
    }

    console.dir(result, { depth: null, colors: true });
    console.dir(transaction, { depth: null, colors: true });

    //Delete Market Listing
    const hashed = crypto.createHash('sha256').update(address).digest('hex');
    const marketplace_ref = database.ref(`marketplace/${hashed}/${id}`);
    marketplace_ref.remove();

    //Change collection on_market to false
    const collections_ref = database.ref(`collections/${hashed}/${id}`);
    collections_ref.update({ on_marketplace: false });

    return res.status(200).json({ response: transaction });
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