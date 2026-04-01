import axios from "axios";

const API_URL = "http://localhost:5000/api/user/cards"; 

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCards = async () => {
  return await axios.get(API_URL, { headers: authHeaders() });
};

export const addCard = async (data) => {
  return await axios.post(API_URL, data, { headers: authHeaders() });
};

export const setDefaultCardApi = async (id) => {
  return await axios.patch(`${API_URL}/${id}/default`, {}, { headers: authHeaders() });
};

export const updateCardApi = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data, {
    headers: authHeaders(),
  });
};
