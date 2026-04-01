import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/vendor",
});

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getDashboardAnalytics = () =>
  API.get("/dashboard", { headers: authHeaders() });
