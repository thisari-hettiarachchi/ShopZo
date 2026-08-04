import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal, { scrollViewport } from "../../shared/ScrollReveal";

function CategoryImage({ cat, className }) {
  if (cat.image) {
    return (
      <img
        src={cat.image}
        alt={cat.name}
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${className || ""}`}
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]">
      <span className="text-5xl font-black text-white/90">
        {(cat.name || "?").charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function CatHero({ cat, index }) {
  const categoryValue = encodeURIComponent(cat.name || cat._id || "");
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={scrollViewport}
      transition={{ duration: 0.55, delay: index * 0.07 }}
      className="col-span-2 row-span-2 relative overflow-hidden rounded-3xl cursor-pointer group border border-[var(--border)]"
      style={{ minHeight: 340 }}
    >
      <Link to={`/products?category=${categoryValue}`} className="block h-full">
        <CategoryImage cat={cat} />
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
      viewport={scrollViewport}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="col-span-1 row-span-2 relative overflow-hidden rounded-2xl cursor-pointer group border border-[var(--border)]"
      style={{ minHeight: 280 }}
    >
      <Link to={`/products?category=${categoryValue}`} className="block h-full">
        <CategoryImage cat={cat} />
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

function CatSquare({ cat, index }) {
  const categoryValue = encodeURIComponent(cat.name || cat._id || "");
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={scrollViewport}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="col-span-1 relative overflow-hidden rounded-2xl cursor-pointer group border border-[var(--border)]"
    >
      <Link to={`/products?category=${categoryValue}`} className="block h-full">
        <CategoryImage cat={cat} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="display-font text-white text-base font-bold leading-snug truncate">
            {cat.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-[var(--color-primary)] text-[11px] font-semibold opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            Shop <ArrowRight size={10} />
          </div>
        </div>
      </Link>
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
        <ScrollReveal className="mb-14 flex items-end justify-between" y={20}>
          <div className="relative">
            <span className="section-eyebrow relative mb-3 block">Browse</span>
            <h2 className="display-font relative mt-4 text-[2.6rem] font-black leading-[1.0] tracking-tight text-[var(--text-primary)] md:text-[3.4rem] lg:text-[4rem]">
              Shop by <span className="display-font italic text-[var(--color-primary)]">Category</span>
            </h2>
          </div>

          <Link
            to="/categories"
            className="hidden items-center gap-2 rounded-full border border-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-[var(--color-primary)] transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white md:inline-flex"
          >
            All Categories <ArrowRight size={13} />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px]">
          {hero && <CatHero cat={hero} index={0} />}
          {portrait && <CatPortrait cat={portrait} index={1} />}
          {rest.slice(0, 2).map((cat, index) => (
            <CatSquare key={cat._id} cat={cat} index={index + 2} />
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
