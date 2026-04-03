import Product from "../models/Product.js";
import Review from "../models/Review.js";

export const getVendorReviews = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const vendorProducts = await Product.find({ vendor: vendorId }, { _id: 1, name: 1 }).lean();
    const productIds = vendorProducts.map((product) => product._id);
    const productNameMap = new Map(vendorProducts.map((product) => [String(product._id), product.name]));

    const reviews = await Review.find({ product: { $in: productIds } })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("product", "name images");

    const enriched = reviews.map((review) => ({
      ...review.toObject(),
      productName: review.product?.name || productNameMap.get(String(review.product)) || "Product",
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const getVendorReviewInsights = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const vendorProducts = await Product.find({ vendor: vendorId }, { _id: 1, name: 1 }).lean();
    const productIds = vendorProducts.map((product) => product._id);

    const [overview] = await Review.aggregate([
      { $match: { product: { $in: productIds } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          verifiedCount: { $sum: { $cond: ["$verifiedBuyer", 1, 0] } },
        },
      },
    ]);

    const byRating = await Review.aggregate([
      { $match: { product: { $in: productIds } } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    const byProduct = await Review.aggregate([
      { $match: { product: { $in: productIds } } },
      { $group: { _id: "$product", avgRating: { $avg: "$rating" }, reviews: { $sum: 1 } } },
      { $sort: { reviews: -1 } },
      { $limit: 8 },
    ]);

    const productNameMap = new Map(vendorProducts.map((product) => [String(product._id), product.name]));

    res.json({
      averageRating: Number((overview?.averageRating || 0).toFixed(2)),
      totalReviews: overview?.totalReviews || 0,
      verifiedRate: overview?.totalReviews ? Number(((overview.verifiedCount / overview.totalReviews) * 100).toFixed(1)) : 0,
      ratingBreakdown: [5, 4, 3, 2, 1].map((value) => ({
        rating: value,
        count: byRating.find((item) => item._id === value)?.count || 0,
      })),
      topReviewedProducts: byProduct.map((item) => ({
        productId: item._id,
        name: productNameMap.get(String(item._id)) || "Product",
        avgRating: Number((item.avgRating || 0).toFixed(2)),
        reviews: item.reviews,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch review insights" });
  }
};
