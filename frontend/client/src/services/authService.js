import axios from "axios";
import { API_BASE_URL } from "../api/base";

const API = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true
});

export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
