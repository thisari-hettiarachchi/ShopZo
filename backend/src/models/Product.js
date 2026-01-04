import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String],
  description: String,
  stock: { type: Number, default: 0 },
  category: String,
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
