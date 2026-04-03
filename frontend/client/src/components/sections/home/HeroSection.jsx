import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Assets from "../../../assets/assets";

export default function HeroSection() {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof document === "undefined") return false;
    const root = document.documentElement;
    return root.getAttribute("data-theme") === "dark" || root.classList.contains("dark");
  });

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const root = document.documentElement;
    const syncTheme = () => {
      setIsDarkTheme(root.getAttribute("data-theme") === "dark" || root.classList.contains("dark"));
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative isolate min-h-[100vh] mt-[-70px] overflow-hidden flex items-center">
      <div className="absolute inset-0 -z-10">
        <img
          src={isDarkTheme ? Assets.DarkHero : Assets.LightHero}
          alt="ShopZo hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
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
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/90 px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase mb-7 mono-font">
                <Zap size={11} className="text-[var(--color-primary)] fill-[var(--color-primary)]" />
                New Season · Exclusive Deals
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="display-font text-[2.8rem] md:text-[3.8rem] lg:text-[4.8rem] leading-[1.04] font-black text-white tracking-tight"
            >
              Discover Everyday
              <br />
              <span className="relative inline-block italic">
                <span className="relative z-10 text-[var(--color-primary)]">Deals,</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-[var(--color-primary)] opacity-20 rounded-sm -z-0" />
              </span>{" "}
              <span className="display-font font-black not-italic">Elevated.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-[1.05rem] md:text-lg text-white/65 max-w-lg leading-relaxed font-light"
            >
              From trending tech to beauty essentials — shop curated products from trusted vendors with exclusive daily offers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="mt-8 flex items-center gap-6 text-white/80"
            >
              {[["50K+", "Products"], ["1.2K", "Vendors"], ["4.9★", "Rating"]].map(([value, label]) => (
                <div key={label} className="text-center">
                  <div className="text-xl font-extrabold text-white leading-none mono-font">{value}</div>
                  <div className="text-[10px] text-white/50 mt-0.5 tracking-widest uppercase">{label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[0.93rem] font-bold text-white bg-[var(--color-primary)] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-orange-500/30"
              >
                Shop Now
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products?sort=popular"
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[0.93rem] font-semibold border border-white/25 text-white bg-white/10 backdrop-blur-sm hover:bg-white/18 transition-colors"
              >
                Trending Now
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
