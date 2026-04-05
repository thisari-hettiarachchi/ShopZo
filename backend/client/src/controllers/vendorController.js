import Vendor from "../models/Vendor.js";

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ followersCount: -1, createdAt: -1 }).limit(20);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
};

export const getVendorFollowStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id).select("followersCount");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const followed = (req.user?.followingVendors || []).some(
      (vendorId) => String(vendorId) === String(id)
    );

    res.json({ followed, followersCount: Number(vendor.followersCount || 0) });
  } catch (error) {
    res.status(500).json({ message: "Failed to load follow status" });
  }
};

export const followVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const alreadyFollowing = (req.user.followingVendors || []).some(
      (vendorId) => String(vendorId) === String(id)
    );

    if (!alreadyFollowing) {
      req.user.followingVendors = [...(req.user.followingVendors || []), vendor._id];
      vendor.followersCount = Number(vendor.followersCount || 0) + 1;
      await Promise.all([req.user.save(), vendor.save()]);
    }

    res.json({ followed: true, followersCount: Number(vendor.followersCount || 0) });
  } catch (error) {
    res.status(500).json({ message: "Failed to follow vendor" });
  }
};

export const unfollowVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const wasFollowing = (req.user.followingVendors || []).some(
      (vendorId) => String(vendorId) === String(id)
    );

    if (wasFollowing) {
      req.user.followingVendors = (req.user.followingVendors || []).filter(
        (vendorId) => String(vendorId) !== String(id)
      );
      vendor.followersCount = Math.max(Number(vendor.followersCount || 0) - 1, 0);
      await Promise.all([req.user.save(), vendor.save()]);
    }

    res.json({ followed: false, followersCount: Number(vendor.followersCount || 0) });
  } catch (error) {
    res.status(500).json({ message: "Failed to unfollow vendor" });
  }
};
