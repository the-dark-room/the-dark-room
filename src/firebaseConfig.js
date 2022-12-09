import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, onSnapshot, 
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  getDoc, updateDoc,
} from "firebase/firestore";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signOut, signInWithEmailAndPassword,
//   onAuthStateChanged, 

// } from 'firebase/auth'

const firebaseConfig = {
  // add stuff
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// export const auth = getAuth(firebaseApp)

// export default firebaseApp;
export const db = getFirestore(firebaseApp);
