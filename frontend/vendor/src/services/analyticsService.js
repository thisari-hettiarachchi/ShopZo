import axios from "axios";
import { getVendorToken } from "../utils/authStorage";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api/vendor",
});

const authHeaders = () => {
  const token = getVendorToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getDashboardAnalytics = () =>
  API.get("/dashboard", { headers: authHeaders() });
