import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  storeName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: "vendor" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  description: { type: String, default: "" },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Vendor", vendorSchema);
