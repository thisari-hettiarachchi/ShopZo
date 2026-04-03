import { API_BASE_URL, authHeaders } from "./base";

const BASE_URL = `${API_BASE_URL}/products`;

export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.append(key, value);
  });

  const res = await fetch(query.toString() ? `${BASE_URL}?${query}` : BASE_URL);
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
};

export const fetchProductSuggestions = async (q) => {
  if (!q?.trim()) return [];
  const res = await fetch(`${BASE_URL}/search/suggestions?q=${encodeURIComponent(q.trim())}`);
  return res.json();
};

export const fetchProductReviews = async (productId) => {
  const res = await fetch(`${BASE_URL}/${productId}/reviews`);
  return res.json();
};

export const postProductReview = async (productId, payload) => {
  const res = await fetch(`${BASE_URL}/${productId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return res.json();
};
