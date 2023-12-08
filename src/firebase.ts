import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  FirestoreError,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage } from "firebase/storage";
import {
  CaContactFormValues,
  CaProduct,
  CaValuationFormValues,
} from "Types/interfaces";
import { Valuations } from "Types/Types";

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
export const functions = getFunctions(app);
// export const createUserProfile = async (userId: string, user: CaUser) => {
//   try {
//     const userProfileDocRef = doc(collection(db, "users"), userId);
//     const addData = {
//       ...user,
//       created: new Date(),
//       lastUpdate: new Date(),
//     };
//     await setDoc(userProfileDocRef, addData, { merge: true });
//   } catch (error) {
//     console.error("Error adding UserProfile: ", error);
//   }
// };

// export const updateUserProfile = async (
//   userId: string,
//   updates: UserProfileFormValues
// ) => {
//   try {
//     const userProfileDocRef = doc(db, "users", userId);
//     const updateData = {
//       ...updates,
//       lastUpdate: new Date(),
//     };
//     await updateDoc(userProfileDocRef, updateData);
//   } catch (error) {
//     console.error("Error adding UserProfile: ", error);
//   }
// };

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

// cart, payment, shop functions

export const createPaypalOrderCallable = httpsCallable(
  functions,
  "createPaypalOrder"
);
export const capturePaypalPaymentCallable = httpsCallable(
  functions,
  "capturePaypalPayment"
);
interface CreatePaypalOrderRequest {
  pages: number;
}

interface CreatePaypalOrderResponse {
  id: string;
}

export const createPaypalOrder = async (
  pages: number
): Promise<CreatePaypalOrderResponse> => {
  const request: CreatePaypalOrderRequest = { pages };
  const res = await createPaypalOrderCallable(request);
  return res.data as CreatePaypalOrderResponse;
};

export const capturePaypalPayment = async (
  orderID: string
): Promise<unknown> => {
  const res = await capturePaypalPaymentCallable({ orderID });
  return res.data;
};

export const firebaseGetProductsValuations = async () => {
  const productsValuations = collection(db, "productsValuations");
  const productsValuationsSnapshot = await getDocs(productsValuations);
  const productsValuationsList = productsValuationsSnapshot.docs.map((doc) =>
    doc.data()
  );
  return productsValuationsList;
};

export const firebaseAddProductsValuations = async (
  productsValuations?: CaValuationFormValues
) => {
  await addDoc(collection(db, "productsValuations"), productsValuations);
  return;
};

export const firebaseGetContactMessages = async () => {
  const contactMessages = collection(db, "contactMessages");
  const contactMessagesSnapshot = await getDocs(contactMessages);
  const contactMessagesList = contactMessagesSnapshot.docs.map((doc) =>
    doc.data()
  );
  return contactMessagesList;
};

export const firebaseAddContactMessages = async (
  contactMessages: CaContactFormValues
) => {
  await addDoc(collection(db, "contactMessages"), contactMessages);
  return;
};

export const firebaseAddItemToCart = async (product: CaProduct) => {
  const cartRef = doc(db, "carts", product.productId);
  const cartDoc = await getDoc(cartRef);
  if (cartDoc.exists()) {
    // If the cart document already exists, update it with the new item
    await updateDoc(cartRef, {
      items: [...cartDoc.data().items, product],
    });
  } else {
    // If the cart document doesn't exist, create a new one with the new item
    await setDoc(cartRef, {
      items: [product],
    });
  }
};

export const subscribeToRating = ({
  valuationId,
  observer,
  onError,
}: {
  valuationId: string;
  observer: (valuation: Valuations | null) => void;
  onError?: (error: FirestoreError) => void;
}) => {
  return onSnapshot(
    doc(db, "users", valuationId),
    (snapshot) => {
      if (snapshot.exists()) {
        const valuation = {
          ...snapshot.data(),
          valuationId: snapshot.id,
        } as Valuations;
        observer?.(valuation);
      } else {
        observer?.(null);
        console.warn("valuation does not exist");
      }
    },
    onError
  );
};
