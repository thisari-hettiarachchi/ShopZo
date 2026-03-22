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
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.json({ vendor: {
      storeName: vendor.storeName,
      email: vendor.email,
      phone: vendor.phone || '',
      address: vendor.address || '',
      description: vendor.description || ''
    } });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const { storeName, email, phone, address, description } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.storeName = storeName || vendor.storeName;
    vendor.email = email || vendor.email;
    vendor.phone = phone !== undefined ? phone : vendor.phone;
    vendor.address = address !== undefined ? address : vendor.address;
    vendor.description = description !== undefined ? description : vendor.description;

    await vendor.save();

    res.json({ vendor: {
      storeName: vendor.storeName,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      description: vendor.description
    } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
