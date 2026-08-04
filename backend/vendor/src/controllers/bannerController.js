import Banner from "../models/Banner.js";

const requireApprovedVendor = (req, res) => {
  const accountStatus = req.user?.accountStatus || "pending";
  if (accountStatus !== "approved") {
    res.status(403).json({ message: "Your vendor account must be approved before you can manage promotion banners." });
    return false;
  }

  return true;
};

export const getVendorBanners = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const banners = await Banner.find({ vendor: vendorId }).sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch banners" });
  }
};

export const createBanner = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });
    if (!requireApprovedVendor(req, res)) return;

    const { image, title, subtitle, layout } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Banner image is required." });
    }

    const banner = await Banner.create({
      vendor: vendorId,
      image,
      title: title || "",
      subtitle: subtitle || "",
      layout: layout === "portrait" ? "portrait" : "landscape",
      status: "pending",
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ message: "Failed to create banner" });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    const { id } = req.params;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });
    if (!requireApprovedVendor(req, res)) return;

    const banner = await Banner.findOne({ _id: id, vendor: vendorId });
    if (!banner) return res.status(404).json({ message: "Banner not found or unauthorized" });

    const { image, title, subtitle, layout } = req.body;

    banner.image = image !== undefined ? image : banner.image;
    banner.title = title !== undefined ? title : banner.title;
    banner.subtitle = subtitle !== undefined ? subtitle : banner.subtitle;
    banner.layout = layout === "portrait" || layout === "landscape" ? layout : banner.layout;

    await banner.save();
    res.json(banner);
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: "Failed to update banner" });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    const { id } = req.params;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const banner = await Banner.findOneAndDelete({ _id: id, vendor: vendorId });
    if (!banner) return res.status(404).json({ message: "Banner not found or unauthorized" });

    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete banner" });
  }
};

export const requestBannerApproval = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    const { id } = req.params;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });
    if (!requireApprovedVendor(req, res)) return;

    const banner = await Banner.findOne({ _id: id, vendor: vendorId });
    if (!banner) return res.status(404).json({ message: "Banner not found or unauthorized" });

    if (banner.status !== "rejected") {
      return res.status(400).json({ message: "Only rejected banners can be resubmitted for approval." });
    }

    banner.status = "pending";
    banner.moderation.rejectionReason = "";
    await banner.save();

    res.json(banner);
  } catch (error) {
    console.error("Error requesting banner approval:", error);
    res.status(500).json({ message: "Failed to request approval" });
  }
};
