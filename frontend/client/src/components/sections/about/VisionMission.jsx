import { Sparkles, TrendingUp } from "lucide-react";

export default function VisionMission({ hoveredTeam, setHoveredTeam }) {
  return (
    <div className="relative overflow-hidden bg-[var(--bg-main)] py-28 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-primary)] rounded-full blur-2xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-[var(--color-secondary)] rounded-full blur-2xl opacity-30 animate-float-delayed"></div>
          <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-[var(--color-accent)] rounded-full blur-2xl opacity-30 animate-float-slow"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-[var(--color-primary)] rounded-full blur-2xl opacity-30 animate-float"></div>
          <div className="absolute top-1/2 left-1/2 w-44 h-44 bg-[var(--color-secondary)] rounded-full blur-3xl opacity-20 animate-float-delayed"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-sm font-bold text-[var(--color-secondary)] uppercase tracking-widest mb-4 block">Our Direction</span>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-[var(--color-primary)]">
              Vision & Mission
            </h2>
            <p className="text-[var(--text-secondary)] text-xl max-w-2xl mx-auto">
              Guiding principles that drive our innovation and commitment
            </p>
          </div>

          {/* Vision */}
          <div className="mb-16">
            <div
              onMouseEnter={() => setHoveredTeam(0)}
              onMouseLeave={() => setHoveredTeam(null)}
              className={`relative rounded-3xl bg-[var(--bg-card)] border-2 transition-all duration-500 ease-out cursor-pointer overflow-hidden group ${
                hoveredTeam === 0 ? 'shadow-2xl -translate-y-2 border-[var(--color-primary)]' : 'shadow-lg border-[var(--border)] hover:shadow-xl'
              }`}
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-80 md:h-auto overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=800")',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/80 to-[var(--color-secondary)]/80 mix-blend-multiply"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                      hoveredTeam === 0 ? 'scale-110 rotate-12' : 'group-hover:scale-105'
                    }`}>
                      <Sparkles className="w-12 h-12 text-[var(--color-secondary)]" />
                    </div>
                  </div>
                </div>

                <div className="p-12">
                  <h3 className="text-4xl font-black mb-6 text-[var(--text-primary)]">Our Vision</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-lg mb-6">
                    To become the world's most trusted and innovative marketplace, where entrepreneurs and customers connect seamlessly across borders, cultures, and communities.
                  </p>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                    We envision a future where every vendor has the tools to succeed and every customer finds exactly what they're looking for.
                  </p>
                  <div className="mt-8 flex gap-4">
                    <div className="flex-1 p-4 bg-[var(--bg-muted)] rounded-xl border-2 border-[var(--border)]">
                      <div className="text-2xl font-black text-[var(--color-primary)] mb-1">Global</div>
                      <div className="text-sm text-[var(--text-secondary)]">Marketplace</div>
                    </div>
                    <div className="flex-1 p-4 bg-[var(--bg-muted)] rounded-xl border-2 border-[var(--border)]">
                      <div className="text-2xl font-black text-[var(--color-secondary)] mb-1">Innovation</div>
                      <div className="text-sm text-[var(--text-secondary)]">Driven</div>
                    </div>
                    <div className="flex-1 p-4 bg-[var(--bg-muted)] rounded-xl border-2 border-[var(--border)]">
                      <div className="text-2xl font-black text-[var(--color-accent)] mb-1">Trust</div>
                      <div className="text-sm text-[var(--text-secondary)]">First</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div>
            <div
              onMouseEnter={() => setHoveredTeam(1)}
              onMouseLeave={() => setHoveredTeam(null)}
              className={`relative rounded-3xl bg-[var(--bg-card)] border-2 transition-all duration-500 ease-out cursor-pointer overflow-hidden group ${
                hoveredTeam === 1 ? 'shadow-2xl -translate-y-2 border-[var(--color-secondary)]' : 'shadow-lg border-[var(--border)] hover:shadow-xl'
              }`}
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-12 order-2 md:order-1">
                  <h3 className="text-4xl font-black mb-6 text-[var(--text-primary)]">Our Mission</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-lg mb-6">
                    To empower vendors with cutting-edge technology and support while providing customers with a secure, diverse shopping experience.
                  </p>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                    We're committed to building a sustainable ecosystem that benefits all stakeholders through transparency, innovation, and exceptional service.
                  </p>
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)]"></div>
                      <span className="text-[var(--text-secondary)] font-medium">Empower entrepreneurs worldwide</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)]"></div>
                      <span className="text-[var(--text-secondary)] font-medium">Deliver exceptional customer experiences</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)]"></div>
                      <span className="text-[var(--text-secondary)] font-medium">Foster sustainable growth and innovation</span>
                    </div>
                  </div>
                </div>

                <div className="relative h-80 md:h-auto overflow-hidden order-1 md:order-2">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800")',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-secondary)]/80 to-[var(--color-accent)]/80 mix-blend-multiply"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                      hoveredTeam === 1 ? 'scale-110 rotate-12' : 'group-hover:scale-105'
                    }`}>
                      <TrendingUp className="w-12 h-12 text-[var(--color-secondary)]" />
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