import Product from "../models/Product.js";
import "../models/Vendor.js";

const populateVendor = (query) => query.populate("vendor", "storeName");

export const getProducts = async (_req, res) => {
  try {
    const products = await populateVendor(Product.find({}).sort({ createdAt: -1 }).limit(500));
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await populateVendor(Product.findById(req.params.id));

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await populateVendor(
      Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: false,
      })
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    res.status(500).json({ message: error.message });
  }
};
