import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { storeName, email, password } = req.body;
    // Check if vendor already exists by email
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) return res.status(400).json({ message: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save vendor directly in Vendor collection
    const vendor = new Vendor({ storeName, email, password: hashedPassword });
    await vendor.save();
    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: vendor._id, role: "vendor" }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
    res.json({ token, vendor: {
      id: vendor._id,
      storeName: vendor.storeName,
      email: vendor.email,
      phone: vendor.phone || '',
      address: vendor.address || '',
      description: vendor.description || '',
      profileImage: vendor.profileImage || '',
      isApproved: Boolean(vendor.isApproved),
      joined: vendor.createdAt,
    } });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};
