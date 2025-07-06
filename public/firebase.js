// Import Firebase scripts
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqgGo26traeTqgq6NIBo9rI_lfAqLaj40",
  authDomain: "daily-paper-1a069.firebaseapp.com",
  projectId: "daily-paper-1a069",
  storageBucket: "daily-paper-1a069.firebasestorage.app",
  messagingSenderId: "793224248805",
  appId: "1:793224248805:web:abee0fd64c73d54d80030c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const usersCollection = collection(db, "users");
export const auth = getAuth(app);
