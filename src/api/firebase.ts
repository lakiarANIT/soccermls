import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCojT3VZVXZCU4cTh4tUjCKsnaVJOX8zM4",
  authDomain: "soccermls-618b0.firebaseapp.com",
  projectId: "soccermls-618b0",
  storageBucket: "soccermls-618b0.firebasestorage.app",
  messagingSenderId: "10448729286",
  appId: "1:10448729286:web:928cfce4e907ad8f6053c7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);
export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);
export const signOut = () => auth.signOut();