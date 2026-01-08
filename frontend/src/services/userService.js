import axios from "axios";

const API_URL = "http://localhost:5000/api/user";

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
