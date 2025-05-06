import * as crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { database } from '../../database/firebaseConfig.js';

const pantry = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database/pantry.json'), 'UTF-8'));

export const buy_food = async (req, res) => {
    const { address } = req.user;
    const { food_type, amount } = req.body;
    const hashed = crypto.createHash('sha256').update(address).digest('hex');
    let pantry_ref = database.ref(`pantry/${hashed}`);
    let snapshot = await pantry_ref.once("value");

    if(!snapshot.exists()) {
        const schema = {};
        for(const key in pantry) { schema[key] = 0; }
        pantry_ref.update(schema); 
        pantry_ref = database.ref(`pantry/${hashed}`);
        snapshot = await pantry_ref.once("value");
    }
    
    const user_pantry = snapshot.val();

    const shards_ref = database.ref(`users/${hashed}/shards`);
    const shards_snapshot = await shards_ref.once("value");
    const shards = shards_snapshot.val();
    const { cost } = pantry[food_type];
    if(shards < (cost * amount)) {
        return res.status(400).json({ error: "You do not have enough Shards!" });
    }
    
    shards_ref.set(shards - (cost * amount));
    pantry_ref.update({ [food_type]: user_pantry[food_type] + amount });
    return res.status(200).json({ response: { food_type, amount, cost: cost * amount } });
}

export const get_pantry = async (req, res) => {
    const { address } = req.user;
    const hashed = crypto.createHash('sha256').update(address).digest('hex');
    let pantry_ref = database.ref(`pantry/${hashed}`);
    let snapshot = await pantry_ref.once("value");
    if(!snapshot.exists()) {
        const schema = {};
        for(const key in pantry) { schema[key] = 0; }
        pantry_ref.update(schema); 
        pantry_ref = database.ref(`pantry/${hashed}`);
        snapshot = await pantry_ref.once("value");
    }
    return res.status(200).json({ response: pantry });
}