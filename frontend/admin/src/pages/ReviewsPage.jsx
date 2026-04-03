import { useEffect, useState } from "react";
import { getReviews } from "../services/adminService";

const StarRating = ({ rating }) => {
  const filled = Math.round(Number(rating || 0));
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < filled ? "text-amber-400" : "text-[var(--border)]"}`}
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const SkeletonCard = () => (
  <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 md:flex-row md:items-center md:justify-between animate-pulse">
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 rounded-xl bg-[var(--border)]" />
      <div className="space-y-2">
        <div className="h-4 w-36 rounded bg-[var(--border)]" />
        <div className="h-3 w-28 rounded bg-[var(--border)]" />
        <div className="h-3 w-24 rounded bg-[var(--border)]" />
      </div>
    </div>
    <div className="flex flex-col items-end gap-2">
      <div className="h-6 w-10 rounded bg-[var(--border)]" />
      <div className="h-4 w-20 rounded bg-[var(--border)]" />
    </div>
  </div>
);

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(Array.isArray(data) ? data : []);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  const filtered = reviews.filter((p) =>
    [p.name, p.vendor?.storeName, p.category]
      .filter(Boolean)
      .some((val) => val.toLowerCase().includes(search.toLowerCase()))
  );

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
      : "—";

  return (
    <section className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] px-6 md:px-10 pt-8 pb-12">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-1">
            Admin Panel
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Product Reviews</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Monitor ratings and customer feedback across your catalog.
          </p>
        </div>

        {/* Stats pill */}
        {!loading && !error && reviews.length > 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-3 self-start sm:self-auto">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Products</p>
              <p className="text-xl font-bold text-[var(--color-primary)]">{reviews.length}</p>
            </div>
            <div className="h-8 w-px bg-[var(--border)]" />
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Avg Rating</p>
              <p className="text-xl font-bold">{avgRating}</p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
          </svg>
          {error}
        </div>
      )}

      {/* Search */}
      {!loading && reviews.length > 0 && (
        <div className="mb-5 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by product, vendor, or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition"
          />
        </div>
      )}

      {/* Card container */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <svg className="h-10 w-10 text-[var(--border)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <p className="text-[var(--text-secondary)] text-sm">
              {search ? "No results match your search." : "No rated products found."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((product) => (
              <div
                key={product._id}
                className="group flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] p-4 transition hover:border-[var(--color-primary)]/40 hover:shadow-sm md:flex-row md:items-center md:justify-between"
              >
                {/* Left: image + info */}
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/96x96?text=No+Image"}
                      alt={product.name || "Product"}
                      className="h-16 w-16 rounded-xl object-cover ring-1 ring-[var(--border)]"
                    />
                    {/* Rating badge */}
                    <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-[var(--color-primary)] px-1.5 py-0.5 text-[10px] font-bold text-white leading-none shadow">
                      {Number(product.rating || 0).toFixed(1)}
                    </span>
                  </div>

                  <div>
                    <p className="font-semibold leading-snug">{product.name || "Product"}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {product.vendor?.storeName || "Unknown vendor"}
                      </span>
                      {product.category && (
                        <span className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                          {product.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: stars + score */}
                <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-1">
                  <StarRating rating={product.rating} />
                  <p className="text-xs text-[var(--text-secondary)]">
                    {Number(product.rating || 0).toFixed(1)} / 5.0
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <p className="mt-4 text-right text-xs text-[var(--text-secondary)]">
          Showing {filtered.length} of {reviews.length} product{reviews.length !== 1 ? "s" : ""}
        </p>
      )}
    </section>
  );
}