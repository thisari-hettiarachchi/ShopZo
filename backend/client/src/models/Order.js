import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
      price: Number,
      selectedSize: { type: String, default: "" },
      selectedColor: {
        name: { type: String, default: "" },
        hex: { type: String, default: "" },
      },
    },
  ],
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  total: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  statusHistory: {
    type: [statusHistorySchema],
    default: [{ status: "Placed" }],
  },
  shippingAddress: { type: Object, default: null },
  paymentMethod: { type: String, enum: ["stripe", "cod"], default: "cod" },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  stripeSessionId: { type: String },
  stripePaymentIntentId: { type: String },
  amountPaid: { type: Number },
  currency: { type: String, default: "lkr" },
  coupon: {
    code: { type: String },
    discountAmount: { type: Number },
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
