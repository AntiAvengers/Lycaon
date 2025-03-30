const dotenv = require("dotenv");
dotenv.config();

const admin = require("firebase-admin");

const serviceAccount = require('./' + process.env.SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

//DEV MODE - Resets database everytime server is restarted
if(process.env.MODE == "DEVELOPMENT") {
  const initial_data = {
    users: {}
  }
  admin.database().ref('/').set(initial_data);
}

// Export the database reference
module.exports = {
  database: admin.database()
}
