import Commission from "../models/Commission.js";
import Order from "../models/Order.js";
import Vendor from "../models/Vendor.js";

export const COMMISSION_RATE = 0.02;
const DUE_DAYS = 14;

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const isOrderVoided = (order) =>
  order.status === "Cancelled" ||
  order.status === "Refunded" ||
  order.paymentStatus === "refunded";

const isOrderSettled = (order) =>
  order.paymentStatus === "paid" ||
  (order.paymentMethod !== "stripe" && order.status === "Delivered");

const getSettledAt = (order) => {
  const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
  const delivered = history.find((entry) => entry.status === "Delivered")?.at;
  if (delivered) return new Date(delivered);
  return new Date(order.updatedAt || order.createdAt || Date.now());
};

const resolveStatus = (commission, now = new Date()) => {
  if (commission.status === "paid" || commission.status === "waived") {
    return commission.status;
  }
  if (commission.dueDate && new Date(commission.dueDate) < now) {
    return "overdue";
  }
  return "unpaid";
};

/** Create missing commission rows for settled orders (2% platform fee). */
export const syncCommissionsFromOrders = async () => {
  const orders = await Order.find({})
    .select("vendor total status paymentStatus paymentMethod statusHistory createdAt updatedAt")
    .lean();

  const existing = await Commission.find({}).select("order").lean();
  const existingOrderIds = new Set(existing.map((item) => String(item.order)));

  const toInsert = [];

  for (const order of orders) {
    if (!order.vendor || existingOrderIds.has(String(order._id))) continue;
    if (isOrderVoided(order) || !isOrderSettled(order)) continue;

    const orderTotal = toNumber(order.total);
    const settledAt = getSettledAt(order);
    const dueDate = new Date(settledAt);
    dueDate.setDate(dueDate.getDate() + DUE_DAYS);

    toInsert.push({
      vendor: order.vendor,
      order: order._id,
      orderTotal,
      commissionRate: COMMISSION_RATE,
      commissionAmount: Number((orderTotal * COMMISSION_RATE).toFixed(2)),
      status: "unpaid",
      settledAt,
      dueDate,
    });
  }

  if (toInsert.length > 0) {
    await Commission.insertMany(toInsert, { ordered: false }).catch(() => {});
  }

  // Void commissions for cancelled/refunded orders that were previously tracked.
  const voidedOrderIds = orders.filter(isOrderVoided).map((order) => order._id);
  if (voidedOrderIds.length > 0) {
    await Commission.deleteMany({
      order: { $in: voidedOrderIds },
      status: { $ne: "paid" },
    });
  }
};

export const getCommissions = async (_req, res) => {
  try {
    await syncCommissionsFromOrders();

    const commissions = await Commission.find({})
      .sort({ dueDate: 1, createdAt: -1 })
      .populate("vendor", "storeName name email")
      .populate("order", "status paymentMethod paymentStatus createdAt")
      .lean();

    const now = new Date();
    const rows = commissions.map((item) => ({
      ...item,
      displayStatus: resolveStatus(item, now),
    }));

    const vendorMap = new Map();

    for (const row of rows) {
      const vendorId = String(row.vendor?._id || row.vendor || "unknown");
      if (!vendorMap.has(vendorId)) {
        vendorMap.set(vendorId, {
          vendorId,
          storeName: row.vendor?.storeName || row.vendor?.name || "Vendor",
          email: row.vendor?.email || "",
          orderCount: 0,
          grossSales: 0,
          commissionDue: 0,
          commissionPaid: 0,
          unpaidAmount: 0,
          overdueAmount: 0,
          unpaidCount: 0,
          overdueCount: 0,
          paidCount: 0,
        });
      }

      const summary = vendorMap.get(vendorId);
      summary.orderCount += 1;
      summary.grossSales += toNumber(row.orderTotal);
      summary.commissionDue += toNumber(row.commissionAmount);

      if (row.displayStatus === "paid" || row.status === "waived") {
        summary.commissionPaid += toNumber(row.commissionAmount);
        summary.paidCount += 1;
      } else if (row.displayStatus === "overdue") {
        summary.overdueAmount += toNumber(row.commissionAmount);
        summary.unpaidAmount += toNumber(row.commissionAmount);
        summary.overdueCount += 1;
        summary.unpaidCount += 1;
      } else {
        summary.unpaidAmount += toNumber(row.commissionAmount);
        summary.unpaidCount += 1;
      }
    }

    const vendors = Array.from(vendorMap.values())
      .map((item) => ({
        ...item,
        grossSales: Number(item.grossSales.toFixed(2)),
        commissionDue: Number(item.commissionDue.toFixed(2)),
        commissionPaid: Number(item.commissionPaid.toFixed(2)),
        unpaidAmount: Number(item.unpaidAmount.toFixed(2)),
        overdueAmount: Number(item.overdueAmount.toFixed(2)),
        status:
          item.overdueCount > 0
            ? "overdue"
            : item.unpaidCount > 0
              ? "unpaid"
              : "paid",
      }))
      .sort((a, b) => b.overdueAmount - a.overdueAmount || b.unpaidAmount - a.unpaidAmount);

    const unpaidRows = rows.filter((row) => row.displayStatus === "unpaid" || row.displayStatus === "overdue");
    const overdueRows = rows.filter((row) => row.displayStatus === "overdue");
    const paidRows = rows.filter((row) => row.displayStatus === "paid" || row.status === "waived");

    res.json({
      commissionRate: COMMISSION_RATE,
      dueDays: DUE_DAYS,
      stats: {
        totalCommission: Number(rows.reduce((sum, row) => sum + toNumber(row.commissionAmount), 0).toFixed(2)),
        totalCollected: Number(paidRows.reduce((sum, row) => sum + toNumber(row.commissionAmount), 0).toFixed(2)),
        totalUnpaid: Number(unpaidRows.reduce((sum, row) => sum + toNumber(row.commissionAmount), 0).toFixed(2)),
        totalOverdue: Number(overdueRows.reduce((sum, row) => sum + toNumber(row.commissionAmount), 0).toFixed(2)),
        unpaidVendors: vendors.filter((vendor) => vendor.unpaidCount > 0).length,
        overdueVendors: vendors.filter((vendor) => vendor.overdueCount > 0).length,
        recordCount: rows.length,
      },
      vendors,
      commissions: rows,
    });
  } catch (error) {
    console.error("getCommissions error:", error);
    res.status(500).json({ message: error.message || "Failed to load commissions" });
  }
};

export const markCommissionPaid = async (req, res) => {
  try {
    const { note = "" } = req.body || {};
    const commission = await Commission.findById(req.params.id);
    if (!commission) {
      return res.status(404).json({ message: "Commission record not found" });
    }

    commission.status = "paid";
    commission.paidAt = new Date();
    if (note) commission.note = String(note).trim();
    await commission.save();

    const populated = await Commission.findById(commission._id)
      .populate("vendor", "storeName name email")
      .populate("order", "status paymentMethod paymentStatus createdAt");

    res.json({
      message: "Commission marked as paid",
      commission: {
        ...populated.toObject(),
        displayStatus: "paid",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update commission" });
  }
};

export const markVendorCommissionsPaid = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const vendor = await Vendor.findById(vendorId).select("_id storeName");
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const result = await Commission.updateMany(
      { vendor: vendorId, status: "unpaid" },
      {
        $set: {
          status: "paid",
          paidAt: new Date(),
          note: req.body?.note || "Marked paid in bulk",
        },
      }
    );

    res.json({
      message: `Marked ${result.modifiedCount} commission(s) as paid for ${vendor.storeName || "vendor"}`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update vendor commissions" });
  }
};

export const markCommissionUnpaid = async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.id);
    if (!commission) {
      return res.status(404).json({ message: "Commission record not found" });
    }

    commission.status = "unpaid";
    commission.paidAt = null;
    await commission.save();

    const populated = await Commission.findById(commission._id)
      .populate("vendor", "storeName name email")
      .populate("order", "status paymentMethod paymentStatus createdAt");

    const displayStatus = resolveStatus(populated.toObject());

    res.json({
      message: "Commission marked as unpaid",
      commission: { ...populated.toObject(), displayStatus },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update commission" });
  }
};
