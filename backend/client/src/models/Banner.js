import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    image: { type: String, required: true },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    layout: { type: String, enum: ["landscape", "portrait"], default: "landscape" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    isActive: { type: Boolean, default: true },
    moderation: {
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, default: null },
      reviewedAt: { type: Date, default: null },
      rejectionReason: { type: String, default: "" },
      note: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
export default Banner;
