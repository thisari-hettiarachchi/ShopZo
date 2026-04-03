import api from "./api";

export const getProducts = async () => {
  const { data } = await api.get("/api/admin/products");
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/api/admin/products/${id}`);
  return data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/api/admin/products/${id}`, payload);
  return data;
};
