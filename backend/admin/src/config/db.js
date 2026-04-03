import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("Missing MongoDB URI. Set MONGO_URI (or MONGODB_URI) in backend/admin/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Admin MongoDB connected");
  } catch (error) {
    console.error("Admin MongoDB connection failed", error.message);
    process.exit(1);
  }
};

export default connectDB;
