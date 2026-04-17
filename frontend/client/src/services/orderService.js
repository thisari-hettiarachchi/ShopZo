// src/services/orderService.js
import axios from "axios";
import { API_BASE_URL } from "../api/base";

const USER_ORDERS_URL = `${API_BASE_URL}/user/orders`;
const USER_RETURNS_URL = `${API_BASE_URL}/user/returns`;
const USER_CANCELLATIONS_URL = `${API_BASE_URL}/user/cancellations`;

// Place a new order
export const createOrder = async (orderData, token) => {
  try {
    const response = await axios.post(
      USER_ORDERS_URL,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create order:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch orders for logged-in user
export const fetchOrders = async (token) => {
  try {
    const response = await axios.get(USER_ORDERS_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch returned orders
export const fetchReturns = async (token) => {
  try {
    const response = await axios.get(USER_RETURNS_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch returns:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch cancelled orders
export const fetchCancellations = async (token) => {
  try {
    const response = await axios.get(USER_CANCELLATIONS_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cancellations:", error.response?.data || error.message);
    throw error;
  }
};
