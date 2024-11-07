import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // If you're using Authentication
import { getFirestore } from "firebase/firestore"; // If you're using Firestore

//  Firebase web app configuration
//  In a real life production environment, these values would
//  be kept outside of source control
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

//  Initial the firebase configuration
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
