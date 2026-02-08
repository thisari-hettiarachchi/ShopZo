import Vendor from "../models/Vendor.js";

export const getVendorProfile = async (req, res) => {
  try {
    if (!req.vendor?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const vendor = await Vendor.findById(req.vendor._id).select("-password");
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({ vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVendorProfile = async (req, res) => {
  try {
    if (!req.vendor?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { storeName, email, phone, address, description } = req.body;

    const vendor = await Vendor.findById(req.vendor._id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (typeof storeName === "string") vendor.storeName = storeName;
    if (typeof email === "string") vendor.email = email;
    if (typeof phone === "string") vendor.phone = phone;
    if (typeof address === "string") vendor.address = address;
    if (typeof description === "string") vendor.description = description;

    await vendor.save();

    const sanitized = await Vendor.findById(req.vendor._id).select("-password");
    res.json({ message: "Profile updated", vendor: sanitized });
  } catch (error) {
    // Most common: duplicate email unique index
    res.status(500).json({ message: error.message });
  }
};

// Minimal placeholder endpoint for dashboard integration
export const getDashboardSummary = async (req, res) => {
  try {
    if (!req.vendor?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json({
      stats: {
        sales: 0,
        orders: 0,
        customers: 0,
        reviews: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
