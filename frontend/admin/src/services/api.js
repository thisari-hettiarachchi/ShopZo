import axios from "axios";

const configuredApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  import.meta.env.VITE_API_URL?.trim();

const fallbackApiBaseUrl = (() => {
  if (typeof window === "undefined") return "https://shop-zo-admin-backend.vercel.app";

  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  return isLocalhost ? "http://localhost:5002" : "https://shop-zo-admin-backend.vercel.app";
})();

export const API_BASE_URL = (configuredApiBaseUrl || fallbackApiBaseUrl).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
