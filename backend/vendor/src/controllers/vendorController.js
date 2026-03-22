import Vendor from "../models/Vendor.js";
import User from "../models/User.js";

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('user', 'name email').limit(10);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
};

export const getVendorProfile = async (req, res) => {
  try {
    // Assume vendor id is in req.user.id (set by auth middleware)
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Vendor not found" });
    const vendor = await Vendor.findOne({ user: userId });
    res.json({ vendor: {
      storeName: vendor?.storeName || user.name,
      email: user.email,
      phone: vendor?.phone || '',
      address: vendor?.address || '',
      description: vendor?.description || ''
    } });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateVendorProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { storeName, email, phone, address, description } = req.body;
    await User.findByIdAndUpdate(userId, { name: storeName, email });
    let vendor = await Vendor.findOne({ user: userId });
    if (!vendor) {
      vendor = new Vendor({ user: userId, storeName, description, phone, address });
    } else {
      vendor.storeName = storeName;
      vendor.description = description;
      vendor.phone = phone;
      vendor.address = address;
    }
    await vendor.save();
    res.json({ vendor: {
      storeName: vendor.storeName,
      email,
      phone,
      address,
      description
    } });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
