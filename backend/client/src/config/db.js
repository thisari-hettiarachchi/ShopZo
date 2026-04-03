import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MongoDB URI. Set MONGO_URI or MONGODB_URI in backend/client/.env");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error.message);
    throw error;
  }
};

export default connectDB;
