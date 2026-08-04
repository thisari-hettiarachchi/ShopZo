import axios from "axios";
import {
  ADMIN_API_BASE_URL,
  CLIENT_API_BASE_URL,
  VENDOR_API_BASE_URL,
} from "./base";

const normalizeCategories = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const fetchFrom = async (url) => {
  const res = await axios.get(url);
  return normalizeCategories(res.data);
};

/**
 * Load admin-managed categories.
 * Tries vendor API, then client API, then admin API (source of truth).
 */
export const getCategories = async () => {
  const endpoints = [
    `${VENDOR_API_BASE_URL}/vendor/categories`,
    `${CLIENT_API_BASE_URL}/categories`,
    `${ADMIN_API_BASE_URL}/admin/categories/public`,
    `${ADMIN_API_BASE_URL}/admin/categories`,
  ];

  let lastError = null;

  for (const url of endpoints) {
    try {
      const list = await fetchFrom(url);
      if (list.length > 0) {
        return { data: list };
      }
      // Keep going if this source is empty — another DB may have categories.
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return { data: [] };
};
