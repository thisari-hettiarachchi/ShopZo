import { MapPin, Phone } from "lucide-react";

export default function HeroSection({ contactImage }) {
  return (
    <section
      className="relative w-full h-[500px] md:h-[600px] flex items-center bg-cover bg-center mt-[-70px]"
      style={{
        backgroundImage: `url(${contactImage})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 via-orange-800/80 to-amber-700/90" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 w-full">
        <div className="max-w-3xl space-y-6 text-white animate-fade-in">
          <div className="inline-block px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-300/30 mb-4">
            <span className="mono-font text-amber-200 font-semibold text-sm tracking-[0.08em]">Let&apos;s Connect</span>
          </div>

          <h1 className="display-font text-5xl md:text-7xl font-bold tracking-tight drop-shadow-2xl leading-tight">
            Reach Out to <span className="text-amber-300 inline-block hover:scale-105 transition-transform">ShopZo</span>
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-amber-300 to-orange-400 rounded-full" />

          <p className="text-xl md:text-2xl text-amber-50 leading-relaxed drop-shadow-lg font-light">
            We&apos;re here to help you find the perfect product. Choose a branch
            or send us a message directly. Your satisfaction is our priority!
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <MapPin className="text-amber-300" size={20} />
              <span className="text-amber-100 font-medium">3 Branches Island-wide</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <Phone className="text-amber-300" size={20} />
              <span className="text-amber-100 font-medium">24/7 Support Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
