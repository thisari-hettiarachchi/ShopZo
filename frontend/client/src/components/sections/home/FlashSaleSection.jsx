import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Star } from "lucide-react";
import { Link } from "react-router-dom";

const stagger = (index, base = 0.06) => ({ delay: index * base });

export default function FlashSaleSection({ products }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 23, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        let { hours, minutes, seconds } = previous;

        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            hours = hours > 0 ? hours - 1 : 23;
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (value) => value.toString().padStart(2, "0");

  return (
    <section className="py-20 px-4 bg-[var(--bg-card)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-xl bg-orange-500/30" />
              <div className="relative bg-gradient-to-br from-orange-500 to-amber-400 p-3 rounded-xl shadow-lg shadow-orange-500/30">
                <Flame className="text-white" size={26} />
              </div>
            </div>
            <div>
              <span className="section-eyebrow block mb-2">Limited Time</span>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="display-font text-[2.6rem] md:text-[3.4rem] lg:text-[4rem] font-black text-[var(--text-primary)] leading-[1.0] tracking-tight">
                  Flash <span className="italic text-[var(--color-primary)]">Sale</span>
                </h2>
                <div className="flex items-center gap-1 bg-[var(--text-primary)] rounded-xl px-3 py-1.5">
                  {[format(timeLeft.hours), format(timeLeft.minutes), format(timeLeft.seconds)].map((value, index) => (
                    <span key={`${index}-${value}`} className="flex items-center gap-1">
                      <span className="text-sm font-black mono-font text-[var(--bg-main)] tabular-nums">{value}</span>
                      {index < 2 && <span className="text-orange-400 font-black text-sm mx-0.5">:</span>}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[var(--text-muted)] text-sm mt-1 font-light">Hurry — limited time deals</p>
            </div>
          </div>

          <Link
            to="/products?sale=flash"
            className="text-sm font-bold text-[var(--color-primary)] hover:opacity-75 px-5 py-2 rounded-full border-2 border-[var(--color-primary)] transition-all hover:bg-[var(--color-primary)] hover:text-white"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {products.map((product, index) => (
            <motion.div
              key={product._id || index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...stagger(index, 0.06), duration: 0.4 }}
              className="group bg-[var(--bg-main)] rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--color-primary)] hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-full aspect-square bg-[var(--bg-muted)] overflow-hidden">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow mono-font">
                  -{product.discount}%
                </div>
              </div>
              <div className="p-4">
                <h3 className="display-font text-[0.82rem] font-bold text-[var(--text-primary)] line-clamp-2 mb-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-[11px] text-[var(--text-muted)] font-medium">{product.rating}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-extrabold text-base text-[var(--color-primary)] mono-font">Rs.{product.price}</span>
                  <span className="text-[11px] text-[var(--text-muted)] line-through">Rs.{product.oldPrice}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
