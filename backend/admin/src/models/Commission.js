import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    orderTotal: { type: Number, required: true, min: 0 },
    commissionRate: { type: Number, required: true, default: 0.02 },
    commissionAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["unpaid", "paid", "waived"],
      default: "unpaid",
      index: true,
    },
    settledAt: { type: Date, required: true },
    dueDate: { type: Date, required: true, index: true },
    paidAt: { type: Date, default: null },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

commissionSchema.index({ vendor: 1, status: 1 });

export default mongoose.models.Commission || mongoose.model("Commission", commissionSchema);
