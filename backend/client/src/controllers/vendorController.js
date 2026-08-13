import Vendor from "../models/Vendor.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import ChatMessage from "../models/ChatMessage.js";

const isApprovedVendor = (vendor) => {
  const status = vendor.accountStatus || (vendor.isApproved ? "approved" : "pending");
  return status === "approved" && vendor.isApproved !== false;
};

const formatJoinedYears = (createdAt) => {
  if (!createdAt) return { value: "—", label: "Joined" };
  const years = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  if (years < 1) {
    const months = Math.max(1, Math.floor(years * 12));
    return { value: String(months), unit: months === 1 ? "month" : "months", label: "Joined" };
  }
  const rounded = Math.max(1, Math.floor(years));
  return { value: String(rounded), unit: rounded === 1 ? "year" : "years", label: "Joined" };
};

const formatRelativeActive = (date) => {
  if (!date) return "No data";
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
};

const formatResponseTime = (avgMs) => {
  if (avgMs == null || Number.isNaN(avgMs)) return "No data";
  const mins = Math.round(avgMs / 60000);
  if (mins < 1) return "Under 1 minute";
  if (mins < 60) return `${mins} Minute${mins === 1 ? "" : "s"}`;
  const hours = Math.round(mins / 60);
  return `${hours} Hour${hours === 1 ? "" : "s"}`;
};

async function buildVendorStats(vendorId, products) {
  const categoryCounts = {};
  for (const product of products) {
    const cat = String(product.category || "").trim();
    if (!cat) continue;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }
  const mainCategory =
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "No data";

  const avgRating =
    products.length > 0
      ? products.reduce((sum, p) => sum + Number(p.rating || 0), 0) / products.length
      : 0;
  const reviewCount = products.reduce((sum, p) => sum + Number(p.ratingCount || 0), 0);

  // Shipped on time: delivered / (delivered + cancelled late-ish). Fallback: delivered / completed set.
  const orders = await Order.find({ vendor: vendorId })
    .select("status statusHistory createdAt updatedAt")
    .lean();

  let shippedOnTimePercent = null;
  if (orders.length > 0) {
    let onTime = 0;
    let considered = 0;
    for (const order of orders) {
      const status = String(order.status || "").toLowerCase();
      const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
      const placedAt = history.find((h) => /placed|pending/i.test(h.status))?.at || order.createdAt;
      const shippedAt = history.find((h) => /shipped|delivered/i.test(h.status))?.at;
      const cancelled = /cancel/i.test(status);

      if (cancelled) {
        considered += 1;
        continue;
      }
      if (shippedAt || /shipped|delivered/i.test(status)) {
        considered += 1;
        const shipTime = shippedAt ? new Date(shippedAt).getTime() : new Date(order.updatedAt).getTime();
        const start = placedAt ? new Date(placedAt).getTime() : new Date(order.createdAt).getTime();
        const within7Days = shipTime - start <= 7 * 24 * 60 * 60 * 1000;
        if (within7Days) onTime += 1;
      }
    }
    if (considered > 0) {
      shippedOnTimePercent = Math.round((onTime / considered) * 100);
    }
  }

  // Chat response metrics
  const messages = await ChatMessage.find({
    $or: [{ toVendor: vendorId }, { fromVendor: vendorId }],
  })
    .sort({ createdAt: 1 })
    .select("fromUser fromVendor toVendor toUser createdAt")
    .lean();

  const inbound = messages.filter((m) => !m.fromVendor && String(m.toVendor) === String(vendorId));
  const outbound = messages.filter((m) => String(m.fromVendor) === String(vendorId));

  let replied = 0;
  const responseTimes = [];
  for (const incoming of inbound) {
    const reply = outbound.find(
      (out) =>
        String(out.toUser) === String(incoming.fromUser) &&
        new Date(out.createdAt).getTime() >= new Date(incoming.createdAt).getTime()
    );
    if (reply) {
      replied += 1;
      responseTimes.push(new Date(reply.createdAt).getTime() - new Date(incoming.createdAt).getTime());
    }
  }

  const chatResponseRate =
    inbound.length > 0 ? Math.round((replied / inbound.length) * 100) : null;
  const avgResponseMs =
    responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : null;

  const lastVendorChat = outbound.length ? outbound[outbound.length - 1].createdAt : null;
  const lastProductUpdate = products.reduce((latest, p) => {
    const t = p.updatedAt || p.createdAt;
    if (!t) return latest;
    if (!latest || new Date(t) > new Date(latest)) return t;
    return latest;
  }, null);
  const lastOrderTouch = orders.reduce((latest, o) => {
    const t = o.updatedAt || o.createdAt;
    if (!t) return latest;
    if (!latest || new Date(t) > new Date(latest)) return t;
    return latest;
  }, null);

  const lastActiveAt = [lastVendorChat, lastProductUpdate, lastOrderTouch, null]
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a))[0] || null;

  return {
    mainCategory,
    productCount: products.length,
    avgRating: Number(avgRating.toFixed(1)),
    reviewCount,
    shippedOnTimePercent,
    chatResponseRate,
    chatResponseTime: formatResponseTime(avgResponseMs),
    lastActiveAt,
    lastActiveLabel: formatRelativeActive(lastActiveAt),
  };
}

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({
      isApproved: true,
      accountStatus: { $in: ["approved", null] },
    })
      .sort({ followersCount: -1, createdAt: -1 })
      .limit(20);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id).select(
      "storeName email description phone address profileImage isApproved accountStatus followersCount createdAt updatedAt"
    );
    if (!vendor || !isApprovedVendor(vendor)) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const products = await Product.find({ vendor: id })
      .select("category rating ratingCount updatedAt createdAt")
      .lean();

    const stats = await buildVendorStats(id, products);
    const joined = formatJoinedYears(vendor.createdAt);

    res.json({
      vendor: {
        _id: vendor._id,
        storeName: vendor.storeName,
        email: vendor.email,
        description: vendor.description,
        phone: vendor.phone,
        address: vendor.address,
        profileImage: vendor.profileImage,
        isApproved: vendor.isApproved,
        followersCount: Number(vendor.followersCount || 0),
        createdAt: vendor.createdAt,
      },
      stats: {
        ...stats,
        joined,
        followersCount: Number(vendor.followersCount || 0),
      },
    });
  } catch (error) {
    console.error("getVendorById error:", error);
    res.status(500).json({ message: "Failed to fetch vendor" });
  }
};

export const getVendorProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id).select("isApproved accountStatus");
    if (!vendor || !isApprovedVendor(vendor)) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const limit = Math.min(Number(req.query.limit) || 100, 200);
    const category = req.query.category;

    const filter = { vendor: id };
    if (category && category !== "All") {
      filter.category = { $regex: `^${category}$`, $options: "i" };
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("vendor", "storeName profileImage isApproved");

    res.json(products);
  } catch (error) {
    console.error("getVendorProducts error:", error);
    res.status(500).json({ message: "Failed to fetch vendor products" });
  }
};

export const getVendorFollowStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id).select("followersCount isApproved accountStatus");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    if (!isApprovedVendor(vendor)) {
      return res.status(404).json({ message: "Vendor not available" });
    }

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

    if (!isApprovedVendor(vendor)) {
      return res.status(400).json({ message: "Vendor cannot be followed right now" });
    }

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
