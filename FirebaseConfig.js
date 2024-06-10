// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, getReactNativePersistence, initializeAuth  } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZ-wd1gKVfbt7AFvFQbyekI9eM5AmPN4Y",
  authDomain: "r2cservices-b2725.firebaseapp.com",
  projectId: "r2cservices-b2725",
  storageBucket: "r2cservices-b2725.appspot.com",
  messagingSenderId: "849570048532",
  appId: "1:849570048532:web:64c7290f27e07b5ef0d501",
  measurementId: "G-R8QC4K289W"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP); // Initialize Firebase Storage

