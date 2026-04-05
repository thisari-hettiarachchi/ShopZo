import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  storeName: { type: String, required: true },
  email: String,
  description: String,
  phone: String,
  address: String,
  profileImage: String,
  isApproved: { type: Boolean, default: false },
  followersCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Vendor", vendorSchema);
