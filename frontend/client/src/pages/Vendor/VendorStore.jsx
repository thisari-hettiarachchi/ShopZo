import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL, authHeaders } from "../../api/base";
import { useNavigate } from "react-router-dom";

const fallbackVendor = {
  storeName: "Vendor",
  description: "No description available yet.",
  email: "",
  phone: "",
  address: "",
  isApproved: false,
  createdAt: null,
};

const StarRating = ({ rating, size = "sm" }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          color: i <= Math.floor(rating) ? "var(--color-highlight)" : "var(--border)",
          fontSize: size === "sm" ? "12px" : "16px",
        }}
      >
        ★
      </span>
    );
  }
  return <span>{stars}</span>;
};

const badgeColors = {
  "Best Seller": { bg: "rgba(249,115,22,0.15)", color: "#f97316", border: "rgba(249,115,22,0.4)" },
  New: { bg: "rgba(34,211,238,0.15)", color: "#22d3ee", border: "rgba(34,211,238,0.4)" },
  Premium: { bg: "rgba(250,204,21,0.15)", color: "#ca8a04", border: "rgba(250,204,21,0.4)" },
  "Eco Pick": { bg: "rgba(34,197,94,0.15)", color: "#16a34a", border: "rgba(34,197,94,0.4)" },
};

const vendorBadgeColors = {
  "Top Seller": { bg: "rgba(249,115,22,0.12)", color: "#f97316" },
  "Fast Shipper": { bg: "rgba(34,211,238,0.12)", color: "#22d3ee" },
  "Eco-Friendly": { bg: "rgba(34,197,94,0.12)", color: "#16a34a" },
};

export default function VendorProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("products");
  const [followed, setFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vendor, setVendor] = useState(fallbackVendor);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const tabs = ["products", "reviews", "about"];

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const loadVendorStore = async () => {
      try {
        setLoading(true);
        setError("");

        const [vendorsRes, productsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/vendors`),
          fetch(`${API_BASE_URL}/products?limit=100`),
        ]);

        if (!vendorsRes.ok || !productsRes.ok) {
          throw new Error("Failed to load vendor store details");
        }

        const [vendorsData, productsData] = await Promise.all([
          vendorsRes.json(),
          productsRes.json(),
        ]);

        const vendorMatch = (Array.isArray(vendorsData) ? vendorsData : []).find(
          (item) => String(item?._id || item?.id) === String(id)
        );

        if (!vendorMatch) {
          throw new Error("Vendor not found");
        }

        const vendorProducts = (Array.isArray(productsData) ? productsData : []).filter((product) => {
          const vendorId =
            typeof product?.vendor === "string"
              ? product.vendor
              : product?.vendor?._id || product?.vendor?.id;
          return String(vendorId) === String(id);
        });

        if (!cancelled) {
          setVendor({ ...fallbackVendor, ...vendorMatch });
          setFollowersCount(Number(vendorMatch?.followersCount || 0));
          setProducts(vendorProducts);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load vendor data");
          setVendor(fallbackVendor);
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadVendorStore();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    const loadFollowStatus = async () => {
      if (!id || !localStorage.getItem("token")) return;

      try {
        const res = await fetch(`${API_BASE_URL}/vendors/${id}/follow-status`, {
          headers: authHeaders(),
        });

        if (!res.ok) return;
        const data = await res.json();
        setFollowed(Boolean(data?.followed));
        if (typeof data?.followersCount === "number") {
          setFollowersCount(data.followersCount);
        }
      } catch {
        // ignore follow status failure
      }
    };

    loadFollowStatus();
  }, [id]);

  const handleFollowToggle = async () => {
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to follow vendors");
      navigate("/auth");
      return;
    }

    setFollowLoading(true);
    try {
      const endpoint = `${API_BASE_URL}/vendors/${id}/follow`;
      const response = await fetch(endpoint, {
        method: followed ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
      });

      const data = response.ok ? await response.json() : null;
      if (!response.ok) throw new Error(data?.message || "Failed to update follow status");

      setFollowed(Boolean(data?.followed));
      if (typeof data?.followersCount === "number") {
        setFollowersCount(data.followersCount);
      }
    } catch (error) {
      alert(error.message || "Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  const averageRating = useMemo(() => {
    if (!products.length) return 0;
    const total = products.reduce((sum, product) => sum + Number(product.rating || 0), 0);
    return total / products.length;
  }, [products]);

  const totalReviews = useMemo(
    () => products.reduce((sum, product) => sum + Number(product.ratingCount || 0), 0),
    [products]
  );

  const categories = useMemo(() => {
    const list = products.map((product) => product.category).filter(Boolean);
    return Array.from(new Set(list));
  }, [products]);

  const visibleProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [products, activeCategory]);

  const vendorData = {
    id: vendor._id,
    name: vendor.storeName || "Vendor",
    handle: `@${String(vendor.storeName || "vendor").toLowerCase().replace(/\s+/g, "")}`,
    avatar:
      vendor.profileImage ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(vendor.storeName || "V")}&backgroundColor=f97316&textColor=ffffff`,
    coverGradient: "linear-gradient(135deg, #f97316 0%, #fb923c 45%, #22d3ee 100%)",
    tagline: vendor.isApproved ? "Approved store on ShopZo" : "Pending store approval",
    description: vendor.description || fallbackVendor.description,
    location: vendor.address || "Location not set",
    joined: vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "-",
    rating: Number(averageRating.toFixed(1)),
    reviewCount: totalReviews,
    verified: Boolean(vendor.isApproved),
    badges: [vendor.isApproved ? "Approved" : "Pending Approval", "Trusted Seller"],
    categories,
    stats: [
      { label: "Products", value: String(products.length) },
      { label: "Rating", value: `${Number(averageRating || 0).toFixed(1)}★` },
      { label: "Reviews", value: String(totalReviews) },
      { label: "Followers", value: String(followersCount) },
    ],
    products: visibleProducts.map((product) => ({
      id: product._id,
      name: product.name,
      price: `LKR ${Number(product.price || 0).toLocaleString()}`,
      originalPrice: product.oldPrice ? `LKR ${Number(product.oldPrice).toLocaleString()}` : "",
      image: product.images?.[0] || "https://placehold.co/600x600?text=Product",
      rating: Number(product.rating || 0),
      sold: Number(product.ratingCount || 0),
      badge: Number(product.discount || 0) > 0 ? `${product.discount}% OFF` : "",
    })),
  };

  if (loading) {
    return <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>Loading vendor store...</div>;
  }

  if (error) {
    return <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", color: "#ef4444" }}>{error}</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-main)",
        color: "var(--text-primary)",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {/* Cover */}
      <div
        style={{
          height: 220,
          background: vendorData.coverGradient,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.15)",
              width: `${120 + i * 80}px`,
              height: `${120 + i * 80}px`,
              right: `-${20 + i * 30}px`,
              top: `-${30 + i * 20}px`,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background: "linear-gradient(to top, var(--bg-main), transparent)",
          }}
        />
      </div>

      {/* Profile Header */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "flex-end",
            marginTop: -56,
            marginBottom: 28,
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 108,
              height: 108,
              borderRadius: 24,
              overflow: "hidden",
              border: "4px solid var(--bg-main)",
              boxShadow: "var(--shadow)",
              flexShrink: 0,
              background: "var(--bg-card)",
            }}
          >
            <img
              src={vendorData.avatar}
              alt={vendorData.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 26,
                  fontWeight: 800,
                  fontFamily: "'Sora', sans-serif",
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                }}
              >
                {vendorData.name}
              </h1>
              {vendorData.verified && (
                <span
                  style={{
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 999,
                    letterSpacing: "0.04em",
                  }}
                >
                  ✓ VERIFIED
                </span>
              )}
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 2 }}>
              {vendorData.handle} · {vendorData.location}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
              {vendorData.badges.map((b) => (
                <span
                  key={b}
                  style={{
                    background: vendorBadgeColors[b]?.bg || "var(--bg-muted)",
                    color: vendorBadgeColors[b]?.color || "var(--text-secondary)",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 999,
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <button
              onClick={handleFollowToggle}
              disabled={followLoading}
              style={{
                padding: "10px 22px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                cursor: followLoading ? "not-allowed" : "pointer",
                border: followed ? "2px solid var(--color-primary)" : "none",
                background: followed
                  ? "transparent"
                  : "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                color: followed ? "var(--color-primary)" : "white",
                boxShadow: followed ? "none" : "0 8px 20px rgba(249,115,22,0.28)",
                opacity: followLoading ? 0.7 : 1,
                transition: "all 0.22s ease",
              }}
            >
              {followLoading ? "Updating..." : followed ? "✓ Following" : "+ Follow"}
            </button>
            <button
              onClick={() => navigate(`/messages/${vendorData.id}`)}
              style={{
                padding: "10px 18px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text-secondary)",
              }}
            >
              💬 Message
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 28,
          }}
        >
          {vendorData.stats.map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "16px 14px",
                textAlign: "center",
                boxShadow: "var(--shadow)",
                backdropFilter: "blur(14px)",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  fontFamily: "'Sora', sans-serif",
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 24,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 5,
            width: "fit-content",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "9px 22px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                border: "none",
                textTransform: "capitalize",
                background:
                  activeTab === tab
                    ? "linear-gradient(90deg, var(--color-primary), var(--color-secondary))"
                    : "transparent",
                color: activeTab === tab ? "white" : "var(--text-muted)",
                boxShadow: activeTab === tab ? "0 4px 14px rgba(249,115,22,0.25)" : "none",
                transition: "all 0.22s ease",
              }}
            >
              {tab === "products" ? "🛍 Products" : tab === "reviews" ? "⭐ Reviews" : "ℹ About"}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <>
            {/* Category filter */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
              {["All", ...vendorData.categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: activeCategory === cat ? "none" : "1px solid var(--border)",
                    background:
                      activeCategory === cat
                        ? "linear-gradient(90deg, var(--color-primary), var(--color-secondary))"
                        : "var(--bg-card)",
                    color: activeCategory === cat ? "white" : "var(--text-secondary)",
                    boxShadow:
                      activeCategory === cat ? "0 4px 12px rgba(249,115,22,0.22)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 18,
                marginBottom: 40,
              }}
            >
              {vendorData.products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 18,
                    overflow: "hidden",
                    boxShadow: "var(--shadow)",
                    backdropFilter: "blur(14px)",
                    cursor: "pointer",
                    transition: "transform 0.22s ease, box-shadow 0.22s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 20px 50px rgba(15,23,42,0.14)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "var(--shadow)";
                  }}
                >
                  <div style={{ position: "relative", height: 180 }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {p.badge && (
                      <span
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          background: badgeColors[p.badge]?.bg || "var(--bg-muted)",
                          color: badgeColors[p.badge]?.color || "var(--text-secondary)",
                          border: `1px solid ${badgeColors[p.badge]?.border || "var(--border)"}`,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "3px 9px",
                          borderRadius: 999,
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {p.badge}
                      </span>
                    )}
                    <button
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        border: "1px solid var(--border)",
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(8px)",
                        cursor: "pointer",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ♡
                    </button>
                  </div>
                  <div style={{ padding: "14px 14px 16px" }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: "var(--text-primary)",
                        marginBottom: 4,
                        lineHeight: 1.3,
                      }}
                    >
                      {p.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                      <StarRating rating={p.rating} />
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        ({p.sold} sold)
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: 16,
                          fontFamily: "'Sora', sans-serif",
                          background:
                            "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {p.price}
                      </span>
                      {p.originalPrice && (
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            textDecoration: "line-through",
                          }}
                        >
                          {p.originalPrice}
                        </span>
                      )}
                    </div>
                    <button
                      style={{
                        width: "100%",
                        marginTop: 10,
                        padding: "8px 0",
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        border: "none",
                        background:
                          "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                        color: "white",
                        boxShadow: "0 4px 14px rgba(249,115,22,0.22)",
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div style={{ marginBottom: 40 }}>
            {/* Summary */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                padding: 24,
                display: "flex",
                gap: 32,
                alignItems: "center",
                marginBottom: 24,
                boxShadow: "var(--shadow)",
                flexWrap: "wrap",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 52,
                    fontWeight: 800,
                    fontFamily: "'Sora', sans-serif",
                    background:
                      "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1,
                  }}
                >
                  {vendorData.rating}
                </div>
                <StarRating rating={vendorData.rating} size="lg" />
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                  {vendorData.reviewCount.toLocaleString()} reviews
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 7 : star === 2 ? 2 : 1;
                  return (
                    <div
                      key={star}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontSize: 12, color: "var(--text-muted)", width: 16 }}>
                        {star}★
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 7,
                          borderRadius: 999,
                          background: "var(--bg-muted)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            background:
                              "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                            borderRadius: 999,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 12, color: "var(--text-muted)", width: 30 }}>
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review cards */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 18,
                padding: 20,
                marginBottom: 14,
                boxShadow: "var(--shadow)",
                backdropFilter: "blur(14px)",
              }}
            >
              <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Review details are not available on this public endpoint yet. Rating summary above is calculated from vendor products.
              </p>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div style={{ marginBottom: 40 }}>
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                padding: 28,
                boxShadow: "var(--shadow)",
                marginBottom: 18,
              }}
            >
              <h2
                style={{
                  margin: "0 0 12px",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                About this store
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
                {vendorData.description}
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              {[
                { icon: "📍", label: "Address", value: vendor.address || "Not provided" },
                { icon: "🗓", label: "Member since", value: vendorData.joined },
                { icon: "📞", label: "Phone", value: vendor.phone || "Not provided" },
                { icon: "✉", label: "Email", value: vendor.email || "Not provided" },
                { icon: "✅", label: "Approval", value: vendor.isApproved ? "Approved" : "Pending Approval" },
                { icon: "⭐", label: "Average rating", value: `${vendorData.rating} / 5.0` },
              ].map((info) => (
                <div
                  key={info.label}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                    padding: "18px 20px",
                    boxShadow: "var(--shadow)",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: 26 }}>{info.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
                      {info.label}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
                      {info.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}