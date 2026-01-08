import axios from "axios";

const API_URL = "http://localhost:5000/api/user";

const token = localStorage.getItem("token");

export const getAddresses = async () => {
  return await axios.get(`${API_URL}/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addAddress = async (data) => {
  return await axios.post(`${API_URL}/addresses`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateAddress = async (id, data) => {
  return await axios.put(`${API_URL}/addresses/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const setDefaultAddress = async (id, type) => {
  return await axios.patch(`${API_URL}/addresses/${id}/default`, { type }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
