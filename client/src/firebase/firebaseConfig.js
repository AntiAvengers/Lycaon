import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVTCWmTpJHhN5E7ZxnJVMpHojL2NWlP5A",
  authDomain: "suikle.firebaseapp.com",
  databaseURL: "https://suikle-default-rtdb.firebaseio.com",
  projectId: "suikle",
  storageBucket: "suikle.firebasestorage.app",
  messagingSenderId: "484639036402",
  appId: "1:484639036402:web:4b3c6716b39107e448916b",
  measurementId: "G-D0PH32GXRX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);