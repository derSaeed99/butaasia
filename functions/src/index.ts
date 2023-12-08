import { region, https } from "firebase-functions";
import { createOrder, capturePayment, PAYPAL_CLIENT_SECRET } from "./paypal";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
const functions = region("europe-west1");

interface OrderInformation {
  pages: number;
  money: number;
}

interface CreatePaypalOrderData {
  pages: number;
}
const db = getFirestore();
export const createPaypalOrder = functions
  .runWith({ secrets: [PAYPAL_CLIENT_SECRET], enforceAppCheck: true })
  .https.onCall(async ({ pages }: CreatePaypalOrderData, ctx) => {
    if (ctx.app == undefined) {
      throw new https.HttpsError(
        "failed-precondition",
        "The function must be called from an App Check verified app."
      );
    }
    if (!ctx.auth) {
      throw new https.HttpsError(
        "failed-precondition",
        "The function must be called from an authenticated user."
      );
    }
    const money = pages * 0.1;
    const order = await createOrder(money);
    await db
      .doc(`administration/${ctx.auth.uid}/orders/${order.id}`)
      .create({ pages, money } as OrderInformation);
    return order;
  });

interface CapturePaypalPaymentData {
  orderID: string;
}

export const capturePaypalPayment = functions
  .runWith({ secrets: [PAYPAL_CLIENT_SECRET], enforceAppCheck: true })
  .https.onCall(async ({ orderID }: CapturePaypalPaymentData, ctx) => {
    if (ctx.app == undefined) {
      throw new https.HttpsError(
        "failed-precondition",
        "The function must be called from an App Check verified app."
      );
    }
    if (!ctx.auth) {
      throw new https.HttpsError(
        "failed-precondition",
        "The function must be called from an authenticated user."
      );
    }

    const captureData = await capturePayment(orderID);
    const doc = await db
      .doc(`administration/${ctx.auth.uid}/orders/${orderID}`)
      .get();
    if (!doc.exists) {
      throw new https.HttpsError(
        "failed-precondition",
        "The order does not exist."
      );
    }
    const orderData = doc.data() as OrderInformation;

    await Promise.all([
      db.doc(`administration/${ctx.auth.uid}`).update({
        pages: FieldValue.increment(orderData.pages),
      }),
      db.doc(`administration/${ctx.auth.uid}/completed/${orderID}`).create({
        ...orderData,
        date: FieldValue.serverTimestamp(),
      }),
      db.doc(`administration/${ctx.auth.uid}/orders/${orderID}`).delete(),
    ]);

    return captureData;
  });
