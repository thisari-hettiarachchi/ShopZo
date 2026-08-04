import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import ProductGrid from "../../components/sections/product/ProductGrid";
import { fetchProducts } from "../../api/productApi";
import { fetchCategories } from "../../api/categoryApi";
import { filterBestSellers, filterNewArrivals } from "../../utils/productHelpers";

const LOCATIONS = ["Colombo", "Kandy", "Galle"];
const RATINGS = [4, 3, 2, 1];

if (typeof document !== "undefined" && !document.getElementById("shopzo-fonts")) {
  const link = document.createElement("link");
  link.id = "shopzo-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap";
  document.head.appendChild(link);
}

const FONT_STYLE = `
  .shopzo-root { font-family: 'DM Sans', sans-serif; }
  .shopzo-root .display-font { font-family: 'Playfair Display', serif; }
  .shopzo-root .mono-font { font-family: 'Space Mono', monospace; }
  .shopzo-root .section-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--color-primary);
  }
`;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    shippedFrom: [],
    rating: null,
    price: { min: "", max: "" },
  });
  const categoryScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "latest");
  const searchText = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "";
  const newArrivalsOnly =
    searchParams.get("new") === "1" ||
    searchParams.get("new") === "true" ||
    searchParams.get("filter") === "new";
  const bestSellersOnly =
    searchParams.get("bestsellers") === "1" ||
    searchParams.get("bestsellers") === "true" ||
    searchParams.get("filter") === "bestsellers";

  const updateCategoryScrollState = useCallback(() => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(maxScroll > 4 && el.scrollLeft < maxScroll - 4);
  }, []);

  const scrollCategories = (direction) => {
    const el = categoryScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(el.clientWidth * 0.55, 180), behavior: "smooth" });
  };

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    updateCategoryScrollState();
    const el = categoryScrollRef.current;
    if (!el) return undefined;

    const onScroll = () => updateCategoryScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateCategoryScrollState);

    const observer = new ResizeObserver(updateCategoryScrollState);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateCategoryScrollState);
      observer.disconnect();
    };
  }, [categories, updateCategoryScrollState]);

  useEffect(() => {
    const params = {
      q: searchText,
      category: selectedCategory,
      minPrice: filters.price.min || searchParams.get("minPrice") || "",
      maxPrice: filters.price.max || searchParams.get("maxPrice") || "",
      rating: filters.rating || searchParams.get("rating") || "",
      location: filters.shippedFrom[0] || "",
      sort: sortBy,
    };

    fetchProducts(params).then((data) =>
      setProducts(Array.isArray(data) ? data : [])
    );
  }, [filters, searchText, searchParams, selectedCategory, sortBy]);

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
    setFilters((prev) => ({
      ...prev,
      rating: prev.rating === value ? null : value,
    }));
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
      shippedFrom: [],
      rating: null,
      price: { min: "", max: "" },
    });
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    setSearchParams(next, { replace: true });
  };

  const selectCategory = (name) => {
    const next = new URLSearchParams(searchParams);
    if (!name || name === selectedCategory) {
      next.delete("category");
    } else {
      next.set("category", name);
    }
    setSearchParams(next, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    if (newArrivalsOnly) return filterNewArrivals(products);
    if (bestSellersOnly) return filterBestSellers(products);
    return products;
  }, [products, newArrivalsOnly, bestSellersOnly]);

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    filters.shippedFrom.length > 0 ||
    Boolean(filters.rating) ||
    Boolean(filters.price.min) ||
    Boolean(filters.price.max);

  const pageEyebrow = newArrivalsOnly
    ? "Fresh Drops"
    : bestSellersOnly
      ? "Top Picks"
      : selectedCategory
        ? "Category"
        : searchText
          ? "Search Results"
          : "Marketplace";
  const pageSubtitle = newArrivalsOnly
    ? "Products added in the last 5 days."
    : bestSellersOnly
      ? "Top-rated and most-reviewed products."
      : searchText
        ? `Showing matches for “${searchText}”.`
        : "Browse by category, location, rating, and budget.";

  const titlePrimary = newArrivalsOnly
    ? "New"
    : bestSellersOnly
      ? "Best"
      : selectedCategory
        ? selectedCategory
        : "Explore";
  const titleAccent = newArrivalsOnly
    ? "Arrivals"
    : bestSellersOnly
      ? "Sellers"
      : selectedCategory
        ? ""
        : "Products";

  return (
    <div className="shopzo-root min-h-screen bg-[var(--bg-main)]">
      <style>{FONT_STYLE}</style>

      {/* Header */}
      <div className="relative overflow-hidden px-4 pb-10 pt-16">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--color-primary)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-24 h-80 w-80 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: "var(--color-secondary)" }}
        />

        <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="section-eyebrow mb-3 block">{pageEyebrow}</span>
            <h1 className="display-font text-[2.4rem] font-black leading-[1.0] tracking-tight text-[var(--text-primary)] md:text-[3.6rem] lg:text-[4.4rem]">
              {titlePrimary}
              {titleAccent ? (
                <>
                  {" "}
                  <span className="display-font italic text-[var(--color-primary)]">
                    {titleAccent}
                  </span>
                </>
              ) : null}
            </h1>
            <p className="mt-3 max-w-md text-base font-light text-[var(--text-muted)]">
              {pageSubtitle}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-1 md:items-end">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Available
            </p>
            <p className="display-font text-3xl font-black text-[var(--text-primary)] md:text-4xl">
              {filteredProducts.length}
              <span className="ml-2 text-base font-semibold text-[var(--text-muted)]">
                items
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-4 px-3 pb-10 md:px-4">
        {/* Horizontal filters */}
        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[0_16px_40px_-28px_var(--shadow)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              Categories
            </p>
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-semibold text-[var(--text-secondary)]">
                Sort
              </label>
              <select
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--color-primary)]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Newest</option>
                <option value="popularity">Popular</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="relative flex items-center gap-2">
            <button
              type="button"
              aria-label="Scroll categories left"
              onClick={() => scrollCategories(-1)}
              disabled={!canScrollLeft}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-primary)] transition hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="relative min-w-0 flex-1 overflow-hidden">
              <div
                className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[var(--bg-card)] to-transparent transition-opacity ${
                  canScrollLeft ? "opacity-100" : "opacity-0"
                }`}
              />
              <div
                className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[var(--bg-card)] to-transparent transition-opacity ${
                  canScrollRight ? "opacity-100" : "opacity-0"
                }`}
              />

              <div
                ref={categoryScrollRef}
                className="flex gap-2 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <button
                  type="button"
                  onClick={() => selectCategory("")}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                    !selectedCategory
                      ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[0_10px_20px_-12px_var(--shadow)]"
                      : "border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => {
                  const name = cat.name || cat._id;
                  const active =
                    selectedCategory.toLowerCase() === String(name).toLowerCase();
                  return (
                    <button
                      key={cat._id || name}
                      type="button"
                      onClick={() => selectCategory(name)}
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                        active
                          ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[0_10px_20px_-12px_var(--shadow)]"
                          : "border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              aria-label="Scroll categories right"
              onClick={() => scrollCategories(1)}
              disabled={!canScrollRight}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-primary)] transition hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid gap-3 border-t border-[var(--border)] pt-3 md:grid-cols-3">
            {/* Location */}
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                Shipped From
              </p>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((loc) => {
                  const active = filters.shippedFrom.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => handleCheckbox("shippedFrom", loc)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:border-[var(--color-primary)]/35"
                      }`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                Price Range
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.price.min}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-2.5 py-1.5 text-xs outline-none focus:border-[var(--color-primary)]"
                />
                <span className="text-xs text-[var(--text-muted)]">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.price.max}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-2.5 py-1.5 text-xs outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                Rating
              </p>
              <div className="flex flex-wrap gap-2">
                {RATINGS.map((r) => {
                  const active = filters.rating === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRatingChange(r)}
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:border-[var(--color-primary)]/35"
                      }`}
                    >
                      <Star
                        size={12}
                        className={active ? "fill-[var(--color-primary)]" : ""}
                      />
                      {r}+
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-3">
              {selectedCategory && (
                <FilterChip
                  label={`Category: ${selectedCategory}`}
                  onRemove={() => selectCategory("")}
                />
              )}
              {filters.shippedFrom.map((loc) => (
                <FilterChip
                  key={loc}
                  label={loc}
                  onRemove={() => removeFilter("shippedFrom", loc)}
                />
              ))}
              {(filters.price.min || filters.price.max) && (
                <FilterChip
                  label={`Rs. ${filters.price.min || "0"} – ${filters.price.max || "∞"}`}
                  onRemove={() => removeFilter("price")}
                />
              )}
              {filters.rating && (
                <FilterChip
                  label={`${filters.rating}+ stars`}
                  onRemove={() => removeFilter("rating")}
                />
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-auto text-xs font-bold text-[var(--color-primary)] hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-main)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)]">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="rounded-full p-0.5 text-[var(--text-muted)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--color-primary)]"
      >
        <X size={12} />
      </button>
    </span>
  );
}
