import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get user's cart
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path: "items.product",
      populate: { path: "vendor" }
    });
  res.json(cart || { items: [] });
};

// Add item to cart 
export const addToCart = async (req, res) => {
  const { productId, qty } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const exists = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (exists) {
    return res.status(400).json({
      message: "Product already in cart"
    });
  }

  cart.items.push({
    product: productId,
    qty,
    price: product.price,
  });

  await cart.save();
  const populatedCart = await Cart.findById(cart._id).populate({
    path: "items.product",
    populate: { path: "vendor" }
  });
  res.json(populatedCart);
};

// Update item quantity
export const updateCartItem = async (req, res) => {
  const { itemId, qty } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.id(itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.qty = qty;
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate({
    path: "items.product",
    populate: { path: "vendor" }
  });
  res.json(populatedCart);
};

// Remove item from cart 
export const removeCartItem = async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.id(itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  item.deleteOne(); 
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate({
    path: "items.product",
    populate: { path: "vendor" }
  });
  res.json(populatedCart);
};

