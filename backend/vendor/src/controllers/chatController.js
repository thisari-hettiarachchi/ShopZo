import mongoose from "mongoose";
import ChatMessage from "../models/ChatMessage.js";

export const getVendorChatThreads = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const threads = await ChatMessage.aggregate([
      {
        $match: {
          $or: [{ toVendor: new mongoose.Types.ObjectId(vendorId) }, { fromVendor: new mongoose.Types.ObjectId(vendorId) }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          counterpartUser: { $ifNull: ["$fromUser", "$toUser"] },
        },
      },
      {
        $group: {
          _id: "$counterpartUser",
          lastMessage: { $first: "$message" },
          lastAt: { $first: "$createdAt" },
          product: { $first: "$product" },
          unread: {
            $sum: {
              $cond: [{ $and: [{ $eq: ["$toVendor", new mongoose.Types.ObjectId(vendorId)] }, { $eq: ["$isReadByVendor", false] }] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          lastMessage: 1,
          lastAt: 1,
          unread: 1,
          user: { $arrayElemAt: ["$user", 0] },
          product: 1,
        },
      },
      { $sort: { lastAt: -1 } },
    ]);

    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chat threads" });
  }
};

export const getVendorChatMessages = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    const { userId } = req.params;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const messages = await ChatMessage.find({
      $or: [
        { fromUser: userId, toVendor: vendorId },
        { fromVendor: vendorId, toUser: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .populate("product", "name images");

    await ChatMessage.updateMany(
      { fromUser: userId, toVendor: vendorId, isReadByVendor: false },
      { $set: { isReadByVendor: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chat messages" });
  }
};

export const sendVendorChatMessage = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    const { userId } = req.params;
    const { message, productId } = req.body;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });
    if (!message?.trim()) return res.status(400).json({ message: "Message is required" });

    const created = await ChatMessage.create({
      fromVendor: vendorId,
      toUser: userId,
      product: productId || undefined,
      message: message.trim(),
      isReadByUser: false,
      isReadByVendor: true,
    });

    const populated = await created.populate("toUser", "name email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};
