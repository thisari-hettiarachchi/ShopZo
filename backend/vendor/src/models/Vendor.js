import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: String,
  phone: String,
  address: String,
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Vendor", vendorSchema);
