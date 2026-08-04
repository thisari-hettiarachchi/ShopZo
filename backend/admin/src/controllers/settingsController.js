import Settings from "../models/Settings.js";
import Product from "../models/Product.js";
import Vendor from "../models/Vendor.js";
import VendorNotification from "../models/VendorNotification.js";

export const getSettings = async (_req, res) => {
  try {
    let settings = await Settings.findOne({ key: "global" });
    if (!settings) {
      settings = await Settings.create({ key: "global" });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFlashSaleStatus = async (req, res) => {
  try {
    const nextEnabled = Boolean(req.body.enabled);

    const previous = await Settings.findOne({ key: "global" });
    const wasEnabled = Boolean(previous?.flashSaleEnabled);

    // Disabling only hides the storefront section; vendors' existing selections
    // are preserved so re-enabling brings back the same set of opted-in products.
    const settings = await Settings.findOneAndUpdate(
      { key: "global" },
      { flashSaleEnabled: nextEnabled },
      { new: true, upsert: true }
    );

    // Notify every vendor only when the feature is freshly turned on.
    if (nextEnabled && !wasEnabled) {
      const vendors = await Vendor.find({}).select("_id");
      if (vendors.length > 0) {
        await VendorNotification.insertMany(
          vendors.map((vendor) => ({
            vendor: vendor._id,
            type: "system",
            title: "Flash Sale is now live",
            message: "Admin has enabled Flash Sale. Add a product or edit an existing one to select it for the Flash Sale.",
            action: "flash_sale_enabled",
          }))
        );
      }
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFlashSaleProducts = async (_req, res) => {
  try {
    const products = await Product.find({ isFlashSale: true })
      .populate("vendor", "storeName")
      .sort({ updatedAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
