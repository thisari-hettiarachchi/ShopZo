import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

const AUTO_MS = 5500;

export default function PromoSection({ banners }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());

  const count = banners?.length || 0;

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
        setDirection(1);
        setActive((prev) => (prev + 1) % count);
        setProgress(0);
        startRef.current = Date.now();
      }
    }, 40);

    return () => clearInterval(tick);
  }, [count, paused, active]);

  if (!banners || banners.length === 0) return null;

  const goTo = (index) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
    setProgress(0);
    startRef.current = Date.now();
  };

  const goPrev = () => {
    setDirection(-1);
    setActive((prev) => (prev - 1 + count) % count);
    setProgress(0);
    startRef.current = Date.now();
  };

  const goNext = () => {
    setDirection(1);
    setActive((prev) => (prev + 1) % count);
    setProgress(0);
    startRef.current = Date.now();
  };

  const banner = banners[active];
  const vendorId = banner?.vendor?._id || banner?.vendor;
  const storeName = banner?.vendor?.storeName || "ShopZo Vendor";
  const href = vendorId ? `/vendors/${vendorId}` : "/products";

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 48 : -48, scale: 1.02 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -48 : 48, scale: 0.99 }),
  };

  return (
    <section className="py-20 px-4 bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          {count > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous banner"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next banner"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        <div
          className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_28px_80px_-48px_var(--shadow)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative aspect-[16/10] md:aspect-[21/9]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={banner._id || active}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Link to={href} className="group block h-full w-full">
                  <img
                    src={banner.image}
                    alt={banner.title || storeName}
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                  <div className="absolute inset-0 flex items-end p-6 md:p-10 lg:p-14">
                    <div className="max-w-xl">
                      {banner.subtitle && (
                        <p className="section-eyebrow mb-2 text-orange-300">{banner.subtitle}</p>
                      )}
                      {banner.title && (
                        <h3 className="display-font text-3xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
                          {banner.title}
                        </h3>
                      )}
                      <span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition group-hover:bg-[var(--color-primary)] group-hover:text-white">
                        Visit store
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15">
                <motion.div
                  className="h-full bg-[var(--color-primary)]"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 md:bottom-7">
                {banners.map((item, index) => {
                  const isActive = index === active;
                  return (
                    <button
                      key={item._id || index}
                      type="button"
                      aria-label={`Go to banner ${index + 1}`}
                      onClick={() => goTo(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? "w-8 bg-white"
                          : "w-2 bg-white/45 hover:bg-white/75"
                      }`}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
