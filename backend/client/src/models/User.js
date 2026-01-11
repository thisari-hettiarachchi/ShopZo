import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    fullName: String,
    addressLine: String,
    region: String,
    phone: String,
    isDefaultShipping: {
      type: Boolean,
      default: false,
    },
    isDefaultBilling: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,

    addresses: {
      type: [addressSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
