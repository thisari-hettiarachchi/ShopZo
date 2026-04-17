import { API_BASE_URL } from "./base";

const BASE_URL = `${API_BASE_URL}/categories`;

export const fetchCategories = async () => {
  const res = await fetch(BASE_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
};