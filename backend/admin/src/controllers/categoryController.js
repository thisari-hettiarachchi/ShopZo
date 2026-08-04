import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const getCategories = async (_req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const exists = await Category.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });
    if (exists) {
      return res.status(409).json({ message: "A category with this name already exists" });
    }

    const category = await Category.create({
      name: name.trim(),
      image: image || "",
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: "Category name is required" });
      }
      const exists = await Category.findOne({
        _id: { $ne: req.params.id },
        name: { $regex: `^${name.trim()}$`, $options: "i" },
      });
      if (exists) {
        return res.status(409).json({ message: "A category with this name already exists" });
      }
    }

    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (image !== undefined) update.image = image;

    const previous = await Category.findById(req.params.id);
    if (!previous) {
      return res.status(404).json({ message: "Category not found" });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    // Keep existing products in sync if the category was renamed
    if (name !== undefined && name.trim() !== previous.name) {
      await Product.updateMany(
        { category: previous.name },
        { $set: { category: name.trim() } }
      );
    }

    res.json(category);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const productCount = await Product.countDocuments({ category: category.name });
    if (productCount > 0) {
      return res.status(409).json({
        message: `Cannot delete "${category.name}" — ${productCount} product(s) still use this category.`,
      });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    res.status(500).json({ message: error.message });
  }
};
