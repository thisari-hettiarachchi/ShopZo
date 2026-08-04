import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../product/ProductCard";

const stagger = (index, base = 0.05) => ({ delay: index * base });

export default function NewArrivalsSection({ products }) {
  const items = [...(products || [])]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);

  if (items.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 flex items-end justify-between gap-4">
          <div className="relative">
            <span className="section-eyebrow relative mb-3 block">Fresh drops</span>
            <h2 className="display-font relative mt-4 text-[2.6rem] font-black leading-[1.0] tracking-tight text-[var(--text-primary)] md:text-[3.4rem] lg:text-[4rem]">
              New <span className="display-font italic text-[var(--color-primary)]">Arrivals</span>
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden items-center gap-2 rounded-full border border-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-[var(--color-primary)] transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white md:inline-flex"
          >
            View All New Arrivals <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((product, index) => (
            <motion.div
              key={product._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...stagger(index), duration: 0.4 }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
