import Banner from "../models/Banner.js";
import "../models/Vendor.js";

export const getPublicBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ status: "approved", isActive: true })
      .select("title subtitle image layout vendor updatedAt")
      .populate("vendor", "storeName")
      .sort({ updatedAt: -1 })
      .limit(12)
      .lean();

    res.set("Cache-Control", "public, max-age=60");
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch banners" });
  }
};
