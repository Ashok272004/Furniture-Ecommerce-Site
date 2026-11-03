import { apiRequest } from "./http.js";

export function getProducts() {
  return apiRequest("/products");
}

export function getProductById(id) {
  return apiRequest(`/products/${id}`);
}

export function createProduct(product) {
  return apiRequest("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateProduct(id, product) {
  return apiRequest(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export function deleteProduct(id) {
  return apiRequest(`/products/${id}`, {
    method: "DELETE",
  });
}

export function uploadProductImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/admin/uploads", {
    method: "POST",
    body: formData,
  });
}