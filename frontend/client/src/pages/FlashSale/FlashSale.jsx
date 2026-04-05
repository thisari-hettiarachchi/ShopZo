import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, SlidersHorizontal, X, ChevronDown, Zap, Tag, ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../../components/sections/product/ProductCard";
import { API_BASE_URL } from "../../api/base";

/* ─── helpers ─── */
const fmt = (v) => v.toString().padStart(2, "0");
const stagger = (i, base = 0.05) => ({ delay: i * base, duration: 0.38 });

/* ─── Countdown pill ─── */
function Countdown({ timeLeft }) {
  return (
    <div className="flex items-center gap-1 bg-[var(--text-primary)] rounded-2xl px-4 py-2 shadow-lg">
      {[fmt(timeLeft.hours), fmt(timeLeft.minutes), fmt(timeLeft.seconds)].map((val, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="text-base font-black mono-font text-[var(--bg-main)] tabular-nums tracking-tight">
            {val}
          </span>
          {i < 2 && <span className="text-orange-400 font-black text-base">:</span>}
        </span>
      ))}
    </div>
  );
}

/* ─── Sort / Filter bar ─── */
const SORT_OPTIONS = [
  { label: "Best Match", value: "match" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Biggest Discount", value: "discount" },
  { label: "Top Rated", value: "rating" },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Beauty", "Sports", "Toys"];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const label = SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Sort";
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] border border-[var(--border)] rounded-xl px-4 py-2 bg-[var(--bg-card)] hover:border-[var(--color-primary)] transition"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 mt-2 z-50 w-52 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden"
          >
            {SORT_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <button
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-[var(--bg-muted)] ${value === opt.value ? "text-[var(--color-primary)] font-bold" : "text-[var(--text-secondary)]"}`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Page ─── */
export default function FlashSalePage({ products = [], token }) {
  const [searchParams] = useSearchParams();
  const [flashProducts, setFlashProducts] = useState(products);
  const [loading, setLoading] = useState(products.length === 0);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 23, seconds: 59 });
  const [sort, setSort] = useState("match");
  const [activeCategory, setActiveCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  /* countdown */
  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) return { hours, minutes, seconds: seconds - 1 };
        if (minutes > 0) return { hours, minutes: minutes - 1, seconds: 59 };
        return { hours: hours > 0 ? hours - 1 : 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadFlashProducts = async () => {
      if (products.length > 0) {
        setFlashProducts(products);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/products/flash-sale`);
        const data = res.ok ? await res.json() : [];
        if (!cancelled) {
          setFlashProducts(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) {
          setFlashProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFlashProducts();

    return () => {
      cancelled = true;
    };
  }, [products]);

  /* filter + sort */
  const filtered = useMemo(() => {
    let list = flashProducts.filter((p) => p.oldPrice); // only sale items
    if (activeCategory !== "All") list = list.filter((p) => p.category === activeCategory);
    list = list.filter((p) => p.price <= maxPrice);
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "discount") list = [...list].sort((a, b) => (b.oldPrice - b.price) / b.oldPrice - (a.oldPrice - a.price) / a.oldPrice);
    else if (sort === "rating") list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return list;
  }, [flashProducts, sort, activeCategory, maxPrice]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  const topSaving = useMemo(() => {
    if (!filtered.length) return null;
    return [...filtered].sort((a, b) => (b.oldPrice - b.price) - (a.oldPrice - a.price))[0];
  }, [filtered]);

  const totalSavings = useMemo(
    () => filtered.reduce((acc, p) => acc + Math.max((p.oldPrice ?? p.price) - p.price, 0), 0),
    [filtered]
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-[var(--bg-card)] border-b border-[var(--border)]">
        {/* decorative flame blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          {/* back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--color-primary)] transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-6">
            {/* title block */}
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 animate-ping rounded-2xl bg-orange-500/30" />
                <div className="relative bg-gradient-to-br from-orange-500 to-amber-400 p-4 rounded-2xl shadow-xl shadow-orange-500/30">
                  <Flame className="text-white" size={32} />
                </div>
              </div>
              <div>
                <span className="section-eyebrow block mb-1 text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold">
                  Limited Time Only
                </span>
                <h1 className="display-font text-4xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] leading-none tracking-tight">
                  Flash <span className="italic text-[var(--color-primary)]">Sale</span>
                </h1>
                <p className="text-[var(--text-muted)] text-sm mt-1.5">
                  {filtered.length} deals · Ends in&nbsp;
                </p>
              </div>
            </div>

            {/* right block: countdown + stats */}
            <div className="flex flex-col items-end gap-3">
              <Countdown timeLeft={timeLeft} />
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Total Savings</p>
                  <p className="text-lg font-black text-green-500">Rs. {totalSavings.toLocaleString()}</p>
                </div>
                {topSaving && (
                  <div className="text-right border-l border-[var(--border)] pl-4">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Biggest Deal</p>
                    <p className="text-lg font-black text-[var(--color-primary)]">
                      Rs. {(topSaving.oldPrice - topSaving.price).toLocaleString()} off
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* urgency bar */}
          <div className="mt-6 h-1.5 w-full rounded-full bg-[var(--bg-muted)] overflow-hidden">
            <motion.div
              initial={{ width: "75%" }}
              animate={{ width: "30%" }}
              transition={{ duration: timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds, ease: "linear" }}
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
            />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
            <span className="text-orange-500 font-bold">70%</span> of deals already claimed — hurry!
          </p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="sticky top-0 z-40 bg-[var(--bg-card)]/90 backdrop-blur border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* categories */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={`flex-shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full transition border ${
                  activeCategory === cat
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] bg-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* filter toggle */}
            <button
              onClick={() => setFilterOpen((p) => !p)}
              className={`flex items-center gap-2 text-sm font-semibold border rounded-xl px-4 py-2 transition ${
                filterOpen ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--border)] text-[var(--text-primary)] bg-[var(--bg-card)] hover:border-[var(--color-primary)]"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <SortDropdown value={sort} onChange={(v) => { setSort(v); setPage(1); }} />
          </div>
        </div>

        {/* ── Filter drawer ── */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[var(--border)] bg-[var(--bg-card)]"
            >
              <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap gap-8 items-start">
                {/* price range */}
                <div className="flex-1 min-w-[200px]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">
                    Max Price: Rs. {maxPrice.toLocaleString()}
                  </p>
                  <input
                    type="range"
                    min={500}
                    max={100000}
                    step={500}
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[var(--text-muted)] mt-1">
                    <span>Rs. 500</span><span>Rs. 1,00,000</span>
                  </div>
                </div>

                {/* quick tags */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">
                    Quick Filters
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {["50%+ off", "Under Rs. 1000", "Top Rated", "New Arrivals"].map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--text-secondary)] cursor-pointer hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition">
                        <Tag className="h-3 w-3" />{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button onClick={() => setFilterOpen(false)} className="ml-auto self-start text-[var(--text-muted)] hover:text-[var(--color-primary)] transition">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Products Grid ── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-[var(--text-muted)]">
            <Flame className="h-16 w-16 opacity-20" />
            <p className="text-lg font-bold">Loading flash deals...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-[var(--text-muted)]">
            <Flame className="h-16 w-16 opacity-20" />
            <p className="text-lg font-bold">No flash deals found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Showing <span className="font-bold text-[var(--text-primary)]">{paginated.length}</span> of{" "}
              <span className="font-bold text-[var(--text-primary)]">{filtered.length}</span> deals
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              <AnimatePresence>
                {paginated.map((product, index) => (
                  <motion.div
                    key={product._id || index}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={stagger(index % PER_PAGE)}
                    className="h-full"
                  >
                    <ProductCard product={product} token={token} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* load more */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-white text-sm transition hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                    boxShadow: "0 4px 20px rgba(249,115,22,0.3)",
                  }}
                >
                  <Zap className="h-4 w-4" />
                  Load More Deals
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}