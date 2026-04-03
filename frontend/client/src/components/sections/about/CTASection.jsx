
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] py-24 px-6">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-300 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-white/95 mb-10 leading-relaxed max-w-2xl mx-auto">
            Whether you're a vendor looking to expand your business or a customer seeking quality products, we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-8 py-4 bg-white text-orange-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              Become a Vendor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group px-8 py-4 bg-transparent border-3 border-white text-white rounded-full font-bold text-lg shadow-xl hover:bg-white hover:text-orange-600 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              Start Shopping
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
    </div>
  );
}