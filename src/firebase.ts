import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import { CaPost, CaUser } from './model';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);
export const createCaPost = async (caPost: CaPost) => {
  try {
    const caPostCollectionRef = collection(db, 'posts');
    await addDoc(caPostCollectionRef, caPost);
  } catch (error) {
    console.error('Error adding CaPost: ', error);
  }
};

export const createUserProfile = async (userId: string, user: CaUser) => {
  try {
    const userProfileDocRef = doc(collection(db, 'users'), userId);
    await setDoc(userProfileDocRef, user, { merge: true });
  } catch (error) {
    console.error('Error adding UserProfile: ', error);
  }
};

export const getAuthenticatedUser = (): Promise<{
  user: User | null;
  userId: string | null;
}> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        if (user) {
          const userId = user.uid;
          resolve({ user, userId });
        } else {
          resolve({ user: null, userId: null });
        }
      },
      reject,
    );
  });
};

export const subscribeToUser = (
  userId: string,
  callback: (user: CaUser | null) => void,
) => {
  const userDocRef = doc(db, 'users', userId);
  const unsubscribe = onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      const user = doc.data() as CaUser;
      callback(user);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
};

export const getAllUsers = async () => {
  try {
    const usersCollectionRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollectionRef);
    const users = usersSnapshot.docs.map((doc) => doc.data());
    return users;
  } catch (error) {
    console.error('Error getting all users: ', error);
    throw error;
  }
};

export const uploadImageAndSaveUrl = async (
  userId: string,
  imageFile: File,
): Promise<string> => {
  try {
    // Get user document from Firestore
    const userDocRef = doc(db, 'users', userId);
    const storageRef = ref(storage, `images/${userId}/photoUrl.jpg`);
    await uploadBytes(storageRef, imageFile);
    // Get download URL for the uploaded image
    const downloadUrl = await getDownloadURL(storageRef);
    // Save download URL to user document in Firestore
    await setDoc(userDocRef, { photoUrl: downloadUrl });
    // Return download URL
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading image and saving URL: ', error);
    throw error;
  }
};

export const uploadMemeAndSaveUrl = async (
  userId: string,
  imageFile: File,
): Promise<string> => {
  try {
    // Upload image to Firebase Storage
    const storageRef = ref(storage, `images/${userId}/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);

    // Get download URL for the uploaded image
    const downloadUrl = await getDownloadURL(storageRef);

    // Save download URL to user document in Firestore
    const memeDocRef = doc(db, 'memes', userId);
    await updateDoc(memeDocRef, { imageUrl: downloadUrl });

    // Return download URL
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading image and saving URL: ', error);
    throw error;
  }
};

export const checkUserProfile = async (): Promise<boolean> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return false;
  }
  const profileDocRef = doc(db, 'users', currentUser.uid);
  const profileDoc = await getDoc(profileDocRef);
  return profileDoc.exists();
};

// Increment counter every time a new user logs in
// export const incrementUserCount = async (): Promise<number> => {
//   const counterDocRef = doc(db, 'counters', 'userCount');
//   const counterDoc = await getDoc(counterDocRef);
//   const currentCount = counterDoc.data()?.count || 0;
//   const currentUser = auth.currentUser;
//   if (currentUser && !counterDoc.data()?.users[currentUser.uid]) {
//     await updateDoc(counterDocRef, {
//       count: increment(1),
//     });
//     return currentCount + 1;
//   }
//   return currentCount;
// };

// let isFirstLoad = true;

// onAuthStateChanged(auth, async (user: User | null) => {
//   if (user && isFirstLoad) {
//     await incrementUserCount();
//     isFirstLoad = false;
//   }
// });
