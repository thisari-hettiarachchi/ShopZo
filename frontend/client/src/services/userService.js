import axios from "axios";
import { API_BASE_URL } from "../api/base";

const API_URL = `${API_BASE_URL}/user`;

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  return await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateUserProfile = async (data) => {
  const token = localStorage.getItem("token");
  return await axios.put(`${API_URL}/profile`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
