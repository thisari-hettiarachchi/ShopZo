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
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* FILTER SIDEBAR */}
        <aside className="w-full lg:w-72 flex-shrink-0 bg-[var(--bg-card)] dark:bg-[var(--bg-muted)] rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Filters</h2>

          {/* Brand */}
          <div className="mb-4">
            <div onClick={() => toggleFilter("brand")} className="flex justify-between items-center cursor-pointer">
              <span className="font-semibold">Brand</span>
              <span>{filtersOpen.brand ? "-" : "+"}</span>
            </div>
            {filtersOpen.brand && (
              <div className="mt-2 flex flex-col space-y-1">
                {["Brand A", "Brand B", "Brand C", "Brand D"].map((b) => (
                  <label key={b} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.brand.includes(b)}
                      onChange={() => handleCheckbox("brand", b)}
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Shipped From */}
          <div className="mb-4">
            <div onClick={() => toggleFilter("shippedFrom")} className="flex justify-between items-center cursor-pointer">
              <span className="font-semibold">Shipped From</span>
              <span>{filtersOpen.shippedFrom ? "-" : "+"}</span>
            </div>
            {filtersOpen.shippedFrom && (
              <div className="mt-2 flex flex-col space-y-1">
                {["Colombo", "Kandy", "Galle"].map((loc) => (
                  <label key={loc} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.shippedFrom.includes(loc)}
                      onChange={() => handleCheckbox("shippedFrom", loc)}
                    />
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            <div onClick={() => toggleFilter("price")} className="flex justify-between items-center cursor-pointer">
              <span className="font-semibold">Price</span>
              <span>{filtersOpen.price ? "-" : "+"}</span>
            </div>
            {filtersOpen.price && (
              <div className="mt-2 flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.price.min}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="w-1/2 p-2 rounded border"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.price.max}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="w-1/2 p-2 rounded border"
                />
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="mb-4">
            <div onClick={() => toggleFilter("rating")} className="flex justify-between items-center cursor-pointer">
              <span className="font-semibold">Rating</span>
              <span>{filtersOpen.rating ? "-" : "+"}</span>
            </div>
            {filtersOpen.rating && (
              <div className="mt-2 flex flex-col space-y-1">
                {[4, 3, 2, 1].map((r) => (
                  <label key={r} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === r}
                      onChange={() => handleRatingChange(r)}
                    />
                    <span>{r} & Up</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <main className="flex-1">
          {/* ✅ ACTIVE FILTERS */}
          {(filters.brand.length ||
            filters.shippedFrom.length ||
            filters.rating ||
            filters.price.min ||
            filters.price.max) && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 items-center">
                {filters.brand.map((b) => (
                  <span key={b} className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2">
                    {b}
                    <button onClick={() => removeFilter("brand", b)}>×</button>
                  </span>
                ))}

                {filters.shippedFrom.map((l) => (
                  <span key={l} className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2">
                    {l}
                    <button onClick={() => removeFilter("shippedFrom", l)}>×</button>
                  </span>
                ))}

                {filters.rating && (
                  <span className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2">
                    {filters.rating} & Up
                    <button onClick={() => removeFilter("rating")}>×</button>
                  </span>
                )}

                {(filters.price.min || filters.price.max) && (
                  <span className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2">
                    Rs {filters.price.min || 0} - {filters.price.max || "∞"}
                    <button onClick={() => removeFilter("price")}>×</button>
                  </span>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 underline ml-2"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Products</h1>
            <span>{filteredProducts.length} items</span>
          </div>

          <ProductGrid products={filteredProducts} />
        </main>
      </div>
    </div>
  );
}
