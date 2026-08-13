import axios from "axios";
import { API_BASE_URL, authHeaders } from "../api/base";

const CHECKOUT_URL = `${API_BASE_URL}/checkout`;

export const createCheckoutSession = async ({ items, shippingAddress, couponCode, deliveryFee }) => {
  const res = await axios.post(
    `${CHECKOUT_URL}/create-session`,
    { items, shippingAddress, couponCode, deliveryFee },
    { headers: authHeaders() }
  );
  return res.data;
};

export const confirmCheckoutSession = async (sessionId) => {
  const res = await axios.get(`${CHECKOUT_URL}/session/${sessionId}/confirm`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const validateCoupon = async (code, subtotal) => {
  const res = await axios.post(
    `${CHECKOUT_URL}/validate-coupon`,
    { code, subtotal },
    { headers: authHeaders() }
  );
  return res.data;
};
