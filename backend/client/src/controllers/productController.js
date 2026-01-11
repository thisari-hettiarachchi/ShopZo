import Product from "../models/Product.js";

// GET all products
export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// GET single product
export const getProductById = async (req, res) => {
  const products = await Product.findById(req.params.id);

  if (!products) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(products);
};

export const getFlashSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({
      discount: { $gt: 0 }
    }).limit(10);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch flash sale products" });
  }
};
