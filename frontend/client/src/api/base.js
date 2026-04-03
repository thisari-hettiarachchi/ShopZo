export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
