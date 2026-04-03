import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
	},
	{ strict: false, collection: "products" }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
