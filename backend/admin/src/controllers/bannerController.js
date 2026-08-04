import Banner from "../models/Banner.js";
import VendorNotification from "../models/VendorNotification.js";

export const getBanners = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }

    const banners = await Banner.find(filter)
      .populate("vendor", "storeName")
      .sort({ createdAt: -1 });

    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBannerStatus = async (req, res) => {
  try {
    const { decision, reason = "" } = req.body;
    if (!["approve", "reject"].includes(decision)) {
      return res.status(400).json({ message: "decision must be either 'approve' or 'reject'" });
    }

    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    banner.status = decision === "approve" ? "approved" : "rejected";
    banner.moderation = {
      ...(banner.moderation || {}),
      reviewedBy: req.user?._id || null,
      reviewedAt: new Date(),
      rejectionReason: decision === "reject" ? String(reason || "Rejected by admin") : "",
    };

    await banner.save();

    await VendorNotification.create({
      vendor: banner.vendor,
      type: "system",
      title: decision === "approve" ? "Promotion banner approved" : "Promotion banner rejected",
      message:
        decision === "approve"
          ? "Your promotion banner has been approved and is now live on the homepage."
          : `Your promotion banner was rejected${reason ? `: ${reason}` : "."}`,
      action: decision === "approve" ? "banner_approved" : "banner_rejected",
      metadata: { bannerId: banner._id, reason: reason || "" },
    });

    const populated = await Banner.findById(banner._id).populate("vendor", "storeName");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBannerActive = async (req, res) => {
  try {
    const { isActive } = req.body;

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { isActive: Boolean(isActive) },
      { new: true }
    ).populate("vendor", "storeName");

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
