import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onDocumentWritten } from "firebase-functions/v2/firestore";

initializeApp();
const firestore = getFirestore();

export const incrementUserCounter = onDocumentWritten(
  "users/{userId}",
  async (event) => {
    // Only run if the document is newly created
    if (!event.data.before.exists && event.data.after.exists) {
      const countersRef = firestore.collection("counters").doc("userCounter");
      const userDocRef = event.data.before.ref;
      const userDoc = await userDocRef.get();
      const userId = userDocRef.id;

      if (!userDoc) {
        console.error("User document does not exist");
        return;
      }

      try {
        await firestore.runTransaction(async (transaction) => {
          const counterDoc = await transaction.get(countersRef);

          // Increase counter
          let newCount = 1;
          if (counterDoc.exists) {
            newCount = counterDoc.data().count + 1;
          }

          // Update counter
          transaction.set(countersRef, { count: newCount });

          // Set counter value on user document
          const userRef = firestore.collection("users").doc(userId);
          transaction.update(userRef, { userNumber: newCount });
        });
      } catch (error) {
        console.error("Error updating user count:", error);
      }
    }
  }
);
