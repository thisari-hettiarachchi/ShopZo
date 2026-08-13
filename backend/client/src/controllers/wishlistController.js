import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import { slimWishlist } from "../utils/productPayload.js";

const populateWishlistProducts = {
  path: "items.product",
  select: "name price oldPrice discount rating ratingCount category images stock vendor sizes colors isFlashSale createdAt",
  options: { slice: { images: 1 } },
  populate: { path: "vendor", select: "storeName isApproved" },
};

// GET wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(populateWishlistProducts);

    res.json(slimWishlist(wishlist));
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

// Lightweight IDs-only endpoint for product cards (avoids N+1 fat payloads)
export const getWishlistIds = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).select("items.product").lean();
    const ids = (wishlist?.items || [])
      .map((item) => String(item.product))
      .filter(Boolean);
    res.json({ ids });
  } catch (error) {
    console.error("Error fetching wishlist ids:", error);
    res.status(500).json({ message: "Failed to fetch wishlist ids" });
  }
};

// ADD to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId).select("_id");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [] });
    }

    const exists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (!exists) {
      wishlist.items.push({ product: productId });
    }

    await wishlist.save();
    await wishlist.populate(populateWishlistProducts);

    res.json(slimWishlist(wishlist));
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

// REMOVE from wishlist
export const removeWishlistItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate(populateWishlistProducts);

    res.json(slimWishlist(wishlist));
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
};

// CLEAR wishlist
export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.json({ items: [] });
    }

    wishlist.items = [];
    await wishlist.save();

    res.json(wishlist);
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({ message: "Failed to clear wishlist" });
  }
};
