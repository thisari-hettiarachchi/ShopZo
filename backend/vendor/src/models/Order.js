import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  total: { type: Number, required: true },
  status: { type: String, default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
