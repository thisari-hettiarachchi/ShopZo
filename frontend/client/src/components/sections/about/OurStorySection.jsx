import { Heart } from "lucide-react";

export default function OurStorySection() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-28">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <span className="text-sm font-bold text-[var(--color-secondary)] uppercase tracking-widest mb-4 block">Our Journey</span>
              <h2 className="text-5xl md:text-6xl font-black text-[var(--color-primary)] leading-tight">
                Our Story
              </h2>
            </div>
            <div className="space-y-5 text-lg text-[var(--text-secondary)] leading-relaxed">
              <p className="text-xl font-semibold text-[var(--text-primary)]">
                Founded in 2020, our platform was born from a simple vision: to create a marketplace where vendors of all sizes could thrive and customers could discover unique products from around the world.
              </p>
              <p>
                What started as a small team passionate about e-commerce has grown into a global community of thousands of vendors and millions of satisfied customers.
              </p>
              <p>
                Today, we continue to innovate and expand, always keeping our core mission at heart: empowering entrepreneurs and delighting customers with exceptional shopping experiences.
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <div className="flex-1 p-4 bg-[var(--bg-muted)] rounded-xl border-2 border-[var(--border)]">
                <div className="text-3xl font-black text-[var(--color-secondary)]">2020</div>
                <div className="text-sm text-[var(--text-secondary)] font-medium">Founded</div>
              </div>
              <div className="flex-1 p-4 bg-[var(--bg-muted)] rounded-xl border-2 border-[var(--border)]">
                <div className="text-3xl font-black text-[var(--color-primary)]">500K+</div>
                <div className="text-sm text-[var(--text-secondary)] font-medium">Customers</div>
              </div>
              <div className="flex-1 p-4 bg-[var(--bg-muted)] rounded-xl border-2 border-[var(--border)]">
                <div className="text-3xl font-black text-[var(--color-accent)]">50+</div>
                <div className="text-sm text-[var(--text-secondary)] font-medium">Countries</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl transform rotate-3 opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] rounded-3xl transform -rotate-3 opacity-20"></div>
            <div className="relative bg-[var(--bg-card)] p-12 rounded-3xl shadow-2xl border-4 border-[var(--border)]">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] rounded-full mb-6 shadow-2xl">
                  <Heart className="w-12 h-12 text-white" fill="white" />
                </div>
                <h3 className="text-3xl font-black text-[var(--text-primary)] mb-4">Building Trust Daily</h3>
                <p className="text-[var(--text-secondary)] text-lg font-medium">Every transaction strengthens our community</p>
                <div className="mt-8 pt-8 border-t-2 border-[var(--border)]">
                  <div className="flex justify-around">
                    <div>
                      <div className="text-2xl font-black text-[var(--color-secondary)]">4.9★</div>
                      <div className="text-xs text-[var(--text-muted)]">Rating</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[var(--color-primary)]">99%</div>
                      <div className="text-xs text-[var(--text-muted)]">Satisfaction</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[var(--color-accent)]">24/7</div>
                      <div className="text-xs text-[var(--text-muted)]">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}