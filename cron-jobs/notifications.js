import cron from 'node-cron';
import { database } from '../database/firebaseConfig.js';

const schedule = process.env.MODE == 'DEVELOPMENT' ? '* * * * *' : '0 0 * * *';

//Giving players keys (every minute in development) every day at midnight
console.log('. . . Loaded cron-job "Notifications"', `(${schedule})`);
cron.schedule(schedule, async () => {
    try {
        const notifications_ref = database.ref('notifications');
        const snapshot = await notifications_ref.once("value");
        const notifications = snapshot.val();

        for(const user_id in notifications) {
            if(user_id !== "_init") {
                for(const key in notifications[user_id]) {
                    let { delete_date } = notifications[user_id][key];
                    if(delete_date) {
                        const today = new Date();
                        delete_date = new Date(delete_date);
                        if(delete_date <= today) {
                            database.ref(`notifications/${user_id}/${key}`).set({});
                        }
                    }
                }
            }
        }
    } catch(err) {
        console.error(err);
    }
});
