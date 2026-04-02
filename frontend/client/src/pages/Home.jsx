import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp, Award, ArrowRight, Zap, ChevronRight, Flame } from "lucide-react";
import Assets from "../assets/assets";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";

// ── Stagger helper ──────────────────────────────────────────────────────────
const stagger = (i, base = 0.06) => ({ delay: i * base });

export default function Hero() {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof document === "undefined") return false;
    const root = document.documentElement;
    return root.getAttribute("data-theme") === "dark" || root.classList.contains("dark");
  });

  const [categories, setCategories]           = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [vendors, setVendors]                 = useState([]);
  const [justForYou, setJustForYou]           = useState([]);
  const [timeLeft, setTimeLeft]               = useState({ hours: 4, minutes: 23, seconds: 59 });

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then(r => setCategories(r.data)).catch(console.error);
  }, []);
  useEffect(() => {
    axios.get("http://localhost:5000/api/products/flash-sale")
      .then(r => setFlashSaleProducts(r.data)).catch(console.error);
  }, []);
  useEffect(() => {
    axios.get("http://localhost:5000/api/vendors")
      .then(r => setVendors(r.data)).catch(console.error);
  }, []);
  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(r => setJustForYou(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () =>
      setIsDarkTheme(root.getAttribute("data-theme") === "dark" || root.classList.contains("dark"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else { seconds = 59; if (minutes > 0) minutes--; else { minutes = 59; hours = hours > 0 ? hours - 1 : 23; } }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = v => v.toString().padStart(2, "0");

  return (
    <>
      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative isolate min-h-[100vh] mt-[-70px] overflow-hidden flex items-center">
        <div className="absolute inset-0 -z-10">
          <img
            src={isDarkTheme ? Assets.DarkHero : Assets.LightHero}
            alt="ShopZo hero"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
          {/* Decorative glow */}
          <div className="absolute bottom-0 left-0 w-[40vw] h-[30vh] bg-[var(--color-primary)] opacity-20 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-32 md:py-44">
            <div className="max-w-2xl">

              {/* Badge */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/90 px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase mb-7">
                  <Zap size={11} className="text-[var(--color-primary)] fill-[var(--color-primary)]" />
                  New Season · Exclusive Deals
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-[2.8rem] md:text-[3.8rem] lg:text-[4.5rem] leading-[1.04] font-extrabold text-white tracking-tight"
              >
                Discover Everyday
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-[var(--color-primary)]">Deals,</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-[var(--color-primary)] opacity-20 rounded-sm -z-0" />
                </span>{" "}
                Elevated.
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="mt-6 text-[1.05rem] md:text-lg text-white/65 max-w-lg leading-relaxed"
              >
                From trending tech to beauty essentials — shop curated products from trusted vendors with exclusive daily offers.
              </motion.p>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
                className="mt-8 flex items-center gap-6 text-white/80"
              >
                {[["50K+", "Products"], ["1.2K", "Vendors"], ["4.9★", "Rating"]].map(([val, label]) => (
                  <div key={label} className="text-center">
                    <div className="text-xl font-extrabold text-white leading-none">{val}</div>
                    <div className="text-[11px] text-white/50 mt-0.5 tracking-wide uppercase">{label}</div>
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }}
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                <Link to="/products">
                  <button className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[0.93rem] font-bold text-white bg-[var(--color-primary)] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-orange-500/30">
                    Shop Now
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link to="/products?sort=popular">
                  <button className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[0.93rem] font-semibold border border-white/25 text-white bg-white/10 backdrop-blur-sm hover:bg-white/18 transition-colors">
                    Trending Now
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════ CATEGORIES ═══════════════════════════ */}
      <section className="py-20 px-4 bg-[var(--bg-main)]">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[var(--color-primary)] text-[11px] font-bold tracking-[0.2em] uppercase mb-2">Browse</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] leading-tight">
                Shop by Category
              </h2>
            </div>
            <Link to="/categories" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:opacity-75 transition-opacity">
              All Categories <ChevronRight size={15} />
            </Link>
          </div>

          {/* Category grid — images + names */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...stagger(i, 0.05), duration: 0.45 }}
              >
                <Link to={`/products?category=${cat._id}`}>
                  <div className="group relative overflow-hidden rounded-2xl cursor-pointer border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">

                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                          style={{ transform: "scale(1)", transition: "transform 0.5s ease" }}
                          onMouseOver={e => e.currentTarget.style.transform = "scale(1.08)"}
                          onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${cat.gradient || "from-orange-400 to-amber-500"} flex items-center justify-center text-4xl`}>
                          {cat.icon}
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    </div>

                    {/* Name at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="block text-white text-[0.78rem] font-bold leading-tight text-center drop-shadow">
                        {cat.name}
                      </span>
                    </div>

                    {/* Primary accent bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FLASH SALE ═══════════════════════════ */}
      <section className="py-20 px-4 bg-[var(--bg-card)]">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-4">
              {/* Flame icon with pulse ring */}
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-xl bg-orange-500/30" />
                <div className="relative bg-gradient-to-br from-orange-500 to-amber-400 p-3 rounded-xl shadow-lg shadow-orange-500/30">
                  <Flame className="text-white" size={26} />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">Flash Sale</h2>
                  {/* Countdown */}
                  <div className="flex items-center gap-1 bg-[var(--text-primary)] rounded-xl px-3 py-1.5">
                    {[fmt(timeLeft.hours), fmt(timeLeft.minutes), fmt(timeLeft.seconds)].map((val, i) => (
                      <React.Fragment key={i}>
                        <span className="text-sm font-black font-mono text-[var(--bg-main)] tabular-nums">{val}</span>
                        {i < 2 && <span className="text-orange-400 font-black text-sm mx-0.5">:</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <p className="text-[var(--text-muted)] text-sm mt-1">Hurry — limited time deals</p>
              </div>
            </div>
            <Link to="/products?sale=flash">
              <button className="text-sm font-bold text-[var(--color-primary)] hover:opacity-75 px-5 py-2 rounded-full border-2 border-[var(--color-primary)] transition-all hover:bg-[var(--color-primary)] hover:text-white">
                View All
              </button>
            </Link>
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {flashSaleProducts.map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...stagger(i, 0.06), duration: 0.4 }}
                className="group bg-[var(--bg-main)] rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--color-primary)] hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full aspect-square bg-[var(--bg-muted)] overflow-hidden">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                    -{product.discount}%
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-[0.82rem] font-bold text-[var(--text-primary)] line-clamp-2 mb-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-3">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-[11px] text-[var(--text-muted)] font-medium">{product.rating}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-base text-[var(--color-primary)]">Rs.{product.price}</span>
                    <span className="text-[11px] text-[var(--text-muted)] line-through">Rs.{product.oldPrice}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ PROMO BANNERS ═══════════════════════════ */}
      <section className="py-20 px-4 bg-[var(--bg-main)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { src: Assets.flashSale, alt: "Mega Sale", label: "Up to 70% Off", sub: "Flash Deals" },
            { src: Assets.newArrival, alt: "New Arrivals", label: "Fresh Drops", sub: "New Arrivals" },
          ].map((banner, i) => (
            <motion.div
              key={banner.alt}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
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

              {/* Text overlay */}
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-400 mb-1">{banner.sub}</p>
                <h3 className="text-2xl md:text-3xl font-extrabold leading-tight">{banner.label}</h3>
              </div>

              {/* Hover CTA */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <button className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white bg-[var(--color-primary)] shadow-lg shadow-orange-500/40">
                  Shop <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ FEATURED VENDORS ═══════════════════════════ */}
      <section className="py-20 px-4 bg-[var(--bg-card)]">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[var(--color-primary)] text-[11px] font-bold tracking-[0.2em] uppercase mb-2">Trusted Sellers</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">Featured Vendors</h2>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[var(--text-muted)] text-sm">
              <Award size={15} className="text-[var(--color-primary)]" />
              Top-rated &amp; verified
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {vendors.map((vendor, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...stagger(i, 0.06), duration: 0.4 }}
                className="group flex flex-col items-center bg-[var(--bg-main)] rounded-2xl border border-[var(--border)] hover:border-[var(--color-primary)] p-6 cursor-pointer hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300"
              >
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                    🏪
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[var(--bg-main)]" />
                </div>
                <span className="text-[var(--text-primary)] font-bold text-sm text-center group-hover:text-[var(--color-primary)] transition-colors mb-1.5">
                  {vendor.name}
                </span>
                <div className="flex items-center gap-1 mb-1">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span className="text-[11px] font-bold text-[var(--text-secondary)]">{vendor.rating}</span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)] font-medium">{vendor.products} products</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ JUST FOR YOU ═══════════════════════════ */}
      <section className="py-20 px-4 bg-[var(--bg-main)]">
        <div className="max-w-7xl mx-auto">

          {/* Decorated heading */}
          <div className="flex flex-col items-center mb-14">
            <p className="text-[var(--color-primary)] text-[11px] font-bold tracking-[0.2em] uppercase mb-3">Personalized</p>
            <div className="flex items-center gap-4 w-full max-w-xl">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--border)]" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] whitespace-nowrap">
                Just For You
              </h2>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--border)]" />
            </div>
            <p className="text-[var(--text-muted)] text-sm mt-3">Curated picks based on your taste</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {justForYou.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Load more */}
          <div className="flex justify-center mt-12">
            <Link to="/products">
              <button className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300">
                Load More <ChevronRight size={15} />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}