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
// const schedule = process.env.MODE == 'DEVELOPMENT' ? '* * * * *' : '* */4 * * *';
const schedule = '* * * * *';

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
                    const { type, nickname, stage, rarity, hunger, experience, on_marketplace, minted_ID } = collections[user_id][index];
                    if(((hunger > 0 && stage >= 1) || stage == 0) && !on_marketplace) {
                        if(stage > 0) {
                            shards_to_add += (300 * ref[rarity].id);
                        }
                        let new_experience = experience < 3 ? experience + 1 : experience;
                        const evolve = new_experience >= 3 && stage !== 2 ? true : false;
                        const new_hunger = stage == 0 ? hunger : (hunger - 1 < 0 ? 0 : hunger - 1);
                        database.ref(`collections/${user_id}/${index}`)
                            .update({ 
                                hunger: new_hunger,
                                experience: new_experience,
                                can_evolve: evolve
                            });
                        
                        if(experience == 3) {
                            const notifications_ref = database.ref(`notifications/${user_id}`)
                            const notifications_snapshot = await notifications_ref.once("value");
                            const notifications_list = notifications_snapshot.val();
                            const total = !notifications_list ? 0 : Object.keys(notifications_list).length;
                            const notification = {
                                id: total + 1,
                                message: `Your Sprite "${nickname.length > 0 ? nickname : type}" can evolve!`,
                                read: false,
                                timestamp: Date.now()
                            }
                            notifications_ref.push(notification);
                        }
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
