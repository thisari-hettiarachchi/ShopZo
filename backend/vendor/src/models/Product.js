import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number }, 
  images: { type: Array, required: true },
  description: { type: String, required: true },
  sizes: { type: Array, default: [] },
  colors: [
    {
      name: { type: String, required: true },
      hex: { type: String, required: true },
      images: { type: [String], default: [] },
    },
  ],
  stock: { type: Number, default: 0 },
  rating: { type: Number, required: true },
  category: { type: String, required: true },
  discount: { type: Number, default: 0 }, 
  isFlashSale: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
