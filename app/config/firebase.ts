import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDksqbJuKGQb2K9MGXfuntFAezo1JoYmK4",
  authDomain: "advanced-todo-app-aae8e.firebaseapp.com",
  projectId: "advanced-todo-app-aae8e",
  storageBucket: "advanced-todo-app-aae8e.firebasestorage.app",
  messagingSenderId: "427659585258",
  appId: "1:427659585258:web:856c5997f69d1bd04dd993",
  measurementId: "G-L7KFBPM5H2",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
