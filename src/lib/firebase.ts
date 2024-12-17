import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const saveUserProgress = async (userId: string, completedLessons: string[]) => {
  try {
    const userRef = doc(db, 'users', userId);
    let retries = 3;
    while (retries > 0) {
      try {
        const docSnap = await getDoc(userRef);
        const currentData = docSnap.exists() ? docSnap.data() : {};
        
        await setDoc(userRef, {
          ...currentData,
          completedLessons: completedLessons,
          updatedAt: new Date().toISOString()
        });
        return true;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return false;
  } catch (error) {
    console.error('Error saving progress:', error);
    return false;
  }
};

export const getUserProgress = async (userId: string): Promise<string[]> => {
  try {
    const userRef = doc(db, 'users', userId);
    let retries = 3;
    while (retries > 0) {
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          return data.completedLessons || [];
        }
        await setDoc(userRef, { completedLessons: [] }, { merge: true });
        return [];
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return [];
  } catch (error) {
    console.error('Error getting progress:', error);
    return [];
  }
};

export const saveUserTokens = async (userId: string, tokens: number) => {
  try {
    const userRef = doc(db, 'users', userId);
    let retries = 3;
    while (retries > 0) {
      try {
        const docSnap = await getDoc(userRef);
        const currentData = docSnap.exists() ? docSnap.data() : {};
        
        await setDoc(userRef, {
          ...currentData,
          tokens: tokens,
          updatedAt: new Date().toISOString()
        });
        return true;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return false;
  } catch (error) {
    console.error('Error saving tokens:', error);
    return false;
  }
};

export const getUserTokens = async (userId: string): Promise<number> => {
  try {
    const userRef = doc(db, 'users', userId);
    let retries = 3;
    while (retries > 0) {
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          return data.tokens || 0;
        }
        return 0;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    return 0;
  } catch (error) {
    console.error('Error getting tokens:', error);
    return 0;
  }
};