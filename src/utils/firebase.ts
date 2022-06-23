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
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getFirestore
} from 'firebase/firestore';

export enum IssueType {
  Compromised = 'compromised',
  NotFound = 'not found',
  Obsolete = 'obsolete'
}

// Collections
export type DatabaseVariant = {
  wallet: string;
  variantPublicKey: string;
  issueType: IssueType;
};

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCf0u2RX-7EFySUxI26yotkF26hD519c1s',
  authDomain: 'variant-kontent.firebaseapp.com',
  projectId: 'variant-kontent',
  storageBucket: 'variant-kontent.appspot.com',
  messagingSenderId: '358818717767',
  appId: '1:358818717767:web:f292565842c943b24a1162'
};

// Initialize Firebase
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

export const submitDataToDatabase = async (
  wallet: string,
  issueType: IssueType,
  variantPublicKey: string
) => {
  try {
    await addDoc(databaseVariantsCollection, {
      wallet: wallet,
      issueType: issueType,
      variantPublicKey: variantPublicKey
    });
  } catch (err) {
    console.error((err as { message?: string })?.message ?? 'Unknown error occurred');
  }
};

export const databaseVariantsCollection = collection(
  db,
  'databaseVariants'
) as CollectionReference<DatabaseVariant>;

export const databaseVariantsDocument = (id: string) =>
  doc(db, 'databaseVariants', id) as DocumentReference<DatabaseVariant>;
