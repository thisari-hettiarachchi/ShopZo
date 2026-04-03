import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
	{
		storeName: { type: String, required: true },
		email: { type: String },
		password: { type: String },
		description: String,
		phone: String,
		address: String,
		isApproved: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);

export default Vendor;