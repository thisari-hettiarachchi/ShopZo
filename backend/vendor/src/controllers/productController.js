import Product from "../models/Product.js";

// Get all products for the logged-in vendor
export const getVendorProducts = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const products = await Product.find({ vendor: vendorId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Add a new product
export const addVendorProduct = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const { name, price, description, stock, category, images, sizes, rating, oldPrice, discount } = req.body;

    const newProduct = new Product({
      name,
      price,
      description,
      stock,
      category: category || "General",
      images: images && images.length > 0 ? images : ["https://via.placeholder.com/150"],
      sizes: sizes && sizes.length > 0 ? sizes : ["S", "M", "L"],
      rating: rating || 0,
      oldPrice: oldPrice || null,
      discount: discount || 0,
      vendor: vendorId,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
};

// Update an existing product
export const updateVendorProduct = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    const { id } = req.params;

    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const product = await Product.findOne({ _id: id, vendor: vendorId });
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    const { name, price, description, stock, category, images, sizes, rating, oldPrice, discount } = req.body;

    // Validate required fields
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "Images are required and must be a non-empty array." });
    }
    if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
      return res.status(400).json({ message: "Sizes are required and must be a non-empty array." });
    }
    if (rating === undefined || rating === null) {
      return res.status(400).json({ message: "Rating is required." });
    }
    if (!category || typeof category !== "string" || category.trim() === "") {
      return res.status(400).json({ message: "Category is required." });
    }

    product.name = name !== undefined ? name : product.name;
    product.price = price !== undefined ? price : product.price;
    product.description = description !== undefined ? description : product.description;
    product.stock = stock !== undefined ? stock : product.stock;
    product.category = category !== undefined ? category : product.category;
    product.images = images !== undefined ? images : product.images;
    product.sizes = sizes !== undefined ? sizes : product.sizes;
    product.rating = rating !== undefined ? rating : product.rating;
    product.oldPrice = oldPrice !== undefined ? oldPrice : product.oldPrice;
    product.discount = discount !== undefined ? discount : product.discount;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// Delete a product
export const deleteVendorProduct = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    const { id } = req.params;

    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const product = await Product.findOneAndDelete({ _id: id, vendor: vendorId });
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
