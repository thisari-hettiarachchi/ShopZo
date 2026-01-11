import axios from "axios";

const token = localStorage.getItem("token"); 

export const fetchOrders = async () => {
  return axios.get("http://localhost:5000/api/user/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchReturns = async () => {
  return axios.get("http://localhost:5000/api/user/returns", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchCancellations = async () => {
  return axios.get("http://localhost:5000/api/user/cancellations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createOrder = async (orderData, token) => {
  const res = await axios.post(
    "http://localhost:5000/api/user/orders",
    orderData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};