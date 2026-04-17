import axios from "axios";
import { getVendorToken } from "../utils/authStorage";
import { VENDOR_API_BASE_URL } from "./base";

const API = axios.create({
  baseURL: `${VENDOR_API_BASE_URL}/vendor/products`,
});

const authHeaders = () => {
  const token = getVendorToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProducts = () =>
  API.get("/", { headers: authHeaders() });

export const addProduct = (data) =>
  API.post("/", data, { headers: authHeaders() });

export const updateProduct = (id, data) =>
  API.put(`/${id}`, data, { headers: authHeaders() });


export const deleteProduct = (id) =>
  API.delete(`/${id}`, { headers: authHeaders() });

export const getProductById = (id) =>
  API.get(`/${id}`, { headers: authHeaders() });
