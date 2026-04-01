import axios from "axios";

const API_URL = "http://localhost:5000/api/user";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAddresses = async () => {
  return await axios.get(`${API_URL}/addresses`, {
    headers: authHeaders(),
  });
};

export const addAddress = async (data) => {
  return await axios.post(`${API_URL}/addresses`, data, {
    headers: authHeaders(),
  });
};

export const updateAddress = async (id, data) => {
  return await axios.put(`${API_URL}/addresses/${id}`, data, {
    headers: authHeaders(),
  });
};

export const setDefaultAddress = async (id, type) => {
  return await axios.patch(`${API_URL}/addresses/${id}/default`, { type }, {
    headers: authHeaders(),
  });
};
