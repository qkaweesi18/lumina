import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

/* --------------------------------------------------------------
 * 2️⃣ Firebase configuration – copy‑paste the values you provided
 * -------------------------------------------------------------- */
const firebaseConfig = {
  // 👉 Replace the placeholder below with the real key you gave earlier
  apiKey: "AIzaSyBCnPvhCBF_1aRfZBvuA5sUT7s8Epaa430",
  authDomain: "fir-436615.firebaseapp.com",
  projectId: "firebase-436615",
  storageBucket: "firebase-436615.firebasestorage.app",
  messagingSenderId: "117175962061",
  appId: "1:117175962061:web:dc80c398b9803fd0b4dc84",
  measurementId: "G-6VRFNECSDN",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

/* --------------------------------------------------------------
 * 4️⃣ Export commonly‑used services & helper functions
 * -------------------------------------------------------------- */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

/* ---------------------------------------------------------------
 * 5️⃣ Authentication helpers (sign‑up, sign‑in, sign‑out, etc.)
 * ---------------------------------------------------------------- */
export const signUp = async (email, password) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const signIn = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const subscribeAuthChanges = (cb) => {
  return onAuthStateChanged(auth, cb);
};

/* ---------------------------------------------------------------
 * 6️⃣ Firestore helpers – CRUD for the "products" collection
 * ---------------------------------------------------------------- */
export const productsCollection = collection(db, "products");

export const fetchProducts = () => {
  const q = query(productsCollection, orderBy("name"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  });
};

export const addProduct = async (product) => {
  const docRef = await addDoc(productsCollection, product);
  return docRef.id;
};

export const updateProduct = async (id, updates) => {
  await updateDoc(doc(productsCollection, id), updates);
};

export const deleteProduct = async (id) => {
  await deleteDoc(doc(productsCollection, id));
};