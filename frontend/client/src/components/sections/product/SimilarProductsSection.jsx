import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import ScrollReveal, { scrollViewport } from "../../shared/ScrollReveal";

const stagger = (index, base = 0.05) => ({ delay: index * base });

export default function SimilarProductsSection({ products, category }) {
  const items = Array.isArray(products) ? products : [];

  if (items.length === 0) return null;

  const categoryLink = category
    ? `/products?category=${encodeURIComponent(category)}`
    : "/products";

  return (
    <section className="bg-[var(--bg-main)] px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-14 flex items-end justify-between gap-4" y={20}>
          <div className="relative">
            <span className="section-eyebrow relative mb-3 block">You may also like</span>
            <h2 className="display-font relative mt-4 text-[2.6rem] font-black leading-[1.0] tracking-tight text-[var(--text-primary)] md:text-[3.4rem] lg:text-[4rem]">
              Similar{" "}
              <span className="display-font italic text-[var(--color-primary)]">
                Products
              </span>
            </h2>
          </div>
          <Link
            to={categoryLink}
            className="hidden items-center gap-2 rounded-full border border-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-[var(--color-primary)] transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white md:inline-flex"
          >
            View All <ArrowRight size={13} />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((product, index) => (
            <motion.div
              key={product._id || index}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={scrollViewport}
              transition={{ ...stagger(index), duration: 0.4 }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Link
            to={categoryLink}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-[var(--color-primary)] transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white"
          >
            View All <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
