import { apiRequest } from "./http.js";

export function createOrder(order) {
  return apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export function getOrders() {
  return apiRequest("/orders");
}

export function updateOrderStatus(orderId, status) {
  return apiRequest(`/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export function getOrderItems(orderId) {
  return apiRequest(`/orders/${orderId}/items`);
}

export function getMyOrders() {
  return apiRequest("/orders/my");
}

export function getMyOrderItems(orderId) {
  return apiRequest(`/orders/my/${orderId}/items`);
}

export function cancelMyOrder(orderId) {
  return apiRequest(`/orders/my/${orderId}/cancel`, {
    method: "POST",
  });
}