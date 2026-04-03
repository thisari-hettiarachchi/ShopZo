import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/auth",
  withCredentials: true,
});

// Keeping these names to match existing imports in `pages/Auth.jsx`
export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
