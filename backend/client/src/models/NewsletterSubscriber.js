import mongoose from "mongoose";
import crypto from "crypto";

const preferencesSchema = new mongoose.Schema(
  {
    newProducts: { type: Boolean, default: true },
    priceDrops: { type: Boolean, default: true },
    discounts: { type: Boolean, default: true },
  },
  { _id: false }
);

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: { type: Boolean, default: true },
    unsubscribeToken: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomBytes(32).toString("hex"),
    },
    preferences: { type: preferencesSchema, default: () => ({}) },
    source: { type: String, default: "footer" },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

newsletterSubscriberSchema.index({ isActive: 1, "preferences.newProducts": 1 });
newsletterSubscriberSchema.index({ isActive: 1, "preferences.priceDrops": 1 });
newsletterSubscriberSchema.index({ isActive: 1, "preferences.discounts": 1 });

export default mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);
