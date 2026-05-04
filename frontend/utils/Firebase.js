import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY ,
  authDomain: "ai-powered-lms-8ff10.firebaseapp.com",
  projectId: "ai-powered-lms-8ff10",
  storageBucket: "ai-powered-lms-8ff10.firebasestorage.app",
  messagingSenderId: "679931543326",
  appId: "1:679931543326:web:7c08066db340ad20f3d30f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth,provider}