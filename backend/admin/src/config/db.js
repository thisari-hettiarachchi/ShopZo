import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MongoDB URI. Set MONGO_URI (or MONGODB_URI) in backend/admin/.env");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Admin MongoDB connected");
  } catch (error) {
    throw new Error(`Admin MongoDB connection failed: ${error.message}`);
  }
};

export default connectDB;
