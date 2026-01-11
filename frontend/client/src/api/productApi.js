const BASE_URL = "http://localhost:5000/api/products";

export const fetchProducts = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
};
