import axios from "axios";
import { getVendorToken } from "../utils/authStorage";

const API = axios.create({
  baseURL: "http://localhost:5001/api/vendor/orders",
});

const authHeaders = () => {
  const token = getVendorToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getOrders = () =>
  API.get("/", { headers: authHeaders() });

export const updateOrderStatus = (id, status) =>
  API.put(`/${id}/status`, { status }, { headers: authHeaders() });
