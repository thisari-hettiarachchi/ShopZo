import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/vendor/products",
});

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProducts = () =>
  API.get("/", { headers: authHeaders() });

export const addProduct = (data) =>
  API.post("/", data, { headers: authHeaders() });

export const updateProduct = (id, data) =>
  API.put(`/${id}`, data, { headers: authHeaders() });


export const deleteProduct = (id) =>
  API.delete(`/${id}`, { headers: authHeaders() });

export const getProductById = (id) =>
  API.get(`/${id}`, { headers: authHeaders() });
