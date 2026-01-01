/**
 * Configuración de Firebase para Gallinapp (Web)
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBYQxBE85YnWANj7lxuyCNVM5Fu0ZqWWt8",
  authDomain: "gallinapp-ac9d8.firebaseapp.com",
  projectId: "gallinapp-ac9d8",
  storageBucket: "gallinapp-ac9d8.firebasestorage.app",
  messagingSenderId: "216089169768",
  appId: "1:216089169768:web:35841d73e72caceb5ad0dd"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);

// Inicializar Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Storage
export const storage = getStorage(app);

export const firebase = {
  app,
  auth,
  googleProvider,
  db,
  storage
};

export default firebase;





