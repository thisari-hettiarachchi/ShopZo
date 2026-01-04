import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: Array, required: true },
  description: { type: String, required: true },
  sizes: { type: Array, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
