import axios from "axios";
import { getVendorToken } from "../utils/authStorage";
import { VENDOR_API_BASE_URL } from "./base";

const API = axios.create({
  baseURL: `${VENDOR_API_BASE_URL}/vendor/banners`,
});

const authHeaders = () => {
  const token = getVendorToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getBanners = () => API.get("/", { headers: authHeaders() });

export const createBanner = (data) => API.post("/", data, { headers: authHeaders() });

export const updateBanner = (id, data) => API.put(`/${id}`, data, { headers: authHeaders() });

export const deleteBanner = (id) => API.delete(`/${id}`, { headers: authHeaders() });

export const requestBannerApproval = (id) =>
  API.patch(`/${id}/request-approval`, {}, { headers: authHeaders() });
