import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// GET wishlist
export const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate("items.product");

  res.json(wishlist || { items: [] });
};

// ADD to wishlist
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
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
  await wishlist.populate("items.product");

  res.json(wishlist);
};

// REMOVE from wishlist
export const removeWishlistItem = async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    return res.status(404).json({ message: "Wishlist not found" });
  }

  wishlist.items = wishlist.items.filter(
    (item) => item.product.toString() !== productId
  );

  await wishlist.save();
  await wishlist.populate("items.product");

  res.json(wishlist);
};
