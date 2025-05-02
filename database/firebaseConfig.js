import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
import 'dotenv/config';

import admin from 'firebase-admin';

import serviceAccount from './firebase-config.json' with { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

//Defaults for Data Structures
const default_user = {
  profile_name: "",
  wallet_id: "",
  keys: 0,
  shards: 0,
  pages: 0,
  highest_score: {
    word_puzzle: 0
  },
  last_login: Date.now(),
}

const default_game_session = {
  game_type: "",
  puzzle_data: [-1],
  validate_on_client: false,
  valid_answers: [-1],
  submitted_answers: [-1],
  score: 0,
  key_used: true
}

const default_leaderboard = {
  word_puzzle: { _init: true } 
}

const default_collection = {
  nickname: "",
  favorite: false,
  type: "",
  rarity: "",
  stage: 0,
  date_of_birth: Date.now(),
  hunger: 10,
  traits: [],
  minted_ID: false
}

//Game rules
const default_game_rules = {
  word_puzzle: {
    scoring: [
      { score: 10, reward: 3 },
      { score: 6, reward: 2 },
      { score: 3, reward: 1 },
      { score: 0, reward: 0 }
    ]
  }
}

const db = admin.database().ref("/");
db.once('value', snapshot => {
  const data = snapshot.val();

  if(!data) {
    console.log('. . . Initializing Leaderboard in Database');
    console.log('. . . Initializing Game Rules in Database');
    console.log('. . . Initializing Users in Database');
    console.log('. . . Initializing User Collections in Database');
    return db.set({
      users: { _init: true },
      collections: { _init: true },
      leaderboard: default_leaderboard,
      game_rules: default_game_rules,
      marketplace: { _init: true }
    });
  }

  if(!data.leaderboard) {
    console.log('. . . Initializing Leaderboard in Database');
    db.update({ leaderboard: default_leaderboard });
  }

  if(!data.game_rules) {
    console.log('. . . Initializing Game Rules in Database');
    db.update({ game_rules: default_game_rules})
  }

  if(!data.users) {
    console.log('. . . Initializing Users in Database');
    db.update({ users: { _init: true }});
  }

  if(!data.collections) {
    console.log('. . . Initializing User Collections in Database');
    db.update({ collections: { _init: true }});
  }

  if(!data.marketplace) {
    console.log('. . . Initializing Marketplace in Database');
    db.update({ marketplace: { _init: true }});
  }
}).then(() => {
  //DEV MODE - Resets database everytime server is restarted
  if(process.argv.length > 2) {
    const reset_commands = ['-d', '-r', 'delete', 'del', 'purge', 'reset', 'clear', 'wipe', 'flush'];
    const command = process.argv[2].toLowerCase();
    if(process.env.MODE == "DEVELOPMENT" && reset_commands.includes(command)) {
      console.log('. . . Purging Firebase Database [DEVELOPMENT MODE]')
      db.set({
        users: { _init: true },
        collections: { _init: true },
        leaderboard: default_leaderboard,
        game_rules: default_game_rules,
        marketplace: { _init: true }
      });
    } 
  }
});

export const database = admin.database();
export const auth = admin.auth()
export const schema = {
  default_user, 
  default_game_session, 
  default_collection
}
