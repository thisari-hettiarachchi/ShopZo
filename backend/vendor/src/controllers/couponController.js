import Coupon from "../models/Coupon.js";

export const getVendorCoupons = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const coupons = await Coupon.find({ vendor: vendorId }).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coupons" });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const payload = {
      ...req.body,
      code: String(req.body.code || "").trim().toUpperCase(),
      vendor: vendorId,
    };

    if (!payload.code || !payload.value) {
      return res.status(400).json({ message: "Coupon code and value are required" });
    }

    const coupon = await Coupon.create(payload);
    res.status(201).json(coupon);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Coupon code already exists" });
    }
    res.status(500).json({ message: "Failed to create coupon" });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const updates = { ...req.body };
    if (updates.code) updates.code = String(updates.code).trim().toUpperCase();

    const coupon = await Coupon.findOneAndUpdate(
      { _id: req.params.id, vendor: vendorId },
      updates,
      { new: true }
    );

    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Failed to update coupon" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const coupon = await Coupon.findOneAndDelete({ _id: req.params.id, vendor: vendorId });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete coupon" });
  }
};
