import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../product/ProductCard";

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
            to="/flashsale"
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
