import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["percentage", "flat"], default: "percentage" },
    value: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number, default: null },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    startsAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.index({ vendor: 1, code: 1 }, { unique: true });

export default mongoose.model("Coupon", couponSchema);
