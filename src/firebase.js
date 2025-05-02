// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABnmTMAMNl57ny2JpHDHI8HOIPf4dHBvw",
  authDomain: "skillswap-792bc.firebaseapp.com",
  projectId: "skillswap-792bc",
  storageBucket: "skillswap-792bc.appspot.com",
  messagingSenderId: "264322928465",
  appId: "1:264322928465:web:eeef984408c167c5180d70",
  measurementId: "G-CG9JDQ5JM5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export initialized services
export { app, auth, db, storage, analytics };

if (!navigator.onLine) {
  // Show a message to the user
}
