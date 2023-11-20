import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
// import {onCall} from "firebase-functions/v2/https";
// import {onDocumentWritten} from "firebase-functions/v2/firestore";

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// })
initializeApp();
const firestore = getFirestore();

export const incrementUserCount = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap) => {
    const countersRef = firestore.collection("counters").doc("userCount");
    const userDocRef = snap.ref;
    const userDoc = snap.data();
    const userCount = userDoc?.userNumber || 0;

    try {
      await firestore.runTransaction(async (transaction) => {
        const doc = await transaction.get(countersRef);
        const count = doc.exists ? doc.data()?.count || 0 : 0;
        const newCount = count + userCount;
        console.log("newCount", newCount, count);
        transaction.set(countersRef, { count: newCount });
        transaction.update(userDocRef, { userNumber: newCount });
      });
    } catch (error) {
      console.error("Error updating user count:", error);
    }
  });
