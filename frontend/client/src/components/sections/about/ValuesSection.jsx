export default function ValuesSection({ values, hoveredValue, setHoveredValue }) {
  return (
    <div className="bg-[var(--bg-muted)] py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-[var(--color-secondary)] uppercase tracking-widest mb-4 block">What Drives Us</span>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-[var(--color-primary)]">
              Our Core Values
            </h2>
            <p className="text-[var(--text-secondary)] text-xl max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredValue(idx)}
                onMouseLeave={() => setHoveredValue(null)}
                className={`relative p-10 rounded-3xl border-2 transition-all duration-500 ease-out cursor-pointer overflow-hidden bg-[var(--bg-card)] group ${
                  hoveredValue === idx ? 'shadow-2xl -translate-y-2 border-[var(--color-primary)] scale-[1.02]' : 'shadow-lg border-[var(--border)] hover:shadow-xl'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] opacity-0 transition-opacity duration-500 ${hoveredValue === idx ? 'opacity-10' : ''}`}></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl mb-6 shadow-lg transition-all duration-500 ${
                    hoveredValue === idx ? 'scale-110 rotate-6' : 'group-hover:scale-105'
                  }`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-[var(--text-primary)]">{value.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-lg">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}