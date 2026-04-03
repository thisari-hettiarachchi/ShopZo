import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: "items.product",
        populate: { path: "vendor" }
      });
    res.json(cart || { items: [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// Add item to cart 
export const addToCart = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

// Update item quantity
export const updateCartItem = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
};

// Remove item from cart 
export const removeCartItem = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

// Clear all items from cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: "Cart cleared", items: [] });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
