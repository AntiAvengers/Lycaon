import cron from 'node-cron';
import { database } from '../database/firebaseConfig.js';

// const schedule = process.env.MODE == 'DEVELOPMENT' ? '* * * * *' : '* */12 * * *';
const schedule = '* * * * *';

//Giving players keys (every minute in development) every 12 hours
console.log('. . . Loaded cron-job "Key"', `(${schedule})`);
cron.schedule(schedule, async () => {
    try {
        const users_ref = database.ref('users');
        const snapshot = await users_ref.once("value");
        const users = snapshot.val();

        for(const user_id in users) {
            if(user_id !== "_init") {
                const { keys } = users[user_id];
                if(keys == 0 || keys == 1) {
                    database.ref(`users/${user_id}`)
                        .update({ keys: keys + 1 });
                } 
            }
        }
    } catch(err) {
        console.error(err);
    }
});
