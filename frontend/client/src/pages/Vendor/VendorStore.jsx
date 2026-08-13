import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  FolderOpen,
  MapPin,
  MessageCircle,
  Package,
  Plus,
  Star,
  Store,
  Truck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  fetchVendorById,
  fetchVendorFollowStatus,
  fetchVendorProducts,
  fetchVendorReviewEligibility,
  fetchVendorReviews,
  followVendorApi,
  postVendorReview,
  unfollowVendorApi,
} from "../../api/vendorApi";
import ProductCard from "../../components/sections/product/ProductCard";

const FONT_STYLE = `
  .shopzo-root { font-family: 'DM Sans', sans-serif; }
  .shopzo-root .display-font { font-family: 'Playfair Display', serif; }
`;

if (typeof document !== "undefined" && !document.getElementById("shopzo-fonts")) {
  const link = document.createElement("link");
  link.id = "shopzo-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap";
  document.head.appendChild(link);
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[0_12px_28px_-24px_var(--shadow)]">
      <div className="mb-3 flex items-center gap-2 text-[var(--text-secondary)]">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--bg-muted)] text-[var(--color-primary)]">
          <Icon size={16} />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
      {sub ? <p className="mt-1 text-xs text-[var(--text-secondary)]">{sub}</p> : null}
    </div>
  );
}

export default function VendorStorePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") === "profile" ? "profile" : "products";

  const [activeTab, setActiveTab] = useState(tabParam);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vendor, setVendor] = useState(null);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [followed, setFollowed] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [shopRating, setShopRating] = useState(0);
  const [shopRatingCount, setShopRatingCount] = useState(0);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [canRateShop, setCanRateShop] = useState(false);
  const [vendorReviews, setVendorReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5 });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [profile, vendorProducts] = await Promise.all([
          fetchVendorById(id),
          fetchVendorProducts(id, { limit: 100 }),
        ]);
        if (cancelled) return;
        setVendor(profile.vendor);
        setStats(profile.stats);
        setFollowersCount(Number(profile.stats?.followersCount || profile.vendor?.followersCount || 0));
        setShopRating(Number(profile.stats?.shopRating ?? profile.vendor?.rating ?? 0));
        setShopRatingCount(
          Number(profile.stats?.shopRatingCount ?? profile.vendor?.ratingCount ?? 0)
        );
        setProducts(Array.isArray(vendorProducts) ? vendorProducts : []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load vendor");
          setVendor(null);
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id || !localStorage.getItem("token")) return;
    fetchVendorFollowStatus(id)
      .then((data) => {
        setFollowed(Boolean(data.followed));
        if (typeof data.followersCount === "number") setFollowersCount(data.followersCount);
      })
      .catch(() => {});
  }, [id]);

  const categories = useMemo(() => {
    const list = products.map((p) => p.category).filter(Boolean);
    return Array.from(new Set(list));
  }, [products]);

  const visibleProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === "profile" ? { tab: "profile" } : {});
  };

  const handleFollowToggle = async () => {
    if (!id) return;
    if (!localStorage.getItem("token")) {
      toast.error("Please login to follow vendors");
      navigate("/auth");
      return;
    }
    setFollowLoading(true);
    try {
      const data = followed ? await unfollowVendorApi(id) : await followVendorApi(id);
      setFollowed(Boolean(data.followed));
      if (typeof data.followersCount === "number") setFollowersCount(data.followersCount);
      toast.success(data.followed ? "Following seller" : "Unfollowed seller");
    } catch (err) {
      toast.error(err.message || "Failed to update follow");
    } finally {
      setFollowLoading(false);
    }
  };

  const openRatingModal = async () => {
    if (!id) return;
    setIsRatingModalOpen(true);
    setReviewForm({ rating: 5 });

    try {
      const reviewsData = await fetchVendorReviews(id);
      setVendorReviews(Array.isArray(reviewsData?.reviews) ? reviewsData.reviews : []);
      if (typeof reviewsData?.rating === "number") setShopRating(reviewsData.rating);
      if (typeof reviewsData?.ratingCount === "number") setShopRatingCount(reviewsData.ratingCount);
    } catch {
      setVendorReviews([]);
    }

    if (!localStorage.getItem("token")) {
      setCanRateShop(false);
      return;
    }

    try {
      const eligibility = await fetchVendorReviewEligibility(id);
      setCanRateShop(Boolean(eligibility?.canReview));
    } catch {
      setCanRateShop(false);
    }
  };

  const closeRatingModal = () => {
    if (isSubmittingReview) return;
    setIsRatingModalOpen(false);
  };

  const handleSubmitShopReview = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      toast.error("Please login to rate this shop");
      navigate("/auth");
      return;
    }
    if (!canRateShop) {
      toast.error("Only customers who purchased from this seller can rate the shop");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const data = await postVendorReview(id, { rating: reviewForm.rating });
      if (typeof data?.rating === "number") setShopRating(data.rating);
      if (typeof data?.ratingCount === "number") setShopRatingCount(data.ratingCount);
      if (data?.review) {
        setVendorReviews((prev) => {
          const withoutMine = prev.filter(
            (r) => String(r.user?._id || r.user) !== String(data.review.user?._id || data.review.user)
          );
          return [data.review, ...withoutMine];
        });
      }
      setReviewForm({ rating: 5 });
      toast.success("Shop rating submitted");
    } catch (err) {
      toast.error(err.message || "Failed to submit rating");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="shopzo-root flex min-h-[60vh] items-center justify-center bg-[var(--bg-main)]">
        <style>{FONT_STYLE}</style>
        <p className="text-sm text-[var(--text-secondary)]">Loading store...</p>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="shopzo-root flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[var(--bg-main)] px-4">
        <style>{FONT_STYLE}</style>
        <p className="text-sm text-red-500">{error || "Vendor not found"}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium"
        >
          Go back
        </button>
      </div>
    );
  }

  const storeName = vendor.storeName || "Vendor";
  const avatar =
    vendor.profileImage ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(storeName)}&backgroundColor=f97316&textColor=ffffff`;
  const joinedValue = stats?.joined?.value || "—";
  const joinedUnit = stats?.joined?.unit || "";
  const shipped =
    stats?.shippedOnTimePercent == null ? "No data" : `${stats.shippedOnTimePercent}%`;
  const chatRate =
    stats?.chatResponseRate == null ? "No data" : `${stats.chatResponseRate}%`;

  return (
    <div className="shopzo-root min-h-screen bg-[var(--bg-main)]">
      <style>{FONT_STYLE}</style>

      <div className="relative">
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-sky-400 md:h-44">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.25),transparent_45%)]" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--bg-main)] to-transparent" />
        </div>

        <div className="absolute left-4 top-4 z-20 md:left-6 md:top-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/50"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 pb-12 md:-mt-14">
        <div className="mb-6 flex flex-col gap-5 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_20px_50px_-34px_var(--shadow)] md:flex-row md:items-end md:p-6">
          <img
            src={avatar}
            alt={storeName}
            className="h-24 w-24 rounded-2xl border-4 border-[var(--bg-card)] object-cover shadow-md md:h-28 md:w-28"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="display-font text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
                {storeName}
              </h1>
              {vendor.isApproved && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 text-[11px] font-bold text-[var(--color-primary)]">
                  <BadgeCheck size={12} />
                  Verified
                </span>
              )}
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-1">
                <Users size={14} />
                {followersCount} follower{followersCount === 1 ? "" : "s"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Package size={14} />
                {stats?.productCount ?? products.length} products
              </span>
              <span className="inline-flex items-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                {shopRatingCount > 0 ? shopRating : stats?.avgRating ?? 0}{" "}
                ({shopRatingCount} {shopRatingCount === 1 ? "rating" : "ratings"})
              </span>
            </p>
            {vendor.address && (
              <p className="mt-1 flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <MapPin size={12} />
                {vendor.address}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleFollowToggle}
              disabled={followLoading}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
                followed
                  ? "border-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[0_12px_24px_-14px_var(--shadow)]"
              }`}
            >
              <UserPlus size={16} />
              {followLoading ? "Updating..." : followed ? "Following" : "Follow"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/messages/${id}`)}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--color-primary)]/40"
            >
              <MessageCircle size={16} />
              Chat
            </button>
            <button
              type="button"
              onClick={openRatingModal}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--color-primary)]/40"
            >
              <Plus size={16} />
              Ratings
            </button>
          </div>
        </div>

        <div className="mb-6 inline-flex rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-1.5">
          {[
            { id: "products", label: "Products" },
            { id: "profile", label: "Profile" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => changeTab(tab.id)}
              className={`rounded-xl px-5 py-2 text-sm font-semibold capitalize transition ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                icon={FolderOpen}
                label="Main Category"
                value={stats?.mainCategory || "No data"}
              />
              <StatCard
                icon={Clock}
                label="Joined"
                value={joinedValue}
                sub={joinedUnit ? `+ ${joinedUnit}` : undefined}
              />
              <StatCard icon={Truck} label="Shipped on Time" value={shipped} />
              <StatCard
                icon={MessageCircle}
                label="Chat Response Rate"
                value={chatRate}
                sub={
                  stats?.chatResponseRate == null
                    ? "No data"
                    : `${stats.chatResponseTime} average reply`
                }
              />
              <StatCard
                icon={Clock}
                label="Chat response time"
                value={stats?.chatResponseTime || "No data"}
              />
              <StatCard
                icon={Store}
                label="Active in"
                value={stats?.lastActiveLabel || "No data"}
              />
              <StatCard
                icon={Star}
                label="Shop ratings"
                value={shopRatingCount > 0 ? String(shopRating) : "—"}
                sub={`${shopRatingCount} ${shopRatingCount === 1 ? "rating" : "ratings"}`}
              />
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_12px_28px_-24px_var(--shadow)]">
              <h2 className="mb-3 text-lg font-bold text-[var(--text-primary)]">About this store</h2>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {vendor.description?.trim() || "This seller hasn’t added a store description yet."}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { label: "Store name", value: storeName },
                  { label: "Followers", value: String(followersCount) },
                  { label: "Shop ratings", value: `${shopRating} (${shopRatingCount})` },
                  { label: "Products listed", value: String(stats?.productCount ?? products.length) },
                  {
                    label: "Member since",
                    value: vendor.createdAt
                      ? new Date(vendor.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })
                      : "—",
                  },
                  { label: "Phone", value: vendor.phone || "Not provided" },
                  { label: "Email", value: vendor.email || "Not provided" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                      {row.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white"
                      : "border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--color-primary)]/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {visibleProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] px-6 py-16 text-center">
                <Store className="mx-auto mb-3 text-[var(--text-secondary)]" size={36} />
                <p className="font-semibold text-[var(--text-primary)]">No products yet</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  This seller hasn’t listed products in this category.
                </p>
                <Link
                  to="/products"
                  className="mt-4 inline-flex text-sm font-semibold text-[var(--color-primary)]"
                >
                  Browse all products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isRatingModalOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={closeRatingModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="vendor-rating-modal-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-card)] px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                  Shop rating
                </p>
                <h3
                  id="vendor-rating-modal-title"
                  className="mt-1 text-lg font-bold text-[var(--text-primary)]"
                >
                  Rate {storeName}
                </h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {shopRatingCount > 0
                    ? `${shopRating} / 5 · ${shopRatingCount} ${shopRatingCount === 1 ? "rating" : "ratings"}`
                    : "No ratings yet"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeRatingModal}
                disabled={isSubmittingReview}
                className="rounded-full border border-[var(--border)] p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] disabled:opacity-50"
                aria-label="Close rating modal"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitShopReview} className="space-y-4 border-b border-[var(--border)] px-5 py-5">
              {!localStorage.getItem("token") ? (
                <p className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                  Login to rate this shop.
                </p>
              ) : !canRateShop ? (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  Only customers who purchased from this seller can submit a shop rating.
                </p>
              ) : null}

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Your star rating</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      disabled={!canRateShop || isSubmittingReview}
                      onClick={() => setReviewForm({ rating: stars })}
                      className="rounded-lg p-1 transition hover:bg-[var(--bg-muted)] disabled:opacity-50"
                      aria-label={`${stars} stars`}
                    >
                      <Star
                        className={`h-7 w-7 ${
                          stars <= reviewForm.rating
                            ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </label>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeRatingModal}
                  disabled={isSubmittingReview}
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium disabled:opacity-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={!canRateShop || isSubmittingReview}
                  className="rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit rating"}
                </button>
              </div>
            </form>

            <div className="px-5 py-4">
              <h4 className="mb-3 text-sm font-bold text-[var(--text-primary)]">
                Recent ratings ({vendorReviews.length})
              </h4>
              {vendorReviews.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)]">No shop ratings yet.</p>
              ) : (
                <div className="space-y-2">
                  {vendorReviews.slice(0, 8).map((review) => (
                    <div
                      key={review._id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2.5"
                    >
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {review.user?.name || "Customer"}
                      </p>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            className={
                              s <= Number(review.rating || 0)
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
