import axios from "axios";
import { API_BASE_URL } from "../api/base";

const API_URL = `${API_BASE_URL}/user`;

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

export const deleteAddress = async (id) => {
  return await axios.delete(`${API_URL}/addresses/${id}`, {
    headers: authHeaders(),
  });
};

export const setDefaultAddress = async (id, type) => {
  return await axios.patch(`${API_URL}/addresses/${id}/default`, { type }, {
    headers: authHeaders(),
  });
};
