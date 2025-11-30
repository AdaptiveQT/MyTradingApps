import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- YOUR FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyA_tfhGK92Nyel7xdI2GY77I88Fivn5k6s",
  authDomain: "aqt-trading.firebaseapp.com",
  projectId: "aqt-trading",
  storageBucket: "aqt-trading.firebasestorage.app",
  messagingSenderId: "257399313312",
  appId: "1:257399313312:web:984f1e273e8dc27b720ac5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);