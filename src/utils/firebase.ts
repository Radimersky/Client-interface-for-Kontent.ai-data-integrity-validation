// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  // eslint-disable-next-line no-unused-vars
  User,
  getAuth,
  signOut as authSignOut,
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth';
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getFirestore
} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCf0u2RX-7EFySUxI26yotkF26hD519c1s',
  authDomain: 'variant-kontent.firebaseapp.com',
  projectId: 'variant-kontent',
  storageBucket: 'variant-kontent.appspot.com',
  messagingSenderId: '358818717767',
  appId: '1:358818717767:web:f292565842c943b24a1162'
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
initializeApp(firebaseConfig);

// Authentication
const auth = getAuth();

// Sign in handler
export const signIn = () => signInAnonymously(auth);

// Sign out handler
export const signOut = () => authSignOut(auth);

// Subscribe to auth state changes
export const onAuthChanged = (callback: (u: User | null) => void) =>
  onAuthStateChanged(auth, callback);

// Firestore
const db = getFirestore();

// Collections
export type Variant = {
  wallet: string;
  projectId: string;
  variantId: string;
  integrityViolated: boolean;
  //description?: string;
};

export const variantsCollection = collection(db, 'variants') as CollectionReference<Variant>;

export const variantsDocument = (id: string) =>
  doc(db, 'variants', id) as DocumentReference<Variant>;
