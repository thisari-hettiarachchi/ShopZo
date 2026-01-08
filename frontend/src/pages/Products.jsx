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

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const toggleFilter = (filter) => {
    setFiltersOpen((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* FILTER SIDEBAR */}
        <aside className="w-full lg:w-72 flex-shrink-0 bg-[var(--bg-card)] dark:bg-[var(--bg-muted)] rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">Filters</h2>

          {/* Brand Filter */}
          <div className="mb-4">
            <div
              onClick={() => toggleFilter("brand")}
              className="flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold text-[var(--text-primary)]">Brand</span>
              <span>{filtersOpen.brand ? "-" : "+"}</span>
            </div>
            {filtersOpen.brand && (
              <div className="mt-2 flex flex-col space-y-1">
                {["Brand A", "Brand B", "Brand C", "Brand D"].map((b) => (
                  <label key={b} className="flex items-center space-x-2 text-[var(--text-secondary)]">
                    <input type="checkbox" />
                    <span>{b}</span>
                  </label>
                ))}
                <button
                  className="text-[var(--color-primary)] text-sm mt-1"
                  onClick={() => alert("Show more brands")}
                >
                  VIEW MORE
                </button>
              </div>
            )}
          </div>

          {/* Service & Promotion */}
          <div className="mb-4">
            <div
              onClick={() => toggleFilter("service")}
              className="flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold text-[var(--text-primary)]">Service & Promotion</span>
              <span>{filtersOpen.service ? "-" : "+"}</span>
            </div>
            {filtersOpen.service && (
              <div className="mt-2 flex flex-col space-y-1">
                {["Free Shipping", "Discount", "Buy 1 Get 1"].map((s) => (
                  <label key={s} className="flex items-center space-x-2 text-[var(--text-secondary)]">
                    <input type="checkbox" />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Shipped From */}
          <div className="mb-4">
            <div
              onClick={() => toggleFilter("shippedFrom")}
              className="flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold text-[var(--text-primary)]">Shipped From</span>
              <span>{filtersOpen.shippedFrom ? "-" : "+"}</span>
            </div>
            {filtersOpen.shippedFrom && (
              <div className="mt-2 flex flex-col space-y-1">
                {["Colombo", "Kandy", "Galle"].map((loc) => (
                  <label key={loc} className="flex items-center space-x-2 text-[var(--text-secondary)]">
                    <input type="checkbox" />
                    <span>{loc}</span>
                  </label>
                ))}
                <button
                  className="text-[var(--color-primary)] text-sm mt-1"
                  onClick={() => alert("Show more locations")}
                >
                  VIEW MORE
                </button>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            <div
              onClick={() => toggleFilter("price")}
              className="flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold text-[var(--text-primary)]">Price</span>
              <span>{filtersOpen.price ? "-" : "+"}</span>
            </div>
            {filtersOpen.price && (
              <div className="mt-2 flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 p-2 rounded border border-[var(--border)]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 p-2 rounded border border-[var(--border)]"
                />
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="mb-4">
            <div
              onClick={() => toggleFilter("rating")}
              className="flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold text-[var(--text-primary)]">Rating</span>
              <span>{filtersOpen.rating ? "-" : "+"}</span>
            </div>
            {filtersOpen.rating && (
              <div className="mt-2 flex flex-col space-y-1">
                {["4 & Up", "3 & Up", "2 & Up", "1 & Up"].map((r) => (
                  <label key={r} className="flex items-center space-x-2 text-[var(--text-secondary)]">
                    <input type="radio" name="rating" />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Warranty */}
          <div className="mb-4">
            <div
              onClick={() => toggleFilter("warranty")}
              className="flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold text-[var(--text-primary)]">Warranty</span>
              <span>{filtersOpen.warranty ? "-" : "+"}</span>
            </div>
            {filtersOpen.warranty && (
              <div className="mt-2 flex flex-col space-y-1">
                {["Warranty Type", "Warranty Period"].map((w) => (
                  <label key={w} className="flex items-center space-x-2 text-[var(--text-secondary)]">
                    <input type="checkbox" />
                    <span>{w}</span>
                  </label>
                ))}
                <button
                  className="text-[var(--color-primary)] text-sm mt-1"
                  onClick={() => alert("Show less")}
                >
                  VIEW LESS
                </button>
              </div>
            )}
          </div>

          {/* Delivery Option */}
          <div className="mb-4">
            <div
              onClick={() => toggleFilter("delivery")}
              className="flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold text-[var(--text-primary)]">Delivery Option</span>
              <span>{filtersOpen.delivery ? "-" : "+"}</span>
            </div>
            {filtersOpen.delivery && (
              <div className="mt-2 flex flex-col space-y-1">
                {["Standard", "Express"].map((d) => (
                  <label key={d} className="flex items-center space-x-2 text-[var(--text-secondary)]">
                    <input type="checkbox" />
                    <span>{d}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Color Family */}
          <div className="mb-4">
            <div
              onClick={() => toggleFilter("color")}
              className="flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold text-[var(--text-primary)]">Color Family</span>
              <span>{filtersOpen.color ? "-" : "+"}</span>
            </div>
            {filtersOpen.color && (
              <div className="mt-2 flex flex-wrap gap-2">
                {["Red", "Blue", "Green", "Black", "White"].map((c) => (
                  <label
                    key={c}
                    className="w-6 h-6 rounded-full border border-[var(--border)] cursor-pointer"
                    style={{ backgroundColor: c.toLowerCase() }}
                  ></label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Products</h1>
            <span className="text-[var(--text-secondary)]">{products.length} items</span>
          </div>

          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  );
}
