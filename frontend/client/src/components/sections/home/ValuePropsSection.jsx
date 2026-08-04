import {
  BadgePercent,
  CheckCircle2,
  Headphones,
  Lock,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

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
    title: "Satisfaction Guaranteed",
    text: "Shop with total peace of mind",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    text: "Hassle-free return process",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    text: "We're here whenever you need us",
  },
  {
    icon: PackageCheck,
    title: "Verified Vendors",
    text: "Trusted sellers, real products",
  },
  {
    icon: BadgePercent,
    title: "Best Deals",
    text: "Exclusive offers every day",
  },
  {
    icon: Sparkles,
    title: "Curated Picks",
    text: "Handpicked trends you'll love",
  },
];

function PropItem({ item }) {
  const Icon = item.icon;
  return (
    <div className="flex shrink-0 items-center gap-3 px-8">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-main)] text-[var(--color-primary)]">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="whitespace-nowrap text-sm font-bold text-[var(--text-primary)]">
          {item.title}
        </p>
        <p className="mt-0.5 whitespace-nowrap text-xs text-[var(--text-secondary)]">
          {item.text}
        </p>
      </div>
    </div>
  );
}

export default function ValuePropsSection() {
  const track = [...PROPS, ...PROPS];

  return (
    <section className="overflow-hidden border-y border-[var(--border)] bg-[var(--bg-card)] py-8">
      <style>{`
        @keyframes shopzo-value-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .shopzo-value-marquee {
          animation: shopzo-value-marquee 38s linear infinite;
          width: max-content;
        }
        .shopzo-value-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--bg-card)] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--bg-card)] to-transparent sm:w-24" />

        <div className="shopzo-value-marquee flex items-center">
          {track.map((item, index) => (
            <div key={`${item.title}-${index}`} className="flex items-center">
              <PropItem item={item} />
              <span
                aria-hidden
                className="h-8 w-px shrink-0 bg-[var(--border)]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
