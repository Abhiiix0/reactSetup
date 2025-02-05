// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiG4WXcHMpceILCFO0lXPCueiCVUVG5bA",
  authDomain: "test-b159f.firebaseapp.com",
  projectId: "test-b159f",
  storageBucket: "test-b159f.firebasestorage.app",
  messagingSenderId: "890869289845",
  appId: "1:890869289845:web:a8dbbe428fc78bd1f6393c",
  measurementId: "G-26KLV7HQ3M",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
export const auth = getAuth();
