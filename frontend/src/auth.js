
import { apiRequest } from "./api";

export async function registerUser(email, password) {
  return apiRequest("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

export async function loginUser(email, password) {
  // FastAPI's OAuth2PasswordRequestForm expects form data.
  const form = new URLSearchParams();
  form.set("username", email.trim().toLowerCase());
  form.set("password", password);

  const data = await apiRequest("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  localStorage.setItem("access_token", data.access_token);
  return data;
}

export async function getCurrentUser() {
  return apiRequest("/users/me");
}

export function logoutUser() {
  localStorage.removeItem("access_token");
}
