import { apiRequest } from "./http.js";

export function registerUser(userDetails) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userDetails),
  });
}

export function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function logoutUser() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

export function getCurrentUser() {
  return apiRequest("/auth/me");
}