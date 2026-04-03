import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Assets from "../../../assets/assets";

const banners = [
  { src: Assets.flashSale, alt: "Mega Sale", label: "Up to 70% Off", sub: "Flash Deals" },
  { src: Assets.newArrival, alt: "New Arrivals", label: "Fresh Drops", sub: "New Arrivals" },
];

export default function PromoSection() {
  return (
    <section className="py-20 px-4 bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner, index) => (
          <motion.div
            key={banner.alt}
            initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-3xl cursor-pointer border border-[var(--border)] bg-[var(--bg-card)]"
            style={{ aspectRatio: "16/9" }}
          >
            <img
              src={banner.src}
              alt={banner.alt}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="section-eyebrow text-orange-400 mb-1">{banner.sub}</p>
              <h3 className="display-font text-2xl md:text-3xl font-black leading-tight">{banner.label}</h3>
            </div>
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white bg-[var(--color-primary)] shadow-lg shadow-orange-500/40"
              >
                Shop <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
