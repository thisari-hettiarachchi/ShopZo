import axios from "axios";
import { getVendorToken } from "../utils/authStorage";

const API = axios.create({
  baseURL: "http://localhost:5001/api/vendor",
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
