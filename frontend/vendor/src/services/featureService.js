import axios from "axios";
import { getVendorToken } from "../utils/authStorage";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api/vendor";

const API = axios.create({
  baseURL: API_BASE,
});

const authHeaders = () => {
  const token = getVendorToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCoupons = () => API.get("/coupons", { headers: authHeaders() });
export const createCoupon = (payload) => API.post("/coupons", payload, { headers: authHeaders() });
export const updateCoupon = (id, payload) => API.put(`/coupons/${id}`, payload, { headers: authHeaders() });
export const deleteCoupon = (id) => API.delete(`/coupons/${id}`, { headers: authHeaders() });

export const getLowStockAlerts = (threshold = 10) =>
  API.get(`/products/alerts/low-stock?threshold=${threshold}`, { headers: authHeaders() });

export const getChatThreads = () => API.get("/chat/threads", { headers: authHeaders() });
export const getChatMessages = (userId) => API.get(`/chat/messages/${userId}`, { headers: authHeaders() });
export const sendChatMessage = (userId, payload) =>
  API.post(`/chat/messages/${userId}`, payload, { headers: authHeaders() });

export const getVendorReviews = () => API.get("/reviews", { headers: authHeaders() });
export const getVendorReviewInsights = () => API.get("/reviews/insights", { headers: authHeaders() });
