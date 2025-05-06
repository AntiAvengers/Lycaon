import cron from 'node-cron';
import 'dotenv/config';

import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { database } from '../database/firebaseConfig.js';

//Giving players shards (every minute if development) every 4 hours based on sprite rarity
const schedule = process.env.MODE == 'DEVELOPMENT' ? '* * * * *' : '* */4 * * *';

const ref = JSON.parse(fs.readFileSync(path.join(__dirname, '../database/rarity.json'), 'UTF-8'));

console.log('. . . Loaded cron-job "sprites"', `(${schedule})`);
cron.schedule(schedule, async () => {
    try {
        const users_ref = database.ref("users");
        const users_snapshot = await users_ref.once("value");
        const users = users_snapshot.val();
        const collections_ref = database.ref('collections');
        const collections_snapshot = await collections_ref.once("value");
        const collections = collections_snapshot.val();

        for(const user_id in collections) {
            if(user_id !== "_init") {
                const { shards } = users[user_id];
                let shards_to_add = 0;
                for(const index in collections[user_id]) {
                    const { type, rarity, hunger, experience, on_marketplace } = collections[user_id][index];
                    if(hunger > 0 && !on_marketplace) {
                        shards_to_add += (300 * ref[rarity].id);
                        let new_experience = experience < 42 ? experience + 1 : experience;
                        const evolve = new_experience >= 42 && !minted_ID ? true : false;
                        database.ref(`collections/${user_id}/${index}`)
                            .update({ 
                                hunger: hunger - 1 < 0 ? 0 : hunger - 1,
                                experience: new_experience,
                                can_evolve: evolve
                            });
                    }
                }
                if(shards_to_add > 0) {
                    database.ref(`users/${user_id}`)
                        .update({ shards: shards + shards_to_add });
                }
            }
        }
    } catch(err) {
        console.error(err);
    }
});
