import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/auth",
  withCredentials: true,
});

// Keeping these names to match existing imports in `pages/Auth.jsx`
export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
