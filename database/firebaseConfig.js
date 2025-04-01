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

//Defaults for Data Structures
const default_user = {
  profile_name: "",
  wallet_id: "",
  keys: 0,
  shards: 0,
  pages: 0,
  highest_score: {
      game_type: "",
      score: 0
  },
  last_login: Date.now(),
}

const default_game_session = {
  game_type: "",
  puzzle_data: [-1],
  validate_on_client: false,
  valid_answers: [-1],
  submitted_answers: [-1],
  key_used: false
}

// Export the database reference
module.exports = {
  database: admin.database(),
  schema: { default_user, default_game_session }
}
