import { motion } from "framer-motion";
import { Award, Star } from "lucide-react";

const stagger = (index, base = 0.06) => ({ delay: index * base });

export default function FeaturedVendorsSection({ vendors }) {
  return (
    <section className="py-20 px-4 bg-[var(--bg-card)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div className="mb-12">
            <span className="section-eyebrow block mb-3">Trusted Sellers</span>
            <h2 className="display-font text-[2.6rem] md:text-[3.4rem] lg:text-[4rem] font-black text-[var(--text-primary)] leading-[1.0] tracking-tight">
              Featured <span className="italic text-[var(--color-primary)]">Vendors</span>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[var(--text-muted)] text-sm mb-1">
            <Award size={15} className="text-[var(--color-primary)]" />
            Top-rated &amp; verified
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {vendors.map((vendor, index) => (
            <motion.div
              key={vendor._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...stagger(index, 0.06), duration: 0.4 }}
              className="group flex flex-col items-center bg-[var(--bg-main)] rounded-2xl border border-[var(--border)] hover:border-[var(--color-primary)] p-6 cursor-pointer hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300"
            >
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                  🏪
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[var(--bg-main)]" />
              </div>
              <span className="display-font text-[var(--text-primary)] font-bold text-sm text-center group-hover:text-[var(--color-primary)] transition-colors mb-1.5">
                {vendor.name}
              </span>
              <div className="flex items-center gap-1 mb-1">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-bold text-[var(--text-secondary)] mono-font">{vendor.rating}</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">{vendor.products} products</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
