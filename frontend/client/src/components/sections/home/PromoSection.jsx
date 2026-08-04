import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Assets from "../../../assets/assets";
import ScrollReveal from "../../shared/ScrollReveal";

const AUTO_MS = 5500;

function BannerPanel({ banners, fallbackImage }) {
  const slides = banners && banners.length > 0 ? banners : [];
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    setActive(0);
    setProgress(0);
    startRef.current = Date.now();
  }, [count]);

  useEffect(() => {
    if (count <= 1 || paused) return undefined;
    startRef.current = Date.now() - progress * AUTO_MS;

    const tick = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const nextProgress = Math.min(elapsed / AUTO_MS, 1);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        setActive((prev) => (prev + 1) % count);
        setProgress(0);
        startRef.current = Date.now();
      }
    }, 40);

    return () => clearInterval(tick);
  }, [count, paused, active]);

  if (count === 0) return null;

  const banner = slides[active];
  const vendorId = banner?.vendor?._id || banner?.vendor;
  const title = typeof banner?.title === "string" ? banner.title.trim() : "";
  const subtitle = typeof banner?.subtitle === "string" ? banner.subtitle.trim() : "";
  const href =
    typeof vendorId === "string" && vendorId.length > 8
      ? `/vendors/${vendorId}`
      : "/products";

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_28px_70px_-40px_var(--shadow)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[280px] md:min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={banner._id || active}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Link to={href} className="group block h-full w-full">
              <img
                src={banner.image || fallbackImage}
                alt={title || "Promotion banner"}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              {(subtitle || title) && (
                <div className="absolute inset-0 flex items-end p-7 md:p-9">
                  <div className="max-w-sm">
                    {subtitle ? (
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
                        {subtitle}
                      </p>
                    ) : null}
                    {title ? (
                      <h3
                        className={`display-font text-3xl font-black leading-tight text-white md:text-4xl ${
                          subtitle ? "mt-3" : ""
                        }`}
                      >
                        {title}
                      </h3>
                    ) : null}
                  </div>
                </div>
              )}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15">
            <div
              className="h-full bg-[var(--color-primary)] transition-[width] duration-75"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((item, index) => (
              <button
                key={item._id || index}
                type="button"
                aria-label={`Go to banner ${index + 1}`}
                onClick={() => {
                  setActive(index);
                  setProgress(0);
                  startRef.current = Date.now();
                }}
                className={`h-2 rounded-full transition-all ${
                  index === active ? "w-7 bg-white" : "w-2 bg-white/45 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function PromoSection({ banners }) {
  const list = Array.isArray(banners) ? banners : [];

  // 1st, 3rd, 5th... → left | 2nd, 4th, 6th... → right
  const leftBanners = list.filter((_, index) => index % 2 === 0);
  const rightBanners = list.filter((_, index) => index % 2 === 1);

  if (list.length === 0) return null;

  const hasRight = rightBanners.length > 0;

  return (
    <section className="bg-[var(--bg-main)] px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal y={32} duration={0.55}>
          <div className={`grid gap-5 ${hasRight ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
            <BannerPanel banners={leftBanners} fallbackImage={Assets.flashSale} />
            {hasRight && (
              <BannerPanel banners={rightBanners} fallbackImage={Assets.newArrival} />
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
