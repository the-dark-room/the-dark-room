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
  apiKey: "AIzaSyAvqbghBgnzrgFyCkfHnJrWgDWSRXBNaeY",
  authDomain: "darkroom-5a543.firebaseapp.com",
  projectId: "darkroom-5a543",
  storageBucket: "darkroom-5a543.appspot.com",
  messagingSenderId: "588158440743",
  appId: "1:588158440743:web:680f353fc5ca0f6bc68502"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// export const auth = getAuth(firebaseApp)

// export default firebaseApp;
export const db = getFirestore(firebaseApp);
