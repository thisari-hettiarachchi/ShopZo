import { Star } from "lucide-react";

export default function ReviewsPage() {
  const reviews = []; // Database model not yet implemented

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>
      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-secondary)]">
            No reviews available yet.
          </div>
        ) : (
          reviews.map((review) => (
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
          ))
        )}
      </div>
    </div>
  );
}
