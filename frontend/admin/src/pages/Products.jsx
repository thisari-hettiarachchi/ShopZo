import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";

const getProductImage = (product) =>
  product?.images?.[0] ||
  product?.image ||
  product?.thumbnail ||
  "https://via.placeholder.com/300x200?text=No+Image";

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden animate-pulse">
      <div className="h-48 w-full bg-[var(--border)]" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-2/3 rounded bg-[var(--border)]" />
        <div className="h-3 w-1/3 rounded bg-[var(--border)]" />
        <div className="h-3 w-1/4 rounded bg-[var(--border)]" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 w-24 rounded-lg bg-[var(--border)]" />
          <div className="h-8 w-20 rounded-lg bg-[var(--border)]" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (requestError) {
        const message =
          requestError?.response?.data?.message ||
          "Failed to load products from backend";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] px-6 md:px-10 pt-8 pb-16">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-primary)] mb-1">
            Inventory
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        </div>

        <Link
          to="/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90 active:scale-95 transition-all duration-150 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* ── Search bar ── */}
      {!loading && products.length > 0 && (
        <div className="relative mb-6 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition"
          />
        </div>
      )}

      {/* ── Error banner ── */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-400">
          <svg className="mt-0.5 w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)]">
          <svg className="w-10 h-10 text-[var(--text-secondary)] mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 3H8L6 7h12l-2-4z" />
          </svg>
          <p className="text-[var(--text-secondary)] text-sm">
            {search ? "No products match your search." : "No products found. Add your first one!"}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-xs text-[var(--color-primary)] hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-xs text-[var(--text-secondary)] mb-4">
            Showing <span className="font-medium text-[var(--text-primary)]">{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((product) => (
              <article
                key={product._id}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-black/10 transition-all duration-200"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-[var(--bg-main)]">
                  <img
                    src={getProductImage(product)}
                    alt={product.name || "Product image"}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Stock badge */}
                  {typeof product.stock === "number" && (
                    <span
                      className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border ${
                        product.stock === 0
                          ? "bg-red-500/20 border-red-400/30 text-red-400"
                          : product.stock < 10
                          ? "bg-amber-500/20 border-amber-400/30 text-amber-400"
                          : "bg-emerald-500/20 border-emerald-400/30 text-emerald-400"
                      }`}
                    >
                      {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-5">
                  <h2 className="font-semibold text-base leading-snug truncate">
                    {product.name || "Untitled product"}
                  </h2>

                  <p className="mt-2 text-xl font-bold text-[var(--color-primary)]">
                    {typeof product.price === "number"
                      ? `$${product.price.toLocaleString()}`
                      : <span className="text-sm font-normal text-[var(--text-secondary)]">Price unavailable</span>}
                  </p>

                  {/* Divider */}
                  <div className="my-4 border-t border-[var(--border)]" />

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/products/${product._id}`}
                      className="flex-1 text-center text-xs font-medium py-2 px-3 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-primary)]/40 transition-colors duration-150"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/products/edit/${product._id}`}
                      className="flex-1 text-center text-xs font-semibold py-2 px-3 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 active:scale-95 transition-all duration-150"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}