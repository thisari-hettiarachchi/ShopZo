import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true, collection: "admins" }
);

const AdminUser = mongoose.models.Admin || mongoose.model("Admin", adminUserSchema);

export default AdminUser;
