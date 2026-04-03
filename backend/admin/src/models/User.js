import mongoose from "mongoose";

const userSchema = new mongoose.Schema({}, { strict: false, collection: "users" });

const User = mongoose.models.AdminClientUser || mongoose.model("AdminClientUser", userSchema);

export default User;
