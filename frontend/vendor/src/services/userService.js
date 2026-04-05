import axios from "axios";
import { getVendorToken } from "../utils/authStorage";

const API = axios.create({
  baseURL: "http://localhost:5001/api/vendor/users",
});

const authHeaders = () => {
  const token = getVendorToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllUsers = () =>
  API.get("/", { headers: authHeaders() });
