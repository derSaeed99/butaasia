import { defineSecret, defineString } from "firebase-functions/params";
import fetch from "node-fetch";

// About Paypal integration read here: https://developer.paypal.com/docs/checkout/standard/integrate
const PAYPAL_CLIENT_ID = defineString(
  process.env.REACT_APP_PAYPAL_CLIENT_ID || ""
);
export const PAYPAL_CLIENT_SECRET = defineSecret(
  process.env.REACT_APP_PAYPAL_CLIENT_SECRET || ""
);
const BASE_URL = defineString("https://api.sandbox.paypal.com");

// use the orders api to create an order
/**
 * @param {number} money
 * @return {Promise<PaymentResponse>} order data
 */
export async function createOrder(money: number): Promise<PaymentResponse> {
  const accessToken = await generateAccessToken();
  const url = `${BASE_URL.value()}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: "Pages Checks",
          amount: {
            currency_code: "EUR",
            value: `${(Math.ceil(money * 100) / 100).toFixed(2)}`,
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    }),
  });
  const responseData = await response.json();
  return responseData as PaymentResponse;
}

interface PaymentResponse {
  id: string;
}

//
/**
 * use the orders api to capture payment for an order
 * @param {string} orderId
 * @return {Promise<PaymentResponse>} order data
 */
export async function capturePayment(
  orderId: string
): Promise<PaymentResponse> {
  const accessToken = await generateAccessToken();
  const url = `${BASE_URL.value()}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const responseData = await response.json();
  return responseData as PaymentResponse;
}

interface AccessTokenResponse {
  access_token: string;
}

/**
 * generate an access token using client id and app secret
 * @return {string} access token
 */
async function generateAccessToken(): Promise<string> {
  const auth = Buffer.from(
    PAYPAL_CLIENT_ID.value() + ":" + PAYPAL_CLIENT_SECRET.value()
  ).toString("base64");
  const response = await fetch(`${BASE_URL.value()}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = (await response.json()) as AccessTokenResponse;
  return data.access_token;
}
