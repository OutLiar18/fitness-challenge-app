import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1WVPLAzv-67KFconKDu7GmiTXKe_eoNY",
  authDomain: "fitnesschallengeapp-9e87f.firebaseapp.com",
  projectId: "fitnesschallengeapp-9e87f",
  storageBucket: "fitnesschallengeapp-9e87f.firebasestorage.app",
  messagingSenderId: "411518488508",
  appId: "1:411518488508:web:2efef487f241d4a2dfe5b9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);