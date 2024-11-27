import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "ijakinhy-chart-app.firebaseapp.com",
  projectId: "ijakinhy-chart-app",
  storageBucket: "ijakinhy-chart-app.appspot.com",
  messagingSenderId: "562838929700",
  appId: "1:562838929700:web:ee4296a7faf78b4a4f73b1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
