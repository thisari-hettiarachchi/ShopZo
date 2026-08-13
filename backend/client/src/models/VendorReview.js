import mongoose from "mongoose";

const vendorReviewSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: "" },
    comment: { type: String, default: "" },
    verifiedBuyer: { type: Boolean, default: false },
  },
  { timestamps: true }
);

vendorReviewSchema.index({ vendor: 1, user: 1 }, { unique: true });

export default mongoose.model("VendorReview", vendorReviewSchema);
