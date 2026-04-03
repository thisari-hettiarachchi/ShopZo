import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toVendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);