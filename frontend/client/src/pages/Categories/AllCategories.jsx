import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, SlidersHorizontal, Grid3X3, LayoutList, X } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../../api/categoryApi";

const FILTERS = ["All", "Popular", "Trending", "New"];

/* ─────────────────────────────────────────────
   TAG BADGE
───────────────────────────────────────────── */
const tagStyles = {
  popular:  "bg-orange-500/20 text-orange-400 border-orange-500/30",
  trending: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  new:      "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

function TagBadge({ tag }) {
  if (!tag) return null;
  return (
    <span className={`text-[9px] mono-font tracking-[0.18em] uppercase px-2 py-0.5 rounded-full border ${tagStyles[tag] || ""}`}>
      {tag}
    </span>
  );
}

/* ─────────────────────────────────────────────
   GRID CARD
───────────────────────────────────────────── */
function GridCard({ cat, index }) {
  const categoryValue = encodeURIComponent(cat.name || cat._id || "");
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer border border-[var(--border)] bg-[var(--bg-card)]"
      style={{ minHeight: 220 }}
    >
      <Link to={`/products?category=${categoryValue}`} className="block h-full">
        {/* Background */}
        {cat.image ? (
          <img
            src={cat.image}
            alt={cat.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
        )}

        {/* Hover shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

        {/* Icon */}
        <div className={`absolute top-5 left-5 w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
          {cat.icon}
        </div>

        {/* Tag */}
        <div className="absolute top-5 right-5">
          <TagBadge tag={cat.tag} />
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="display-font text-[var(--text-primary)] font-bold text-lg leading-snug group-hover:text-[var(--color-primary)] transition-colors duration-300">
            {cat.name}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[var(--text-muted)] text-xs">{cat.count}+ items</p>
            <div className="flex items-center gap-1 text-[var(--color-primary)] text-xs font-semibold opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              Shop <ArrowRight size={11} />
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cat.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   LIST ROW
───────────────────────────────────────────── */
function ListRow({ cat, index }) {
  const categoryValue = encodeURIComponent(cat.name || cat._id || "");
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, delay: index * 0.035 }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--color-primary)]/40 transition-colors duration-300"
    >
      <Link to={`/products?category=${categoryValue}`} className="flex items-center gap-5 p-4 h-full">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-2xl shrink-0 shadow-md transition-transform duration-300 group-hover:scale-110`}>
          {cat.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="display-font text-[var(--text-primary)] font-bold text-base group-hover:text-[var(--color-primary)] transition-colors truncate">
              {cat.name}
            </h3>
            <TagBadge tag={cat.tag} />
          </div>
          <p className="text-[var(--text-muted)] text-xs">{cat.count}+ items available</p>
        </div>

        {/* Count pill */}
        <div className="hidden sm:flex items-center shrink-0">
          <span className="mono-font text-xs text-[var(--text-muted)] border border-[var(--border)] px-3 py-1 rounded-full">
            {cat.count}+
          </span>
        </div>

        {/* Arrow */}
        <div className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center shrink-0 group-hover:bg-[var(--color-primary)] group-hover:border-[var(--color-primary)] transition-all duration-300">
          <ArrowRight size={13} className="text-[var(--text-muted)] group-hover:text-white transition-colors duration-300 group-hover:translate-x-0.5" />
        </div>
      </Link>

      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cat.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const DEFAULT_GRADIENTS = [
  "from-blue-500 to-cyan-400",
  "from-pink-500 to-rose-400",
  "from-amber-500 to-orange-400",
  "from-emerald-500 to-teal-400",
  "from-violet-500 to-purple-400",
  "from-lime-500 to-green-400",
];

export default function AllCategoriesPage({ categories: initialCategoriesProp }) {
  const initialCategories = Array.isArray(initialCategoriesProp) ? initialCategoriesProp : [];
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(initialCategories.length === 0);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchCategories();
        if (isMounted) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Could not load categories");
          // Keep UI usable if backend is temporarily unavailable.
          if (initialCategories.length === 0) {
            setCategories(MOCK_CATEGORIES);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedCategories = useMemo(() => {
    return categories.map((cat, index) => ({
      ...cat,
      icon: cat.icon || "🛍️",
      gradient: cat.gradient || DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length],
      tag: cat.tag || "",
      count: Number(cat.count) || 0,
    }));
  }, [categories]);

  const filtered = useMemo(() => {
    return normalizedCategories.filter((cat) => {
      const matchSearch = (cat.name || "").toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        activeFilter === "All" || cat.tag === activeFilter.toLowerCase();
      return matchSearch && matchFilter;
    });
  }, [normalizedCategories, search, activeFilter]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden pt-16 pb-14 px-4">
        {/* decorative blobs */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--color-primary)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-24 w-80 h-80 rounded-full opacity-8 blur-3xl"
          style={{ background: "var(--color-primary)" }}
        />

        <div className="max-w-7xl mx-auto relative">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-eyebrow block mb-3">Explore</span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
            >
              <h1 className="display-font text-[2.4rem] md:text-[3.6rem] lg:text-[4.4rem] font-black text-[var(--text-primary)] leading-[1.0] tracking-tight">
                All{" "}
                <span className="italic text-[var(--color-primary)]">
                  Categories
                </span>
              </h1>
              <p className="mt-3 text-[var(--text-muted)] text-base max-w-md font-light">
                {normalizedCategories.length} categories · {normalizedCategories.reduce((a, c) => a + (c.count || 0), 0).toLocaleString()}+ products
              </p>
            </motion.div>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="relative w-full md:w-72 lg:w-80"
            >
              <Search
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                placeholder="Search categories…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-full pl-10 pr-10 py-3 text-sm outline-none focus:border-[var(--color-primary)]/60 transition-colors duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </motion.div>
          </div>

          {/* ── FILTER + VIEW TOGGLE BAR ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex items-center justify-between gap-4 flex-wrap"
          >
            {/* Filter pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal size={14} className="text-[var(--text-muted)] shrink-0" />
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`mono-font text-[10px] tracking-[0.15em] uppercase px-4 py-1.5 rounded-full border transition-all duration-200 ${
                    activeFilter === f
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                      : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--color-primary)]/50 hover:text-[var(--text-primary)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 border border-[var(--border)] rounded-xl p-1 bg-[var(--bg-card)]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Grid3X3 size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <LayoutList size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="border-t border-[var(--border)]" />

      {/* ── CONTENT AREA ── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Result count */}
        <motion.p
          layout
          className="text-[var(--text-muted)] text-xs mono-font mb-6"
        >
          Showing {filtered.length} of {normalizedCategories.length} categories
          {search && ` for "${search}"`}
        </motion.p>

        {!loading && error && (
          <div className="mb-6 text-sm text-orange-400">{error}</div>
        )}

        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <p className="text-[var(--text-muted)] text-sm">Loading categories...</p>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-28 text-center"
            >
              <span className="text-5xl mb-4">🔍</span>
              <h3 className="display-font text-[var(--text-primary)] text-2xl font-bold mb-2">
                No categories found
              </h3>
              <p className="text-[var(--text-muted)] text-sm">
                Try adjusting your search or filter
              </p>
              <button
                onClick={() => { setSearch(""); setActiveFilter("All"); }}
                className="mt-6 text-sm font-semibold text-[var(--color-primary)] border border-[var(--color-primary)] px-5 py-2 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
              >
                Clear filters
              </button>
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              key="grid"
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {filtered.map((cat, i) => (
                <GridCard key={cat._id} cat={cat} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              layout
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {filtered.map((cat, i) => (
                <ListRow key={cat._id} cat={cat} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}