import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { CaPost, CaUser } from "./model";

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

export const createUserProfile = async (userId: string, user: CaUser) => {
  try {
    const userProfileDocRef = doc(collection(db, "users"), userId);
    await setDoc(userProfileDocRef, user, { merge: true });
  } catch (error) {
    console.error("Error adding UserProfile: ", error);
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
      reject
    );
  });
};

export const subscribeToUser = (
  userId: string,
  callback: (user: CaUser | null) => void
) => {
  const userDocRef = doc(db, "users", userId);
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
    const usersCollectionRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollectionRef);
    const users = usersSnapshot.docs.map((doc) => doc.data());
    return users;
  } catch (error) {
    console.error("Error getting all users: ", error);
    throw error;
  }
};

export const uploadImageAndSaveUrl = async (
  userId: string,
  imageFile: File
): Promise<string> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const storageRef = ref(storage, `images/${userId}/photoUrl.jpg`);
    await uploadBytes(storageRef, imageFile);
    const downloadUrl = await getDownloadURL(storageRef);
    await setDoc(userDocRef, { photoUrl: downloadUrl });
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading image and saving URL: ", error);
    throw error;
  }
};

export const uploadMemeAndSaveUrl = async (
  imageFile: File,
  post: CaPost
): Promise<string> => {
  try {
    const newRef = ref(storage);
    const imageId = doc(collection(db, "memes")).id;
    const storageRef = ref(storage, `memes/${imageId}/${post.caption}.jpg`);
    if (post.mediaUrl) {
      await uploadBytes(storageRef, imageFile);
    }
    const downloadUrl = await getDownloadURL(storageRef);
    await setDoc(
      doc(db, "posts", `${imageId}`),
      { ...post, mediaUrl: downloadUrl, postId: imageId },
      { merge: true }
    );
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading image and saving URL: ", error);
    throw error;
  }
};

export const checkUserProfile = async (): Promise<boolean> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return false;
  }
  const profileDocRef = doc(db, "users", currentUser.uid);
  const profileDoc = await getDoc(profileDocRef);
  return profileDoc.exists();
};

export const subscribeToMemes = (callback: (posts: CaPost[]) => void) => {
  const memesCollectionRef = collection(db, "posts");
  const memesQuery = query(memesCollectionRef, orderBy("created"), limit(20));
  return onSnapshot(memesQuery, (snapshot) => {
    const memes = snapshot.docs.map((doc) => ({
      postId: doc.id,
      ...(doc.data() as CaPost),
    }));
    callback(memes);
    console.log(memes);
  });
};
