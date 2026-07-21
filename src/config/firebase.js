import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwX5LdFfk-MPukES3Lxf7OCJDbMCHStIk",
  authDomain: "minegocio-c2b84.firebaseapp.com",
  projectId: "minegocio-c2b84",
  storageBucket: "minegocio-c2b84.firebasestorage.app",
  messagingSenderId: "822641816055",
  appId: "1:822641816055:web:77231ab054e2aa389ffef2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
