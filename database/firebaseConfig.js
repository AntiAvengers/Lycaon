// const fs = require('fs');
// const path = require('path');
// const dotenv = require("dotenv");
// dotenv.config();

// const admin = require("firebase-admin");

// const serviceAccount = require('./' + process.env.SERVICE_ACCOUNT_KEY);

// import fs from 'fs';
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
  score: 0,
  key_used: false
}

const default_leaderboard = {
  word_puzzle: [{ profile_name: 'Lycaon', score: -1 }]
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
      game_rules: default_game_rules
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
    db.update({ marketplace: [] });
  }
}).then(() => {
  //DEV MODE - Resets database everytime server is restarted
  if(process.env.MODE == "DEVELOPMENT") {
    console.log('. . . Purging Firebase Database [DEVELOPMENT MODE]')
    db.set({
      users: { _init: true },
      collections: { _init: true },
      leaderboard: default_leaderboard,
      game_rules: default_game_rules,
      marketplace: []
    });
  } 
});

// Export the database reference
// module.exports = {
//   database: admin.database(),
//   schema: { default_user, default_game_session, default_collection }
// }

export const database = admin.database();
export const schema = {
  default_user, 
  default_game_session, 
  default_collection
}

// export default {
//   database,
//   schema: { default_user, default_game_session, default_collection }
// }
