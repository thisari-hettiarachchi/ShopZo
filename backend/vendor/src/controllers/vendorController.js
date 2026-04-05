import Vendor from "../models/Vendor.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().limit(10);
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

    const products = await Product.find({ vendor: vendorId }).select("_id rating");
    const productCount = products.length;
    const averageRating = productCount
      ? Number((products.reduce((sum, item) => sum + Number(item.rating || 0), 0) / productCount).toFixed(1))
      : 0;
    const productIds = products.map((item) => item._id);
    const reviewCount = productIds.length
      ? await Review.countDocuments({ product: { $in: productIds } })
      : 0;

    res.json({ vendor: {
      id: vendor._id,
      storeName: vendor.storeName,
      email: vendor.email,
      phone: vendor.phone || '',
      address: vendor.address || '',
      description: vendor.description || '',
      profileImage: vendor.profileImage || '',
      isApproved: Boolean(vendor.isApproved),
      joined: vendor.createdAt,
      stats: {
        products: productCount,
        rating: averageRating,
        reviews: reviewCount,
        followers: Number(vendor.followersCount || 0),
        status: vendor.isApproved ? "Approved" : "Pending",
      },
    } });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const { storeName, email, phone, address, description, profileImage } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.storeName = storeName || vendor.storeName;
    vendor.email = email || vendor.email;
    vendor.phone = phone !== undefined ? phone : vendor.phone;
    vendor.address = address !== undefined ? address : vendor.address;
    vendor.description = description !== undefined ? description : vendor.description;
    vendor.profileImage = profileImage !== undefined ? profileImage : vendor.profileImage;

    await vendor.save();

    res.json({ vendor: {
      id: vendor._id,
      storeName: vendor.storeName,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      description: vendor.description,
      profileImage: vendor.profileImage || '',
      isApproved: Boolean(vendor.isApproved),
      joined: vendor.createdAt,
    } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
