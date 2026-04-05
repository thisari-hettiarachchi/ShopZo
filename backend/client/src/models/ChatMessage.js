import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toVendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    fromVendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    isReadByVendor: { type: Boolean, default: false },
    isReadByUser: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);