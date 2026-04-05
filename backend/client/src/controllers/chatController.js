import ChatMessage from "../models/ChatMessage.js";

export const getChatThreads = async (req, res) => {
  try {
    const userId = req.user?._id;

    const threads = await ChatMessage.aggregate([
      {
        $match: {
          $or: [{ fromUser: userId }, { toUser: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          counterpartVendor: { $ifNull: ["$toVendor", "$fromVendor"] },
        },
      },
      {
        $group: {
          _id: "$counterpartVendor",
          lastMessage: { $first: "$message" },
          lastAt: { $first: "$createdAt" },
          product: { $first: "$product" },
          unread: {
            $sum: {
              $cond: [
                {
                  $and: [{ $eq: ["$toUser", userId] }, { $eq: ["$isReadByUser", false] }],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "_id",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $project: {
          _id: 0,
          vendorId: "$_id",
          lastMessage: 1,
          lastAt: 1,
          unread: 1,
          vendor: { $arrayElemAt: ["$vendor", 0] },
          product: { $arrayElemAt: ["$product", 0] },
        },
      },
      { $sort: { lastAt: -1 } },
    ]);

    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: "Failed to load chat threads" });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { vendorId, productId } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }

    const userId = req.user._id;
    const baseFilter = {
      $or: [
        { fromUser: userId, toVendor: vendorId },
        { fromVendor: vendorId, toUser: userId },
      ],
    };

    if (productId) {
      baseFilter.product = productId;
    }

    const messages = await ChatMessage.find(baseFilter)
      .sort({ createdAt: 1 })
      .populate("fromUser", "name")
      .populate("toUser", "name")
      .populate("toVendor", "storeName")
      .populate("fromVendor", "storeName")
      .populate("product", "name images");

    await ChatMessage.updateMany(
      { fromVendor: vendorId, toUser: userId, isReadByUser: false },
      { $set: { isReadByUser: true } }
    );

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
      isReadByUser: true,
      isReadByVendor: false,
    });

    const populated = await created.populate("toVendor", "storeName");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};