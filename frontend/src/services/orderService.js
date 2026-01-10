// src/services/orderService.js
import axios from "axios";

// Place a new order
export const createOrder = async (orderData, token) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/user/orders", // backend endpoint
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
    const response = await axios.get("http://localhost:5000/api/user/orders", {
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
    const response = await axios.get("http://localhost:5000/api/user/returns", {
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
    const response = await axios.get("http://localhost:5000/api/user/cancellations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cancellations:", error.response?.data || error.message);
    throw error;
  }
};
