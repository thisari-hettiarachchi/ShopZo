import mongoose from "mongoose";

const cardSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cardHolder: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expiry: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);
export default Card;
