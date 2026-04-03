import Product from "../models/Product.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";

// GET all products
export const getProducts = async (req, res) => {
  try {
    const {
      q,
      minPrice,
      maxPrice,
      rating,
      location,
      category,
      sort = "latest",
      limit = 50,
    } = req.query;

    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (location) {
      filter.shippedFrom = { $regex: location, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    const sortMap = {
      latest: { createdAt: -1 },
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      rating: { rating: -1 },
      popularity: { ratingCount: -1, rating: -1 },
    };

    const products = await Product.find(filter)
      .sort(sortMap[sort] || sortMap.latest)
      .limit(Math.min(Number(limit) || 50, 100))
      .populate("vendor", "storeName description isApproved");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// GET single product
export const getProductById = async (req, res) => {
  const products = await Product.findById(req.params.id).populate("vendor");

  if (!products) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(products);
};

export const getProductSuggestions = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.json([]);

    const products = await Product.find(
      {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
        ],
      },
      { name: 1, category: 1, images: 1, price: 1 }
    )
      .limit(8)
      .sort({ rating: -1, createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch suggestions" });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .sort({ createdAt: -1 })
      .populate("user", "name");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const addProductReview = async (req, res) => {
  try {
    const { rating, title, comment, images = [] } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const purchased = await Order.exists({ user: userId, "products.product": productId });

    const review = await Review.findOneAndUpdate(
      { product: productId, user: userId },
      {
        product: productId,
        user: userId,
        rating: Number(rating),
        title: title || "",
        comment: comment || "",
        images: Array.isArray(images) ? images : [],
        verifiedBuyer: Boolean(purchased),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: "$product", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    if (stats[0]) {
      await Product.findByIdAndUpdate(productId, {
        rating: Number(stats[0].avgRating.toFixed(1)),
        ratingCount: stats[0].count,
      });
    }

    const populated = await review.populate("user", "name");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit review" });
  }
};

export const getFlashSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({
      discount: { $gt: 0 }
    }).limit(10);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch flash sale products" });
  }
};
