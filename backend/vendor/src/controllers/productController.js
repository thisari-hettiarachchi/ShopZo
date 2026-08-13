import Product from "../models/Product.js";
import Settings from "../models/Settings.js";
import { queueProductNewsletterAlerts } from "../services/newsletterAlertService.js";

// Get a single product for the logged-in vendor
export const getVendorProductById = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    const { id } = req.params;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const product = await Product.findOne({ _id: id, vendor: vendorId });
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    res.json(product);
  } catch (error) {
    console.error("Error fetching product by id:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

const requireApprovedVendor = (req, res) => {
  const accountStatus = req.user?.accountStatus || "pending";
  if (accountStatus !== "approved") {
    res.status(403).json({ message: "Your vendor account must be approved before you can add or manage products." });
    return false;
  }

  return true;
};

const resolveFlashSaleFlag = async (requestedFlag) => {
  if (!requestedFlag) return false;
  const settings = await Settings.findOne({ key: "global" });
  return Boolean(settings?.flashSaleEnabled);
};

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

export const getLowStockProducts = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    const threshold = Number(req.query.threshold || 10);
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const products = await Product.find({
      vendor: vendorId,
      stock: { $lte: threshold },
    })
      .sort({ stock: 1, updatedAt: -1 })
      .lean();

    const alerts = products.map((product) => ({
      ...product,
      severity: product.stock <= 3 ? "critical" : "warning",
    }));

    res.json({
      threshold,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch low stock alerts" });
  }
};

// Add a new product
export const addVendorProduct = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });
    if (!requireApprovedVendor(req, res)) return;

    const { name, price, description, stock, category, images, sizes, oldPrice, discount, isFlashSale } = req.body;

    if (images !== undefined) {
      if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ message: "Please upload at least 1 product image." });
      }
      if (images.length > 5) {
        return res.status(400).json({ message: "You can upload a maximum of 5 product images." });
      }
    }

    const normalizedImages =
      Array.isArray(images) && images.length > 0
        ? images.slice(0, 5)
        : ["https://via.placeholder.com/150"];

    const newProduct = new Product({
      name,
      price,
      description,
      stock,
      category: category || "General",
      images: normalizedImages,
      sizes: Array.isArray(sizes) ? sizes : [],
      rating: 0,
      oldPrice: oldPrice || null,
      discount: discount || 0,
      isFlashSale: await resolveFlashSaleFlag(isFlashSale),
      vendor: vendorId,
    });

    await newProduct.save();
    queueProductNewsletterAlerts({ type: "new_product", product: newProduct });
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
    if (!requireApprovedVendor(req, res)) return;

    const product = await Product.findOne({ _id: id, vendor: vendorId });
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    const previousProduct = {
      price: product.price,
      discount: product.discount,
      isFlashSale: product.isFlashSale,
    };

    const { name, price, description, stock, category, images, sizes, oldPrice, discount, isFlashSale } = req.body;

    // Validate required fields
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "Images are required and must be a non-empty array." });
    }
    if (images.length > 5) {
      return res.status(400).json({ message: "You can upload a maximum of 5 product images." });
    }
    if (sizes !== undefined && !Array.isArray(sizes)) {
      return res.status(400).json({ message: "Sizes must be an array." });
    }
    if (!category || typeof category !== "string" || category.trim() === "") {
      return res.status(400).json({ message: "Category is required." });
    }

    product.name = name !== undefined ? name : product.name;
    product.price = price !== undefined ? price : product.price;
    product.description = description !== undefined ? description : product.description;
    product.stock = stock !== undefined ? stock : product.stock;
    product.category = category !== undefined ? category : product.category;
    product.images = images.slice(0, 5);
    product.sizes = Array.isArray(sizes) ? sizes : product.sizes;
    // Rating is customer-driven only — vendors cannot set or update it.
    product.oldPrice = oldPrice !== undefined ? oldPrice : product.oldPrice;
    product.discount = discount !== undefined ? discount : product.discount;
    if (isFlashSale !== undefined) {
      product.isFlashSale = await resolveFlashSaleFlag(isFlashSale);
    }

    await product.save();
    queueProductNewsletterAlerts({ type: "update", product, previousProduct });
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
    if (!requireApprovedVendor(req, res)) return;

    const product = await Product.findOneAndDelete({ _id: id, vendor: vendorId });
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
