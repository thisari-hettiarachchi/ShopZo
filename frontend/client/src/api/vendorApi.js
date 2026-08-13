import { API_BASE_URL, authHeaders } from "./base";

const BASE = `${API_BASE_URL}/vendors`;

export const fetchVendorById = async (id) => {
  const res = await fetch(`${BASE}/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load vendor");
  return data;
};

export const fetchVendorProducts = async (id, params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.append(key, value);
  });
  const url = query.toString() ? `${BASE}/${id}/products?${query}` : `${BASE}/${id}/products`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load vendor products");
  return data;
};

export const fetchVendorFollowStatus = async (id) => {
  const res = await fetch(`${BASE}/${id}/follow-status`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load follow status");
  return data;
};

export const followVendorApi = async (id) => {
  const res = await fetch(`${BASE}/${id}/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to follow vendor");
  return data;
};

export const unfollowVendorApi = async (id) => {
  const res = await fetch(`${BASE}/${id}/follow`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to unfollow vendor");
  return data;
};

export const fetchVendorReviews = async (id) => {
  const res = await fetch(`${BASE}/${id}/reviews`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load vendor reviews");
  return data;
};

export const fetchVendorReviewEligibility = async (id) => {
  const res = await fetch(`${BASE}/${id}/review-eligibility`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to check eligibility");
  return data;
};

export const postVendorReview = async (id, payload) => {
  const res = await fetch(`${BASE}/${id}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to submit rating");
  return data;
};
