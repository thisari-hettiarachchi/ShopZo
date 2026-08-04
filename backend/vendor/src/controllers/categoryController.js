import Category from "../models/Category.js";

export const getCategories = async (_req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(Array.isArray(categories) ? categories : []);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
