import { initializeApp } from 'firebase/app';
import {
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
  deleteDoc,
  doc,
  DocumentReference,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where
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

export type DatabaseVariantWithId = {
  databaseVariant: DatabaseVariant;
  id: string;
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

const databaseVariantsTable = 'databaseVariants';

// Initialize Firebase
initializeApp(firebaseConfig);

// Authentication
const auth = getAuth();

export const signIn = () => signInAnonymously(auth);

export const signOut = () => authSignOut(auth);

// Subscribe to auth state changes
export const onAuthChanged = (callback: (u: User | null) => void) =>
  onAuthStateChanged(auth, callback);

// Firestore
const db = getFirestore();

export const databaseVariantsCollection = collection(
  db,
  databaseVariantsTable
) as CollectionReference<DatabaseVariant>;

const databaseVariantsDocument = (id: string) =>
  doc(db, databaseVariantsTable, id) as DocumentReference<DatabaseVariant>;

export const submitDocumentToDatabase = async (databaseVariant: DatabaseVariant) => {
  try {
    const dbVariant = await getDatabaseVariantOrNull(databaseVariant.variantPublicKey);

    if (dbVariant) {
      updateDatabaseVariant(dbVariant.id, databaseVariant);
    } else {
      addDoc(databaseVariantsCollection, databaseVariant);
    }
  } catch (err) {
    console.error((err as { message?: string })?.message ?? 'Unknown error occurred');
  }
};

export const getDatabaseVariantOrNull = async (
  solanaAccountVariantPublicKey: string
): Promise<DatabaseVariantWithId | null> => {
  const q = query(
    collection(db, databaseVariantsTable),
    where('variantPublicKey', '==', solanaAccountVariantPublicKey)
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const databaseVariant = querySnapshot.docs[0].data() as DatabaseVariant;
    const id = querySnapshot.docs[0].id;
    return { databaseVariant, id };
  }

  return null;
};

export const updateDatabaseVariant = async (id: string, newDocument: DatabaseVariant) => {
  const document = databaseVariantsDocument(id);
  updateDoc(document, newDocument);
};

export const removeDatabaseVariant = (id: string) => {
  const document = databaseVariantsDocument(id);
  deleteDoc(document);
};

export const tryRemoveDatabaseVariantByPublicKey = async (publicKey: string) => {
  const dbVariant = await getDatabaseVariantOrNull(publicKey);
  if (dbVariant) removeDatabaseVariant(dbVariant.id);
};
