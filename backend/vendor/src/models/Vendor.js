import mongoose from "mongoose";

const verificationFileSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    url: { type: String, default: "" },
    type: { type: String, default: "" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const vendorSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: String,
  phone: String,
  address: String,
  profileImage: String,
  isApproved: { type: Boolean, default: false },
  accountStatus: {
    type: String,
    enum: ["pending", "approved", "rejected", "suspended", "banned"],
    default: "pending",
  },
  moderation: {
    reviewedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: "" },
    suspensionReason: { type: String, default: "" },
    banReason: { type: String, default: "" },
    note: { type: String, default: "" },
  },
  approvalRequest: {
    status: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    requestedAt: { type: Date, default: null },
    reviewedAt: { type: Date, default: null },
    message: { type: String, default: "" },
  },
  verification: {
    email: {
      status: {
        type: String,
        enum: ["pending", "verified", "failed"],
        default: "pending",
      },
      verifiedAt: { type: Date, default: null },
      note: { type: String, default: "" },
    },
    documents: {
      status: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending",
      },
      files: { type: [verificationFileSchema], default: [] },
      reviewedAt: { type: Date, default: null },
      note: { type: String, default: "" },
    },
  },
  followersCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Vendor", vendorSchema);
