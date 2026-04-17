import axios from "axios";
import { VENDOR_API_BASE_URL } from "./base";

const API = axios.create({
  baseURL: `${VENDOR_API_BASE_URL}/auth`,
  withCredentials: true,
});

// Keeping these names to match existing imports in `pages/Auth.jsx`
export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
