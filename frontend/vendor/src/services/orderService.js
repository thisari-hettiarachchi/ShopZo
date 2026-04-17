import axios from "axios";
import { getVendorToken } from "../utils/authStorage";
import { VENDOR_API_BASE_URL } from "./base";

const API = axios.create({
  baseURL: `${VENDOR_API_BASE_URL}/vendor/orders`,
});

const authHeaders = () => {
  const token = getVendorToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getOrders = () =>
  API.get("/", { headers: authHeaders() });

export const updateOrderStatus = (id, status) =>
  API.put(`/${id}/status`, { status }, { headers: authHeaders() });
