import mongoose from "mongoose";

const vendorNotificationSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    type: { type: String, enum: ["approval", "rejection", "suspension", "ban", "verification", "system"], default: "system" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    action: { type: String, default: "" },
    metadata: { type: Object, default: {} },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const VendorNotification = mongoose.models.VendorNotification || mongoose.model("VendorNotification", vendorNotificationSchema);

export default VendorNotification;
