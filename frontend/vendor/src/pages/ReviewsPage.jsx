import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getVendorReviewInsights, getVendorReviews } from "../services/featureService";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reviewsRes, insightsRes] = await Promise.all([getVendorReviews(), getVendorReviewInsights()]);
        setReviews(reviewsRes.data || []);
        setInsights(insightsRes.data || null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const trendRows = useMemo(() => insights?.ratingBreakdown?.map((item) => ({ label: `${item.rating}★`, count: item.count })) || [], [insights]);

  return (
    <div className="p-6 md:p-10 bg-[var(--bg-main)] min-h-screen">
      <h2 className="text-3xl font-extrabold text-[var(--color-primary)]">Reviews</h2>
      <p className="mt-1 mb-10 text-sm text-[var(--text-secondary)]">
        Monitor feedback, respond to reviews, and improve customer satisfaction.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Average Rating", value: insights?.averageRating ?? 0 },
          { label: "Total Reviews", value: insights?.totalReviews ?? 0 },
          { label: "Verified Buyer Rate", value: `${insights?.verifiedRate ?? 0}%` },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">{item.label}</p>
            <p className="mt-2 text-3xl font-black text-[var(--text-primary)]">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <h3 className="mb-4 font-semibold text-[var(--text-primary)]">Feedback Analytics</h3>
        {loading ? (
          <p className="text-sm text-[var(--text-secondary)]">Loading insights...</p>
        ) : trendRows.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">No ratings data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trendRows}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                }}
              />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-secondary)]">
            No reviews available yet.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="flex items-start gap-3 p-4 border-b border-[var(--border)] last:border-b-0">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                <span className="text-sm font-medium">{review.rating}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{review.user?.name || "Customer"} • {review.productName || "Product"}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{review.comment || review.title || "No comment provided"}</p>
                {review.verifiedBuyer && (
                  <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
