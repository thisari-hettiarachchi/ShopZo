export default function StatsSection({ stats, CountUp, hoveredStat, setHoveredStat }) {
  return (
    <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredStat(idx)}
            onMouseLeave={() => setHoveredStat(null)}
            className={`relative p-8 rounded-2xl text-center transition-all duration-500 ease-out cursor-pointer group overflow-hidden bg-[var(--bg-card)] ${
              hoveredStat === idx
                ? "shadow-2xl -translate-y-3 scale-105 border-2 border-[var(--color-primary)]"
                : "shadow-xl border-2 border-transparent hover:shadow-2xl"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] opacity-0 transition-opacity duration-500 ${hoveredStat === idx ? "opacity-10" : ""}`} />

            <stat.icon
              className={`w-14 h-14 mx-auto mb-5 transition-all duration-500 text-[var(--color-primary)] ${
                hoveredStat === idx ? "scale-125 rotate-12 drop-shadow-lg" : "group-hover:scale-110"
              }`}
            />
            <div className="text-5xl font-black mb-3 text-[var(--color-primary)]">
              <CountUp end={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}