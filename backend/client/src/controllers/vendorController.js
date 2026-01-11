import Vendor from "../models/Vendor.js";

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().limit(10); // top 10 vendors
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
};
