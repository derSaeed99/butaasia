import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import {onCall} from "firebase-functions/v2/https";
//  import {onDocumentWritten} from "firebase-functions/v2/firestore";

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// })

admin.initializeApp();

const firestore = admin.firestore();

export const incrementUserCount = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap) => {
    const countersRef = firestore.collection("counters").doc("userCount");
    const userDocRef = snap.ref;
    const userDoc = snap.data();
    const userCount = userDoc?.userNumber || 0;
    await firestore.runTransaction(async (transaction) => {
      const doc = await transaction.get(countersRef);
      const count = doc.exists ? doc.data()?.userNumber : 0;
      transaction.set(countersRef, {count: count + userCount});
      transaction.update(userDocRef, {userNumber: userCount + count});
    });
  });
