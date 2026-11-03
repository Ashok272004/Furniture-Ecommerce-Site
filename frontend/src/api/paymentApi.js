import { apiRequest } from "./http.js";

export function createRazorpayOrder(order) {
  return apiRequest("/payments/razorpay/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export function verifyRazorpayPayment(paymentDetails) {
  return apiRequest("/payments/razorpay/verify", {
    method: "POST",
    body: JSON.stringify(paymentDetails),
  });
}