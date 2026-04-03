import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true, trim: true },
    details: { type: String, default: "" },
    status: { type: String, enum: ["Requested", "Approved", "Rejected", "Refunded"], default: "Requested" },
  },
  { timestamps: true }
);

export default mongoose.model("ReturnRequest", returnRequestSchema);