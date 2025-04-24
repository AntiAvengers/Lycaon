import * as crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { database } from '../../database/firebaseConfig.js';

const rarity = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database/rarity.json'), 'UTF-8'));
const sprites = JSON.parse(fs.readFileSync(path.join(__dirname, '../../database/sprites.json'), 'UTF-8'));

//Normalizes a unsigned 32-bit integer to [0, max]
function normalize_U32(value, max) {
    return (value / 0xFFFFFFFF) * max;
}

export const pull = async (req, res) => {
    const { address } = req.body;
    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const collection = database.ref(`collections/${hashed}`);
    const snapshot = await collection.once("value");

    //Player's Collection is full
    if(snapshot.exists()) {
        console.log(snapshot.val());
        if(snapshot.val().length >= 100) {
            res.status(403).json({ error: "Player's Collection is full!" });
        }
    }

    const RNG = crypto.getRandomValues(new Uint32Array(2));
    const RNG_rarity = RNG[0];
    const weight = normalize_U32(RNG_rarity, 1000);
    const RNG_sprite = RNG[1];

    let rarity_result = null
    let cumulative_pull_rate = 0;

    for(const key in rarity) {
        const { id, pull_rate } = rarity[key];
        cumulative_pull_rate += pull_rate;
        console.log(weight);
        if(weight < cumulative_pull_rate) {
            rarity_result = id;
            break;
        }
    }

    const sprites_pool = Object.values(sprites)
        .filter(obj => obj.rarity === rarity_result);

    const index = normalize_U32(RNG_sprite, sprites_pool.length - 1);

    let sprite_result = sprites_pool[index];

    //Database Update
    const sprite = {
        nickname: "",
        favorite: false,
        type: sprite_result.type,
        rarity: sprite_result.rarity_title,
        stage: 0,
        date_of_birth: Date.now(),
        hunger: 10,
        traits: [],
        minted_ID: false
    }

    //First sprite
    if(!snapshot.exists()) { 
        collection.set([sprite]);
        return res.status(200).json({ response: sprite_result });
    }

    //Otherwise pushes sprite to player collection
    const player_collection = snapshot.val();
    player_collection.push(sprite);
    collection.set(player_collection);
    return res.status(200).json({ response: sprite_result });
}