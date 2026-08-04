import mongoose from "mongoose";

// Reads/writes the same "reviews" collection owned by backend/client and
// backend/vendor. `strict: false` avoids duplicating every field here.
const reviewSchema = new mongoose.Schema({}, { strict: false, collection: "reviews" });

const Review = mongoose.models.AdminReview || mongoose.model("AdminReview", reviewSchema);

export default Review;
