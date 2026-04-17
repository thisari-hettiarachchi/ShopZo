import axios from "axios";
import { getVendorToken } from "../utils/authStorage";
import { VENDOR_API_BASE_URL } from "./base";

const API = axios.create({
  baseURL: `${VENDOR_API_BASE_URL}/vendor`,
});

const authHeaders = () => {
  const token = getVendorToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getVendorProfile = () =>
  API.get("/profile", {
    headers: authHeaders(),
  });

export const updateVendorProfile = (data) =>
  API.put("/profile", data, {
    headers: authHeaders(),
  });

export const getVendors = () => API.get("/");
