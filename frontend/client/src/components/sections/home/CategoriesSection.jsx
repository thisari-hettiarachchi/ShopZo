import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function CatHero({ cat, index }) {
  const categoryValue = encodeURIComponent(cat.name || cat._id || "");
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.07 }}
      className="col-span-2 row-span-2 relative overflow-hidden rounded-3xl cursor-pointer group"
      style={{ minHeight: 340 }}
    >
      <Link to={`/products?category=${categoryValue}`} className="block h-full">
        {cat.image ? (
          <img
            src={cat.image}
            alt={cat.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient || "from-orange-500 to-amber-400"} flex items-center justify-center text-8xl`}>
            {cat.icon}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-7 flex items-end justify-between">
          <div>
            <span className="inline-block text-[10px] mono-font tracking-[0.2em] text-orange-400 uppercase mb-2">
              Featured
            </span>
            <h3 className="display-font text-white text-3xl font-bold leading-tight">
              {cat.name}
            </h3>
            {cat.count && <p className="text-white/60 text-sm mt-1 font-light">{cat.count}+ items</p>}
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0">
            <ArrowRight size={16} className="text-white" />
          </div>
        </div>
        <div className="absolute top-4 left-4 w-12 h-12 rounded-xl border-2 border-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-2xl">
          {cat.icon}
        </div>
      </Link>
    </motion.div>
  );
}

function CatPortrait({ cat, index }) {
  const categoryValue = encodeURIComponent(cat.name || cat._id || "");
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="col-span-1 row-span-2 relative overflow-hidden rounded-2xl cursor-pointer group"
      style={{ minHeight: 280 }}
    >
      <Link to={`/products?category=${categoryValue}`} className="block h-full">
        {cat.image ? (
          <img
            src={cat.image}
            alt={cat.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient || "from-violet-500 to-purple-700"} flex items-center justify-center text-5xl`}>
            {cat.icon}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="display-font text-white text-xl font-bold leading-snug">
            {cat.name}
          </h3>
          <div className="mt-2 flex items-center gap-1.5 text-[var(--color-primary)] text-xs font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            Shop <ArrowRight size={11} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function CatFlat({ cat, index }) {
  const categoryValue = encodeURIComponent(cat.name || cat._id || "");
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="col-span-1 relative overflow-hidden rounded-2xl cursor-pointer group border border-[var(--border)] bg-[var(--bg-card)]"
      style={{ minHeight: 130 }}
    >
      <Link to={`/products?category=${categoryValue}`} className="flex h-full items-center gap-4 p-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative">
          {cat.image ? (
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${cat.gradient || "from-cyan-400 to-blue-500"} flex items-center justify-center text-2xl`}>
              {cat.icon}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[var(--text-primary)] font-bold text-sm leading-snug truncate group-hover:text-[var(--color-primary)] transition-colors display-font">
            {cat.name}
          </h3>
          {cat.count && <p className="text-[var(--text-muted)] text-[11px] mt-0.5">{cat.count}+ items</p>}
        </div>

        <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--color-primary)] shrink-0 transition-colors group-hover:translate-x-1 transition-transform duration-200" />
      </Link>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </motion.div>
  );
}

export default function CategoriesSection({ categories }) {
  if (!categories.length) return null;

  const featuredCategories = categories.slice(0, 4);
  const [hero, portrait, ...rest] = featuredCategories;

  return (
    <section className="py-24 px-4 bg-[var(--bg-main)] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-14">
          <div className="relative">
            <span className="section-eyebrow block mb-3 relative">Browse</span>
            <h2 className="mt-4 display-font relative text-[2.6rem] md:text-[3.4rem] lg:text-[4rem] font-black text-[var(--text-primary)] leading-[1.0] tracking-tight">
              Shop by <span className="display-font italic text-[var(--color-primary)]">Category</span>
            </h2>
          </div>

          <Link
            to="/categories"
            className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] border border-[var(--color-primary)] px-5 py-2.5 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
          >
            All Categories <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px]">
          {hero && <CatHero cat={hero} index={0} />}
          {portrait && <CatPortrait cat={portrait} index={1} />}
          {rest.slice(0, 2).map((cat, index) => (
            <CatFlat key={cat._id} cat={cat} index={index + 2} />
          ))}
        </div>

        <div className="flex md:hidden justify-center mt-8">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] border border-[var(--color-primary)] px-6 py-2.5 rounded-full"
          >
            View All Categories <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
