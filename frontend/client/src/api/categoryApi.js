const BASE_URL = "http://localhost:5000/api/categories";

export const fetchCategories = async () => {
  const res = await fetch(BASE_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
};