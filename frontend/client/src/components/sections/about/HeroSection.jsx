import { Sparkles } from "lucide-react";

export default function HeroSection({ aboutImage }) {
  return (
    <div className="relative overflow-hidden py-32 px-6 mt-[-70px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${aboutImage})` }}
      />

      <div className="absolute inset-0 bg-yellow-200/25" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 via-[var(--color-secondary)]/20 to-[var(--color-accent)]/20" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg text-white px-6 py-3 rounded-full mb-8 border border-white/20">
          <Sparkles className="w-5 h-5" />
          <span className="mono-font font-semibold tracking-[0.08em]">Trusted by thousands worldwide</span>
        </div>

        <h1 className="display-font text-6xl md:text-7xl font-black mb-8 text-white">
          About Our Marketplace
        </h1>

        <p className="text-2xl text-white/90 max-w-3xl mx-auto">
          Connecting vendors and customers worldwide through a trusted,
          innovative platform built on transparency and excellence.
        </p>
      </div>
    </div>
  );
}