import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number }, 
  images: { type: Array, required: true },
  description: { type: String, required: true },
  sizes: { type: Array, required: true },
  stock: { type: Number, default: 0 },
  rating: { type: Number, required: true },
  ratingCount: { type: Number, default: 0 },
  category: { type: String, required: true },
  shippedFrom: { type: String, default: "" },
  discount: { type: Number, default: 0 }, 
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
