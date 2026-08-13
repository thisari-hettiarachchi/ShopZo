import Product from "../models/Product.js";
import Settings from "../models/Settings.js";
import { queueProductNewsletterAlerts } from "../services/newsletterAlertService.js";

const MAX_COLOR_IMAGES = 4;

const capitalizeText = (value) => {
  if (value == null) return "";
  const text = String(value).trim().replace(/\s+/g, " ");
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => {
      if (!word) return word;
      if (word.length <= 3 && word === word.toUpperCase() && /[A-Z]/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

const normalizeColorImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .filter((img) => typeof img === "string" && img.trim())
    .map((img) => img.trim())
    .slice(0, MAX_COLOR_IMAGES);
};

const normalizeColors = (colors) => {
  if (!Array.isArray(colors)) return [];
  const seen = new Set();
  return colors
    .map((color) => {
      if (!color) return null;
      if (typeof color === "string") {
        const value = color.trim();
        if (!value) return null;
        return {
          name: capitalizeText(value),
          hex: value.startsWith("#") ? value : "#9CA3AF",
          images: [],
        };
      }
      const hex = String(color.hex || color.value || "").trim();
      const name = String(color.name || color.label || hex || "").trim();
      if (!hex && !name) return null;
      return {
        name: capitalizeText(name || hex),
        hex: hex.startsWith("#") ? hex : "#9CA3AF",
        images: normalizeColorImages(color.images),
      };
    })
    .filter(Boolean)
    .filter((color) => {
      const key = `${color.name.toLowerCase()}|${color.hex.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

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
    res.status(403).json({
      message: "Your vendor account must be approved before you can add or manage products.",
    });
    return false;
  }

  return true;
};

const resolveFlashSaleFlag = async (requestedFlag) => {
  if (!requestedFlag) return false;
  const settings = await Settings.findOne({ key: "global" });
  return Boolean(settings?.flashSaleEnabled);
};

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

export const addVendorProduct = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });
    if (!requireApprovedVendor(req, res)) return;

    const {
      name,
      price,
      description,
      stock,
      category,
      images,
      sizes,
      colors,
      oldPrice,
      discount,
      isFlashSale,
    } = req.body;

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
      name: capitalizeText(name),
      price,
      description,
      stock,
      category: capitalizeText(category || "General"),
      images: normalizedImages,
      sizes: Array.isArray(sizes) ? sizes : [],
      colors: normalizeColors(colors),
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

    const {
      name,
      price,
      description,
      stock,
      category,
      images,
      sizes,
      colors,
      oldPrice,
      discount,
      isFlashSale,
    } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "Images are required and must be a non-empty array." });
    }
    if (images.length > 5) {
      return res.status(400).json({ message: "You can upload a maximum of 5 product images." });
    }
    if (sizes !== undefined && !Array.isArray(sizes)) {
      return res.status(400).json({ message: "Sizes must be an array." });
    }
    if (colors !== undefined && !Array.isArray(colors)) {
      return res.status(400).json({ message: "Colors must be an array." });
    }
    if (!category || typeof category !== "string" || category.trim() === "") {
      return res.status(400).json({ message: "Category is required." });
    }

    product.name = name !== undefined ? capitalizeText(name) : product.name;
    product.price = price !== undefined ? price : product.price;
    product.description = description !== undefined ? description : product.description;
    product.stock = stock !== undefined ? stock : product.stock;
    product.category = category !== undefined ? capitalizeText(category) : product.category;
    product.images = images.slice(0, 5);
    product.sizes = Array.isArray(sizes) ? sizes : product.sizes;
    if (colors !== undefined) {
      product.colors = normalizeColors(colors);
    }
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
