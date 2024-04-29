// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDB8Y5CD1xGRq63ZM3FX0C4s2YV3-_ccEs",
  authDomain: "r2cservices-1cad5.firebaseapp.com",
  projectId: "r2cservices-1cad5",
  storageBucket: "r2cservices-1cad5.appspot.com",
  messagingSenderId: "215228432809",
  appId: "1:215228432809:web:e1654f9f23e83cdc4a84b8",
  measurementId: "G-P5HW8BV32D"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

const analytics = getAnalytics(FIREBASE_APP);