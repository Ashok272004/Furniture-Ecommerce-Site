import { API_BASE_URL } from "./http.js";

const API_ORIGIN = new URL(API_BASE_URL).origin;

export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${API_ORIGIN}${path}`;
}