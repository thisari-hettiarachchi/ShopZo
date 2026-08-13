import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const normalizeSelectedColor = (color) => {
  if (!color) return { name: "", hex: "" };
  if (typeof color === "string") {
    return {
      name: color,
      hex: color.startsWith("#") ? color : "",
    };
  }
  return {
    name: String(color.name || "").trim(),
    hex: String(color.hex || "").trim(),
  };
};

const sameVariant = (item, productId, selectedSize, selectedColor) => {
  const itemColorHex = String(item.selectedColor?.hex || "").toLowerCase();
  const nextColorHex = String(selectedColor?.hex || "").toLowerCase();
  return (
    item.product.toString() === String(productId) &&
    String(item.selectedSize || "") === String(selectedSize || "") &&
    itemColorHex === nextColorHex
  );
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
      populate: { path: "vendor" },
    });
    res.json(cart || { items: [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const selectedSize = String(req.body.selectedSize || "").trim();
    const selectedColor = normalizeSelectedColor(req.body.selectedColor);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const availableSizes = Array.isArray(product.sizes) ? product.sizes : [];
    const availableColors = Array.isArray(product.colors) ? product.colors : [];

    if (availableSizes.length > 0 && !selectedSize) {
      return res.status(400).json({ message: "Please select a size" });
    }
    if (availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
      return res.status(400).json({ message: "Selected size is not available for this product" });
    }
    if (availableColors.length > 0 && !selectedColor.hex && !selectedColor.name) {
      return res.status(400).json({ message: "Please select a color" });
    }
    if (availableColors.length > 0) {
      const matched = availableColors.find(
        (color) =>
          String(color.hex || "").toLowerCase() === selectedColor.hex.toLowerCase() ||
          String(color.name || "").toLowerCase() === selectedColor.name.toLowerCase()
      );
      if (!matched) {
        return res.status(400).json({ message: "Selected color is not available for this product" });
      }
      selectedColor.name = matched.name;
      selectedColor.hex = matched.hex;
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const exists = cart.items.find((item) =>
      sameVariant(item, productId, selectedSize, selectedColor)
    );

    if (exists) {
      return res.status(400).json({
        message: "This product variant is already in your cart",
      });
    }

    cart.items.push({
      product: productId,
      qty: Number(qty) || 1,
      price: product.price,
      selectedSize,
      selectedColor,
    });

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      populate: { path: "vendor" },
    });
    res.json(populatedCart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

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
      populate: { path: "vendor" },
    });
    res.json(populatedCart);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
};

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
      populate: { path: "vendor" },
    });
    res.json(populatedCart);
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

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
