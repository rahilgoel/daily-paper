// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDqgGo26traeTqgq6NIBo9rI_lfAqLaj40',
  authDomain: 'daily-paper-1a069.firebaseapp.com',
  projectId: 'daily-paper-1a069',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, getDoc, doc };
