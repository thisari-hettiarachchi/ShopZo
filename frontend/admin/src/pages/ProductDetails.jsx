import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";

const getProductImage = (product) =>
  product?.images?.[0] ||
  product?.image ||
  product?.thumbnail ||
  "https://via.placeholder.com/640x360?text=No+Image";

const getVendorStoreName = (product) =>
  product?.vendor?.storeName ||
  product?.vendor?.name ||
  product?.vendorName ||
  product?.storeName ||
  product?.store?.name ||
  "Unknown vendor/store";

function SkeletonDetail() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-72 w-full rounded-2xl bg-[var(--border)]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-[var(--border)]" />
        ))}
      </div>
      <div className="h-28 rounded-xl bg-[var(--border)]" />
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] p-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${accent}18` }}
      >
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide font-medium">{label}</p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (requestError) {
        const message =
          requestError?.response?.data?.message || "Failed to load product details";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const stockStatus =
    !product || typeof product.stock !== "number"
      ? null
      : product.stock === 0
      ? { label: "Out of Stock", color: "#f87171", bg: "#f8717118" }
      : product.stock < 10
      ? { label: `Low Stock (${product.stock})`, color: "#fbbf24", bg: "#fbbf2418" }
      : { label: `In Stock (${product.stock})`, color: "#34d399", bg: "#34d39918" };

  return (
    <section className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] px-6 md:px-10 pt-8 pb-16">

      {/* ── Breadcrumb / Back ── */}
      <div className="flex items-center gap-2 mb-6 text-sm text-[var(--text-secondary)]">
        <Link to="/products" className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Products
        </Link>
        <span>/</span>
        <span className="truncate max-w-xs">
          {loading ? "Loading…" : product?.name || "Details"}
        </span>
      </div>

      {/* ── Page heading ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-primary)] mb-1">
            Inventory
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Product Details</h1>
        </div>

        {product && (
          <Link
            to={`/products/edit/${product._id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90 active:scale-95 transition-all duration-150 self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213l-4.5 1.25 1.25-4.5L16.862 3.487z" />
            </svg>
            Edit Product
          </Link>
        )}
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-400">
          <svg className="mt-0.5 w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* ── Main card ── */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        {loading ? (
          <SkeletonDetail />
        ) : !product ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg className="w-10 h-10 text-[var(--text-secondary)] mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 14.828 12 12m0 0 2.828-2.828M12 12 9.172 9.172M12 12l2.828 2.828M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
            </svg>
            <p className="text-[var(--text-secondary)] text-sm">Product not found.</p>
            <Link to="/products" className="mt-3 text-xs text-[var(--color-primary)] hover:underline">
              Back to Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">

            {/* ── Image + stock badge ── */}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]">
              <img
                src={getProductImage(product)}
                alt={product.name || "Product image"}
                className="h-72 w-full object-contain"
              />
              {stockStatus && (
                <span
                  className="absolute top-4 right-4 text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-sm"
                  style={{
                    color: stockStatus.color,
                    background: stockStatus.bg,
                    borderColor: `${stockStatus.color}40`,
                  }}
                >
                  {stockStatus.label}
                </span>
              )}
            </div>

            {/* ── Name + ID ── */}
            <div>
              <h2 className="text-2xl font-bold leading-tight">
                {product.name || "Untitled product"}
              </h2>
              <p className="mt-1 text-xs text-[var(--text-secondary)] font-mono">
                ID: {product._id}
              </p>
            </div>

            {/* ── Stat grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <StatCard
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2A10 10 0 1 1 2 12a10 10 0 0 1 20 0z" />
                  </svg>
                }
                label="Price"
                value={
                  typeof product.price === "number"
                    ? `$${product.price.toLocaleString()}`
                    : "N/A"
                }
                accent="var(--color-primary)"
              />
              <StatCard
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 3H8L6 7h12l-2-4z" />
                  </svg>
                }
                label="Stock"
                value={typeof product.stock === "number" ? product.stock : "N/A"}
                accent={stockStatus?.color || "var(--color-primary)"}
              />
              <StatCard
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
                  </svg>
                }
                label="Vendor / Store"
                value={getVendorStoreName(product)}
                accent="#a78bfa"
              />
              {product.category && (
                <StatCard
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5l8.5 8.5a2.121 2.121 0 0 1 0 3L15 20a2.121 2.121 0 0 1-3 0L3.5 12V7a4 4 0 0 1 4-4z" />
                    </svg>
                  }
                  label="Category"
                  value={product.category}
                  accent="#60a5fa"
                />
              )}
            </div>

            {/* ── Description ── */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] p-5">
              <p className="text-xs font-semibold tracking-widest uppercase text-[var(--text-secondary)] mb-2">
                Description
              </p>
              <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                {product.description || "No description provided for this product."}
              </p>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}