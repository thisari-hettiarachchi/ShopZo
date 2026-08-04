import { motion } from "framer-motion";

const DEFAULT_VIEWPORT = { once: false, amount: 0.2, margin: "0px 0px -60px 0px" };

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  x = 0,
  duration = 0.5,
  as = "div",
}) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={DEFAULT_VIEWPORT}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}

export const scrollViewport = DEFAULT_VIEWPORT;
