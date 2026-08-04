import { motion } from "framer-motion";
import { ArrowRight, Megaphone, Store } from "lucide-react";
import { Link } from "react-router-dom";

function BannerCard({ banner, index }) {
  const isPortrait = banner.layout === "portrait";
  const vendorId = banner.vendor?._id || banner.vendor;
  const storeName = banner.vendor?.storeName || "ShopZo Vendor";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer border border-[var(--border)] bg-[var(--bg-card)] ${
        isPortrait ? "sm:col-span-1" : "sm:col-span-2"
      }`}
      style={{ aspectRatio: isPortrait ? "3/4" : "16/9" }}
    >
      <Link to={vendorId ? `/vendors/${vendorId}` : "/products"} className="block h-full">
        <img
          src={banner.image}
          alt={banner.title || storeName}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1.5 text-[11px] font-semibold text-white">
          <Store size={12} />
          {storeName}
        </span>

        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between gap-3">
          <div className="min-w-0">
            {banner.subtitle && (
              <p className="section-eyebrow text-orange-400 mb-1 truncate">{banner.subtitle}</p>
            )}
            {banner.title && (
              <h3 className="display-font text-white text-2xl md:text-3xl font-black leading-tight truncate">
                {banner.title}
              </h3>
            )}
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0">
            <ArrowRight size={16} className="text-white" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function PromoSection({ banners }) {
  if (!banners || banners.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-3 rounded-xl shadow-lg shadow-orange-500/20">
            <Megaphone className="text-white" size={22} />
          </div>
          <div>
            <span className="section-eyebrow block mb-1">Vendor Spotlight</span>
            <h2 className="display-font text-2xl md:text-3xl font-black text-[var(--text-primary)] leading-tight">
              Featured <span className="italic text-[var(--color-primary)]">Promotions</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner, index) => (
            <BannerCard key={banner._id} banner={banner} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
