import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// User's provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsspCpbESyA4qE2yqYn2GKxBCAcKHq4rM",
  authDomain: "project-9b27d.firebaseapp.com",
  projectId: "project-9b27d",
  storageBucket: "project-9b27d.firebasestorage.app",
  messagingSenderId: "289854077201",
  appId: "1:289854077201:web:5905c1fed97cbd930174b0",
  measurementId: "G-GXHV3NXV2M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Analytics conditionally for browser safety
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

// Export Auth helper methods
export {
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
};

export default app;
