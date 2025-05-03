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

function pull_sprite() {
    const RNG = crypto.getRandomValues(new Uint32Array(2));
    const RNG_rarity = RNG[0];
    const weight = normalize_U32(RNG_rarity, 1000);
    const RNG_sprite = RNG[1];

    let rarity_result = null
    let cumulative_pull_rate = 0;

    for(const key in rarity) {
        const { id, pull_rate } = rarity[key];
        cumulative_pull_rate += pull_rate;
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

    return sprite;
}

export const pull = async (req, res) => {
    const { address } = req.user;
    const { ten_pull } = req.body;

    const hashed = crypto.createHash('sha256').update(address).digest('hex');

    const user_ref = database.ref(`users/${hashed}`);
    const user_snapshot = await user_ref.once("value");
    const user = user_snapshot.val();
    const { pages } = user;

    if(!ten_pull && pages < 1 || ten_pull && pages < 10) {
        return res.status(403).json({ error: "Player does not have enough pages to pull" });
    }

    const collection = database.ref(`collections/${hashed}`);
    const snapshot = await collection.once("value");

    //Player's Collection is full
    if(snapshot.exists()) {
        if(snapshot.val().length >= 100 || (ten_pull && snapshot.val().length >= 91)) {
            return res.status(403).json({ error: "Player's Collection is/will be full!" });
        }
    }

    let results = [pull_sprite()];
    if(ten_pull) {
        for(let i = 0; i < 9; i++) {
            results.push(pull_sprite());
        }
    }

    const UUID = snapshot.exists() ? Object.keys(snapshot.val()) : [];

    const output = {};
    for(let i = 0; i < results.length; i++) {
        let key = crypto.randomUUID();
        while(UUID.includes(key)) {
            key = crypto.randomUUID();
        }
        output[key] = results[i];
    }
    collection.update(output);
    user_ref.update({ pages: (pages - results.length) });
    
    return res.status(200).json({ response: results });
}

export const get_pull_rates = async (req, res) => {
    const output = [];

    const total_weight = Object.values(rarity)
        .map(obj => obj.pull_rate)
        .reduce((a,b) => a+b);
    
    for(const key in rarity) {
        const { pull_rate } = rarity[key];
        const percentage = pull_rate / total_weight;
        output.push({ name: key, percentage: percentage });
    }

    return res.status(200).json({ response: output });
}