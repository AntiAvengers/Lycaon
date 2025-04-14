const crypto = require('crypto');
const { database, schema } = require('../../database/firebaseConfig.js');

const get_listings = async (req, res) => {
    const marketplace = database.ref('marketplace');
    const snapshot = await marketplace.once("value");

    return res.status(200).json({ response: snapshot.val() });
}

const create_listing = async (req, res) => {
    const { address, asking_price, creature} = req.body;
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
        id: randomUUID(),
        address: address,
        creature: creature,
        asking_price: asking_price,
    };

    console.log('Player Listing:');
    console.log(player_listing);

    const marketplace = database.ref('marketplace');
    const market_snapshot = await marketplace.once("value");
    const listings = market_snapshot.val() || [];
    listings.push(player_listing);

    await marketplace.set(listings)
    return res.status(200).json({ response: `Listing succesfully created!`, listing: player_listing })
}

const read_listing = async (req, res) => {
    const { address, asking_price, creature} = req.body;
    const { type, rarity, minted_ID } = creature;

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const marketplace = database.ref('marketplace');
    const snapshot = await marketplace.once("value");

    const all_listings = snapshot.val();
    const player_listings = all_listings.filter(obj => obj.minted_ID == minted_ID);

    return res.status(200).json({ response: player_listings });
}

const read_all_listings = async (req, res) => {
    const { address, asking_price, creature} = req.body;
    const { type, rarity, minted_ID } = creature;

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const marketplace = database.ref('marketplace');
    const snapshot = await marketplace.once("value");

    const all_listings = snapshot.val();
    const player_listings = all_listings.filter(obj => obj.address == address);

    return res.status(200).json({ response: player_listings });
}

const update_listing = async (req, res) => {
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

const delete_listing = async (req, res) => {
    
}


module.exports = {
    get_listings,
    create_listing,
    read_listing,
    read_all_listings,
    update_listing,
    delete_listing,
}