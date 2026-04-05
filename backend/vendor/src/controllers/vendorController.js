import Vendor from "../models/Vendor.js";
import VendorNotification from "../models/VendorNotification.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({
      isApproved: true,
      accountStatus: { $in: ["approved", null] },
    }).limit(20);
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
      accountStatus: vendor.accountStatus || (vendor.isApproved ? "approved" : "pending"),
      approvalRequest: {
        status: vendor.approvalRequest?.status || (vendor.isApproved ? "approved" : "pending"),
        requestedAt: vendor.approvalRequest?.requestedAt || null,
        reviewedAt: vendor.approvalRequest?.reviewedAt || null,
        message: vendor.approvalRequest?.message || "",
      },
      joined: vendor.createdAt,
      stats: {
        products: productCount,
        rating: averageRating,
        reviews: reviewCount,
        followers: Number(vendor.followersCount || 0),
        status: vendor.accountStatus || (vendor.isApproved ? "approved" : "pending"),
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
      accountStatus: vendor.accountStatus || (vendor.isApproved ? "approved" : "pending"),
      approvalRequest: {
        status: vendor.approvalRequest?.status || (vendor.isApproved ? "approved" : "pending"),
        requestedAt: vendor.approvalRequest?.requestedAt || null,
        reviewedAt: vendor.approvalRequest?.reviewedAt || null,
        message: vendor.approvalRequest?.message || "",
      },
      joined: vendor.createdAt,
    } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const sendApprovalRequest = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const { message = "Please review my vendor account." } = req.body;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.approvalRequest = {
      ...(vendor.approvalRequest || {}),
      status: "pending",
      requestedAt: new Date(),
      reviewedAt: null,
      message: String(message || "").trim() || "Please review my vendor account.",
    };

    if (!vendor.accountStatus || vendor.accountStatus === "rejected") {
      vendor.accountStatus = "pending";
      vendor.isApproved = false;
    }

    await vendor.save();
    res.json({
      message: "Approval request sent",
      approvalRequest: vendor.approvalRequest,
      accountStatus: vendor.accountStatus || "pending",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send approval request" });
  }
};

export const getVendorNotifications = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const notifications = await VendorNotification.find({ vendor: vendorId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

export const markVendorNotificationRead = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const notification = await VendorNotification.findOneAndUpdate(
      { _id: req.params.id, vendor: vendorId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};

export const submitVendorDocumentsVerification = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const { documents = [] } = req.body;
    if (!Array.isArray(documents) || !documents.length) {
      return res.status(400).json({ message: "documents array is required" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const files = documents
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        name: item.name || "",
        url: item.url || "",
        type: item.type || "",
        uploadedAt: item.uploadedAt || new Date(),
      }));

    vendor.verification = {
      ...(vendor.verification || {}),
      documents: {
        ...(vendor.verification?.documents || {}),
        status: "pending",
        files,
        reviewedAt: null,
        note: "Documents submitted for review",
      },
    };

    if (!vendor.accountStatus || vendor.accountStatus === "rejected") {
      vendor.accountStatus = "pending";
      vendor.isApproved = false;
    }

    await vendor.save();
    res.json({
      message: "Verification documents submitted",
      verification: vendor.verification,
      accountStatus: vendor.accountStatus,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit verification documents" });
  }
};

export const submitVendorEmailVerification = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.verification = {
      ...(vendor.verification || {}),
      email: {
        ...(vendor.verification?.email || {}),
        status: "pending",
        verifiedAt: null,
        note: "Email verification requested",
      },
    };

    await vendor.save();
    res.json({ message: "Email verification requested", verification: vendor.verification?.email });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit email verification request" });
  }
};
