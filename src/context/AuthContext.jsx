import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithRedirect,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from '../firebase';

const AuthContext = createContext(null);

export const ALLOWED_ADMINS = [
  'admin@gmail.com',
  'sachitmohite6@gmail.com'
];

export const DEMO_ADMIN_PASSWORD = 'admin123';
export const MIN_PASSWORD_LENGTH = 8;

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

export const isDemoAdminLogin = (email, password) => {
  const normalized = normalizeEmail(email);
  return ALLOWED_ADMINS.map(e => e.toLowerCase()).includes(normalized) && String(password) === DEMO_ADMIN_PASSWORD;
};

export const buildDemoAdminToken = (email) => {
  return `demo-admin.${encodeURIComponent(normalizeEmail(email))}`;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('thread_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedDemoUser = localStorage.getItem('thread_auth_user');
    const savedDemoToken = localStorage.getItem('thread_demo_admin_token');
    if (savedDemoUser && savedDemoToken) {
      try {
        const parsed = JSON.parse(savedDemoUser);
        const email = normalizeEmail(parsed.email);
        if (isDemoAdminLogin(email, DEMO_ADMIN_PASSWORD)) {
          setCurrentUser(parsed);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email?.toLowerCase() || '';
        const isAdm = ALLOWED_ADMINS.map(e => e.toLowerCase()).includes(email);
        const userObj = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || (email === 'sachitmohite6@gmail.com' ? 'Sachit Mohite' : (isAdm ? 'Administrator' : email.split('@')[0])),
          role: isAdm ? 'admin' : 'customer',
          avatar: (firebaseUser.displayName || firebaseUser.email || 'U')[0].toUpperCase(),
          photoURL: firebaseUser.photoURL || null
        };
        setCurrentUser(userObj);
        localStorage.setItem('thread_auth_user', JSON.stringify(userObj));
        localStorage.removeItem('thread_demo_admin_token');
      } else {
        setCurrentUser(null);
        localStorage.removeItem('thread_auth_user');
        localStorage.removeItem('thread_demo_admin_token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = Boolean(
    currentUser && 
    currentUser.email && 
    ALLOWED_ADMINS.map(e => e.toLowerCase()).includes(currentUser.email.toLowerCase())
  );

  // Firebase Google Sign-In
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.toLowerCase() || '';
      const isAdm = ALLOWED_ADMINS.map(e => e.toLowerCase()).includes(email);
      const userObj = {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName || email.split('@')[0],
        role: isAdm ? 'admin' : 'customer',
        avatar: (result.user.displayName || email || 'G')[0].toUpperCase(),
        photoURL: result.user.photoURL || null
      };
      setCurrentUser(userObj);
      localStorage.setItem('thread_auth_user', JSON.stringify(userObj));
      return { success: true, user: userObj };
    } catch (err) {
      console.error("Firebase Google Auth error:", err);

      // Popup blockers and some browser privacy settings require a full-page redirect.
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
        await signInWithRedirect(auth, googleProvider);
        return { success: true, redirecting: true };
      }

      throw err;
    }
  };

  // Firebase Email & Password Sign-In
  const loginWithEmail = async (email, password) => {
    const normalized = normalizeEmail(email);

    if (String(password || '').length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
    }

    if (isDemoAdminLogin(normalized, password)) {
      const userObj = {
        uid: `demo-${normalized.replace(/[^a-z0-9]/gi, '')}`,
        email: normalized,
        name: normalized === 'sachitmohite6@gmail.com' ? 'Sachit Mohite' : 'Administrator',
        role: 'admin',
        avatar: 'A',
        photoURL: null
      };
      const token = buildDemoAdminToken(normalized);
      setCurrentUser(userObj);
      localStorage.setItem('thread_auth_user', JSON.stringify(userObj));
      localStorage.setItem('thread_demo_admin_token', token);
      return { success: true, user: userObj };
    }

    try {
      const result = await signInWithEmailAndPassword(auth, normalized, password);
      const isAdm = ALLOWED_ADMINS.map(e => e.toLowerCase()).includes(normalized);
      const userObj = {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName || (normalized === 'sachitmohite6@gmail.com' ? 'Sachit Mohite' : (isAdm ? 'Administrator' : normalized.split('@')[0])),
        role: isAdm ? 'admin' : 'customer',
        avatar: (normalized || 'U')[0].toUpperCase(),
        photoURL: null
      };
      setCurrentUser(userObj);
      localStorage.setItem('thread_auth_user', JSON.stringify(userObj));
      localStorage.removeItem('thread_demo_admin_token');
      return { success: true, user: userObj };
    } catch (firebaseErr) {
      throw firebaseErr;
    }
  };

  // Firebase Email & Password Registration
  const signupWithEmail = async (email, password, name = '') => {
    const normalized = email.trim().toLowerCase();
    if (String(password || '').length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, normalized, password);
      const isAdm = ALLOWED_ADMINS.map(e => e.toLowerCase()).includes(normalized);
      const userObj = {
        uid: result.user.uid,
        email: result.user.email,
        name: name || normalized.split('@')[0],
        role: isAdm ? 'admin' : 'customer',
        avatar: (name || normalized || 'U')[0].toUpperCase(),
        photoURL: null
      };
      setCurrentUser(userObj);
      localStorage.setItem('thread_auth_user', JSON.stringify(userObj));
      return { success: true, user: userObj };
    } catch (err) {
      console.error("Firebase SignUp error:", err);
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    localStorage.removeItem('thread_auth_user');
    localStorage.removeItem('thread_demo_admin_token');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdmin,
      loading,
      signInWithGoogle,
      loginWithEmail,
      signupWithEmail,
      logout,
      getIdToken: async () => {
        const demoToken = localStorage.getItem('thread_demo_admin_token');
        if (demoToken) return demoToken;
        if (currentUser?.email && ALLOWED_ADMINS.map(e => e.toLowerCase()).includes(currentUser.email.toLowerCase())) {
          return buildDemoAdminToken(currentUser.email);
        }
        return auth.currentUser?.getIdToken ? auth.currentUser.getIdToken() : null;
      },
      ALLOWED_ADMINS
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
