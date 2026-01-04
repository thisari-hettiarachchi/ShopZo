import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  storeName: { type: String, required: true },
  description: String,
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Vendor", vendorSchema);
