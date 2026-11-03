export const API_BASE_URL = "http://localhost:8080/api";
export async function apiRequest(path, options = {}) {
  const { headers: customHeaders = {}, ...requestOptions } = options;
  const headers = new Headers(customHeaders);
  const isFormData = requestOptions.body instanceof FormData;

  if (isFormData) {
    headers.delete("Content-Type");
  } else if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const responseText = await response.text();
    let message = `Request failed: ${response.status}`;

    if (responseText) {
      try {
        const errorData = JSON.parse(responseText);
        message =
          errorData.detail ||
          errorData.message ||
          errorData.title ||
          message;
      } catch {
        message = responseText;
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}