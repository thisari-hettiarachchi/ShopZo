import axios from "axios";
import { API_BASE_URL } from "./base";

const API_URL = `${API_BASE_URL}/wishlist`;

export const fetchWishlistApi = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addToWishlistApi = async (productId, token) => {
  const res = await axios.post(
    `${API_URL}/add`,
    { productId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const removeFromWishlistApi = async (productId, token) => {
  const res = await axios.delete(`${API_URL}/remove/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
