import { useEffect, useState } from "react";
import ProductGrid from "../components/product/ProductGrid";
import { fetchProducts } from "../api/productApi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState({
    brand: false,
    service: false,
    shippedFrom: false,
    price: false,
    rating: false,
    warranty: false,
    delivery: false,
    color: false,
  });

  // ✅ FILTER STATE
  const [filters, setFilters] = useState({
    brand: [],
    shippedFrom: [],
    rating: null,
    price: { min: "", max: "" },
  });

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const toggleFilter = (filter) => {
    setFiltersOpen((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  // ✅ HANDLERS
  const handleCheckbox = (type, value) => {
    setFilters((prev) => {
      const exists = prev[type].includes(value);
      return {
        ...prev,
        [type]: exists
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value],
      };
    });
  };

  const handlePriceChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      price: { ...prev.price, [field]: value },
    }));
  };

  const handleRatingChange = (value) => {
    setFilters((prev) => ({ ...prev, rating: value }));
  };

  const removeFilter = (type, value = null) => {
    setFilters((prev) => {
      if (type === "price") return { ...prev, price: { min: "", max: "" } };
      if (type === "rating") return { ...prev, rating: null };
      return {
        ...prev,
        [type]: prev[type].filter((v) => v !== value),
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      brand: [],
      shippedFrom: [],
      rating: null,
      price: { min: "", max: "" },
    });
  };

  // ✅ FILTER LOGIC
  const filteredProducts = products.filter((p) => {
    if (filters.brand.length && !filters.brand.includes(p.brand)) return false;
    if (
      filters.shippedFrom.length &&
      !filters.shippedFrom.includes(p.shippedFrom)
    )
      return false;
    if (filters.rating && p.rating < filters.rating) return false;
    if (filters.price.min && p.price < filters.price.min) return false;
    if (filters.price.max && p.price > filters.price.max) return false;
    return true;
  });
    
  return (
    <div className="min-h-screen bg-[var(--bg-main)] mt-10 px-3 pb-10  md:px-4">
      <div className="mx-auto max-w-7xl space-y-4">

        {/* Header */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4 shadow-[0_16px_40px_-28px_var(--shadow)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                Marketplace Catalog
              </p>
              <h1
                className="mt-1 text-2xl font-extrabold text-[var(--text-primary)] md:text-3xl"
                style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
              >
                Explore Products
              </h1>
              <p className="mt-1 text-xs text-[var(--text-secondary)] md:text-sm">
                Filter by brand, location, rating, and budget to find your perfect match.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text-secondary)]">
              {filteredProducts.length} items available
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">

          {/* Sidebar */}
          <aside className="w-full flex-shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 lg:sticky lg:top-24 lg:w-56 lg:self-start">
            <h2
              className="mb-3 text-[15px] font-extrabold text-[var(--text-primary)]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Filters
            </h2>

            {/* Brand */}
            <div className="mb-2 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-main)]">
              <div onClick={() => toggleFilter("brand")} className="flex cursor-pointer items-center justify-between px-3 py-2.5">
                <span className="text-[13px] font-bold text-[var(--text-primary)]">Brand</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-md text-[13px] font-bold text-[var(--color-primary)]"
                  style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  {filtersOpen.brand ? "−" : "+"}
                </span>
              </div>
              {filtersOpen.brand && (
                <div className="border-t border-[var(--border)] px-3 py-2.5 flex flex-col gap-2">
                  {["Brand A", "Brand B", "Brand C", "Brand D"].map((b) => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brand.includes(b)}
                        onChange={() => handleCheckbox("brand", b)}
                        className="h-3.5 w-3.5 accent-[var(--color-primary)]"
                      />
                      <span className="text-xs text-[var(--text-secondary)]">{b}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Shipped From */}
            <div className="mb-2 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-main)]">
              <div onClick={() => toggleFilter("shippedFrom")} className="flex cursor-pointer items-center justify-between px-3 py-2.5">
                <span className="text-[13px] font-bold text-[var(--text-primary)]">Shipped From</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-md text-[13px] font-bold text-[var(--color-primary)]"
                  style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  {filtersOpen.shippedFrom ? "−" : "+"}
                </span>
              </div>
              {filtersOpen.shippedFrom && (
                <div className="border-t border-[var(--border)] px-3 py-2.5 flex flex-col gap-2">
                  {["Colombo", "Kandy", "Galle"].map((loc) => (
                    <label key={loc} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.shippedFrom.includes(loc)}
                        onChange={() => handleCheckbox("shippedFrom", loc)}
                        className="h-3.5 w-3.5 accent-[var(--color-primary)]"
                      />
                      <span className="text-xs text-[var(--text-secondary)]">{loc}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="mb-2 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-main)]">
              <div onClick={() => toggleFilter("price")} className="flex cursor-pointer items-center justify-between px-3 py-2.5">
                <span className="text-[13px] font-bold text-[var(--text-primary)]">Price</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-md text-[13px] font-bold text-[var(--color-primary)]"
                  style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  {filtersOpen.price ? "−" : "+"}
                </span>
              </div>
              {filtersOpen.price && (
                <div className="border-t border-[var(--border)] px-3 py-2.5 flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.price.min}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                    className="w-1/2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-2 py-1.5 text-xs outline-none focus:border-[var(--color-primary)]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.price.max}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                    className="w-1/2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-2 py-1.5 text-xs outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-main)]">
              <div onClick={() => toggleFilter("rating")} className="flex cursor-pointer items-center justify-between px-3 py-2.5">
                <span className="text-[13px] font-bold text-[var(--text-primary)]">Rating</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-md text-[13px] font-bold text-[var(--color-primary)]"
                  style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  {filtersOpen.rating ? "−" : "+"}
                </span>
              </div>
              {filtersOpen.rating && (
                <div className="border-t border-[var(--border)] px-3 py-2.5 flex flex-col gap-2">
                  {[4, 3, 2, 1].map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === r}
                        onChange={() => handleRatingChange(r)}
                        className="h-3.5 w-3.5 accent-[var(--color-primary)]"
                      />
                      <span className="text-xs text-[var(--text-secondary)]">{r} & Up</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 flex flex-col gap-3">
            {(filters.brand.length || filters.shippedFrom.length || filters.rating || filters.price.min || filters.price.max) && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3 flex flex-wrap items-center gap-2">
                {/* unchanged */}
              </div>
            )}

            <ProductGrid products={filteredProducts} />
          </main>
        </div>
      </div>
    </div>
  );
}