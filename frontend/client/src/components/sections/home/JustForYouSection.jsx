import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import ProductCard from "../product/ProductCard";
import ScrollReveal, { scrollViewport } from "../../shared/ScrollReveal";

const PAGE_SIZE = 8;
const stagger = (index, base = 0.04) => ({ delay: Math.min(index * base, 0.4) });

export default function JustForYouSection({ products }) {
  const items = Array.isArray(products) ? products : [];
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (items.length === 0) return null;

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <section className="bg-[var(--bg-main)] px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-14 flex flex-col items-center text-center" y={20}>
          <span className="section-eyebrow mb-3">Personalized</span>
          <div className="flex w-full max-w-2xl items-center gap-5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-primary)] opacity-40" />
            <h2 className="display-font whitespace-nowrap text-[2.6rem] font-black leading-[1.0] tracking-tight text-[var(--text-primary)] md:text-[3.4rem] lg:text-[4rem]">
              Just For <span className="italic text-[var(--color-primary)]">You</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-primary)] opacity-40" />
          </div>
          <p className="mt-3 text-sm font-light text-[var(--text-muted)]">
            Curated picks based on your taste
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visibleItems.map((product, index) => (
            <motion.div
              key={product._id || index}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={scrollViewport}
              transition={{ ...stagger(index % PAGE_SIZE), duration: 0.4 }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-primary)] px-8 py-3.5 text-sm font-bold text-[var(--color-primary)] transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white"
            >
              Load More <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
