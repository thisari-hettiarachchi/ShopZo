import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/vendor/orders",
});

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getOrders = () =>
  API.get("/", { headers: authHeaders() });

export const updateOrderStatus = (id, status) =>
  API.put(`/${id}/status`, { status }, { headers: authHeaders() });
