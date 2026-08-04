import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { MessageSquare, Send, Star } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getVendorReviewInsights, getVendorReviews, replyToReview } from "../services/featureService";
import PageHeader from "../components/shared/PageHeader";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyingId, setReplyingId] = useState(null);

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

  const handleReplyChange = (reviewId, value) => {
    setReplyDrafts((prev) => ({ ...prev, [reviewId]: value }));
  };

  const handleSubmitReply = async (reviewId) => {
    const text = (replyDrafts[reviewId] || "").trim();
    if (!text) {
      toast.error("Please write a reply before submitting.");
      return;
    }
    setReplyingId(reviewId);
    try {
      const res = await replyToReview(reviewId, text);
      setReviews((prev) => prev.map((review) => (review._id === reviewId ? { ...review, reply: res.data.reply } : review)));
      setReplyDrafts((prev) => ({ ...prev, [reviewId]: "" }));
      toast.success("Reply posted.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to post reply");
    } finally {
      setReplyingId(null);
    }
  };

  const trendRows = useMemo(() => insights?.ratingBreakdown?.map((item) => ({ label: `${item.rating}★`, count: item.count })) || [], [insights]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Feedback Center"
        title="Reviews"
        description="Monitor feedback, respond to reviews, and improve customer satisfaction."
        meta={`${insights?.totalReviews ?? reviews.length} total reviews`}
      />

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

                {review.reply?.text ? (
                  <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] p-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
                      <MessageSquare size={13} />
                      Your reply
                    </div>
                    <p className="mt-1 text-sm text-[var(--text-primary)]">{review.reply.text}</p>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      value={replyDrafts[review._id] || ""}
                      onChange={(e) => handleReplyChange(review._id, e.target.value)}
                      placeholder="Write a reply to this customer..."
                      className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSubmitReply(review._id)}
                      disabled={replyingId === review._id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                    >
                      <Send size={13} />
                      {replyingId === review._id ? "Sending..." : "Reply"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
}
