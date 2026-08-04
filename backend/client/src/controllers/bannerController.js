import Banner from "../models/Banner.js";
import "../models/Vendor.js";

export const getPublicBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ status: "approved", isActive: true })
      .populate("vendor", "storeName")
      .sort({ updatedAt: -1 })
      .limit(20);

    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch banners" });
  }
};
