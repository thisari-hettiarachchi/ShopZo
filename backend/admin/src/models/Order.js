import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		products: [
			{
				product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
				quantity: { type: Number },
				price: { type: Number },
			},
		],
		vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		total: { type: Number },
		status: { type: String },
	},
	{ strict: false, collection: "orders" }
);

const Order = mongoose.models.AdminOrder || mongoose.model("AdminOrder", orderSchema);

export default Order;
