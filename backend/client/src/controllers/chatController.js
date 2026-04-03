import ChatMessage from "../models/ChatMessage.js";

export const getChatMessages = async (req, res) => {
  try {
    const { vendorId, productId } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }

    const filter = {
      fromUser: req.user._id,
      toVendor: vendorId,
    };

    if (productId) {
      filter.product = productId;
    }

    const messages = await ChatMessage.find(filter)
      .sort({ createdAt: 1 })
      .populate("toVendor", "storeName")
      .populate("product", "name images");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to load chat messages" });
  }
};

export const sendChatMessage = async (req, res) => {
  try {
    const { vendorId, productId, message } = req.body;

    if (!vendorId || !message?.trim()) {
      return res.status(400).json({ message: "vendorId and message are required" });
    }

    const created = await ChatMessage.create({
      fromUser: req.user._id,
      toVendor: vendorId,
      product: productId || undefined,
      message: message.trim(),
    });

    const populated = await created.populate("toVendor", "storeName");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};