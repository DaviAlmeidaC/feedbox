
import { initializeApp } from "firebase/app";

import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAA4iQSUl_ThxqmZCc7dZQohIyAGDa_pWI",
  authDomain: "feedbox-8dbdb.firebaseapp.com",
  projectId: "feedbox-8dbdb",
  storageBucket: "feedbox-8dbdb.firebasestorage.app",
  messagingSenderId: "50039221442",
  appId: "1:50039221442:web:c5f7ca428f7fb904b1df5b",
  measurementId: "G-F14PMP98HY"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);