import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { storeName, email, password } = req.body;

    if (!storeName || !email || !password) {
      return res.status(400).json({ message: "storeName, email and password are required" });
    }

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = await Vendor.create({
      storeName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Vendor registered successfully",
      vendor: {
        _id: vendor._id,
        storeName: vendor.storeName,
        email: vendor.email,
        role: vendor.role,
        isApproved: vendor.isApproved,
        description: vendor.description,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const vendor = await Vendor.findOne({ email });
    if (!vendor)
      return res.status(404).json({ message: "Vendor not found" });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: vendor._id, role: vendor.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      vendor: {
        _id: vendor._id,
        storeName: vendor.storeName,
        email: vendor.email,
        role: vendor.role,
        isApproved: vendor.isApproved,
        description: vendor.description,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
