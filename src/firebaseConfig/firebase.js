import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8YtOhDmdyTxA2L25EOcCJkKextcH2jLk",
  authDomain: "organdonate-a44c4.firebaseapp.com",
  projectId: "organdonate-a44c4",
  storageBucket: "organdonate-a44c4.firebasestorage.app",
  messagingSenderId: "907986948359",
  appId: "1:907986948359:web:c9accfe00ab42d997a75a2",
  measurementId: "G-RSKTNZYGWW",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore Database
