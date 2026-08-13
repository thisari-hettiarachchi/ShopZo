import api from "./api";

/** Used by Flash Sale to toggle product flashSale flags. */
export const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/api/admin/products/${id}`, payload);
  return data;
};
