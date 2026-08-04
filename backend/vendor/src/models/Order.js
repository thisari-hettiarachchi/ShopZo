import mongoose from "mongoose";

// This model reads/writes the same "orders" collection owned by backend/client.
// `strict: false` lets vendor queries access fields (paymentStatus, amountPaid,
// statusHistory, coupon, etc.) defined on the canonical client-side schema
// without having to duplicate and keep every field in sync here.
const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: Number,
      },
    ],
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    total: { type: Number, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Order", orderSchema);
