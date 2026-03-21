import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  stock: { type: Number, default: 0 },
  category: String,
  image: String,
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
