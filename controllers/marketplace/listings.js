import crypto from 'crypto';
import { client } from '../../utils/sui/config.js';
import { get_transaction_block } from '../../utils/sui/client.js';
import { TransactionBlock } from '@mysten/sui.js/transactions';

import { database, schema } from '../../database/firebaseConfig.js';

const PACKAGE_ID = process.env.SUI_PACKAGE_ID;
const MODULE_NAME = 'marketplace';
const CREATE_FUNCTION = 'create';

export const get_listings = async (req, res) => {
    const marketplace = database.ref('marketplace');
    const snapshot = await marketplace.once("value");

    return res.status(200).json({ response: snapshot.val() });
}

export const create_blockchain_listing = async (req, res) => {
    const { address, price, id } = req.body;

    try {
        const hashed = crypto.createHash('sha256').update(address).digest('hex');

        const marketplace = database.ref(`marketplace`)

        const collections = database.ref(`collections/${hashed}`);
        const snapshot = await collections.orderByChild("id").equalTo(id).once("value");
        
        if(!snapshot.exists()) {
            return res.status(400).json({ error: "Sprite ID does not exist for player" });
        }

        const key = Object.keys(snapshot.val())[0];
        const sprite = await collections.child(key).once("value");

        const { minted_ID } = sprite.val();

        console.log('MINTED_ID:', minted_ID);

        if(!minted_ID) {
            return res.status(400).json({ error: "You can only sell a minted creature!" });
        }

        if(price <= 0 || price.isNaN) {
            return res.status(400).json({ error: "Asking price must be a positive number" });
        }

        //Move Module
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::${CREATE_FUNCTION}`,
            arguments: [
                tx.object(minted_ID),
                tx.pure(price)
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

export const confirm_blockchain_listing = async (req, res) => {
    //Once the listing is signed for and created on the blockchain, this updates our backend with the information
    try {
        const { address, digest } = req.body;

        if(!digest) {
            return res.status(400).json({ error: "Missing Digest for Transaction Block!" });
        }
    
        const tx = await get_transaction_block(digest);
        console.log(tx);
        console.log(Object.keys(tx));
        
        if(tx.objectChanges) {
            if(tx.objectChanges.length > 0) {
                const { objectId } = tx.objectChanges
                    .filter(obj => obj.type == 'created' && obj.objectType.includes('marketplace'))
                    [0];

                //Address = Tx Address?
                const hashed = crypto.createHash('sha256').update(address).digest('hex');
                const all_listings = database.ref(`marketplace/${hashed}`);
                const snapshot = all_listings.once('value');

                const listing_obj = {
                    id: objectId,
                }
                
                //First Listing
                if(!snapshot.exists()) {
                    all_listings.update({ [0]: listing_obj });
                    return res.status(200).json({ response: listing_obj });
                }

                const len = Object.keys(snapshot.val());
                all_listings.update({ [len]: listing_obj });
                return res.status(200).json({ response: listing_obj });
            }
        }
        
    } catch(err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
}

export const buy = async (req, res) => {

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