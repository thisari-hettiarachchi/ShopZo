import axios from "axios";
import { API_BASE_URL, authHeaders } from "./base";

const USER_URL = `${API_BASE_URL}/user`;

export const fetchOrders = async () => {
  return axios.get(`${USER_URL}/orders`, {
    headers: authHeaders(),
  });
};

export const fetchReturns = async () => {
  return axios.get(`${USER_URL}/returns`, {
    headers: authHeaders(),
  });
};

export const fetchCancellations = async () => {
  return axios.get(`${USER_URL}/cancellations`, {
    headers: authHeaders(),
  });
};

export const createOrder = async (orderData, token) => {
  const res = await axios.post(`${USER_URL}/orders`, orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const requestReturn = async (orderId, payload) => {
  return axios.post(`${USER_URL}/orders/${orderId}/returns`, payload, {
    headers: authHeaders(),
  });
};

export const cancelOrder = async (orderId) => {
  return axios.post(`${USER_URL}/orders/${orderId}/cancel`, {}, {
    headers: authHeaders(),
  });
};