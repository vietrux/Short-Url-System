import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBgVSpirp4JiBTAHd18On0LrTk6kqDXPEc",
  authDomain: "vietrug.firebaseapp.com",
  projectId: "vietrug",
  storageBucket: "vietrug.appspot.com",
  messagingSenderId: "467084250785",
  appId: "1:467084250785:web:0dd571d69e35bb5c97eae0",
  measurementId: "G-5P11HF73YL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

