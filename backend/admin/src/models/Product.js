import mongoose from "mongoose";

const productSchema = new mongoose.Schema({}, { strict: false, collection: "products" });

const Product = mongoose.models.AdminProduct || mongoose.model("AdminProduct", productSchema);

export default Product;
