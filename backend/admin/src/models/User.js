import mongoose from "mongoose";

const userSchema = new mongoose.Schema({}, { strict: false, collection: "users" });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
