import React from "react";
import { Star } from "lucide-react";

const sampleReviews = [
  { id: 1, customer: "Alice", rating: 5, comment: "Excellent product!" },
  { id: 2, customer: "Bob", rating: 4, comment: "Very good, fast delivery." },
  { id: 3, customer: "Charlie", rating: 3, comment: "Average quality." },
  { id: 4, customer: "Diana", rating: 5, comment: "Loved it!" },
];

export default function ReviewsPage({ active }) {
  return (
    <div className="p-6">
      {active === "reviews" && (
        <>
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
            {sampleReviews.map((review) => (
              <div key={review.id} className="flex items-start gap-3 p-4 border-b border-[var(--border)] last:border-b-0">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium">{review.rating}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{review.customer}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
