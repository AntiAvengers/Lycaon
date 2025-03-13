const dotenv = require("dotenv");
dotenv.config();

const firebase = require('firebase/app');
const { getDatabase } = require("firebase/database");
const { getAnalytics } = require("firebase/analytics");

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Export the database reference
module.exports = {
  analytics: getAnalytics(app),
  database: getDatabase(app)
};

