import { motion } from "framer-motion";
import { CheckCircle2, Lock, ShieldCheck, Truck } from "lucide-react";
import { scrollViewport } from "../../shared/ScrollReveal";

const PROPS = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    text: "Made with the finest materials",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    text: "Quick and reliable shipping",
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    text: "Your data is protected",
  },
  {
    icon: CheckCircle2,
    title: "Customer Satisfaction",
    text: "100% satisfaction guarantee",
  },
];

export default function ValuePropsSection() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-card)] px-4 py-10">
      <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PROPS.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={scrollViewport}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              className="flex items-start gap-3 px-2"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-main)] text-[var(--color-primary)]">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {item.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
