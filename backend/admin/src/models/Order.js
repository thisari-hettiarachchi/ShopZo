import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({}, { strict: false, collection: "orders" });

const Order = mongoose.models.AdminOrder || mongoose.model("AdminOrder", orderSchema);

export default Order;
