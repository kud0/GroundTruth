'use client';

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="relative z-10 flex flex-col items-center">
        <p
          className="mono mb-4 tracking-widest text-xs md:text-sm"
          style={{ color: 'var(--accent)' }}
        >
          COLLECTIVE INTELLIGENCE PLATFORM
        </p>
        <h1 className="hero-title glitch-text" data-text="GROUND TRUTH">
          GROUND
          <br />
          TRUTH
        </h1>

        <div className="mt-16 max-w-2xl text-center px-6 space-y-6">
          <p className="text-xl md:text-2xl font-light leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            McKinsey tells you what they think.
          </p>
          <p className="text-xl md:text-2xl font-bold leading-relaxed" style={{ color: 'var(--text-color)' }}>
            We show you what your employees know.
          </p>
        </div>

        <div
          className="absolute bottom-10 flex gap-10 mono text-xs"
          style={{ color: 'var(--text-dim)' }}
        >
          <div>ACCURACY: 87%</div>
          <div>COST: -95%</div>
          <div>DAO: ACTIVE</div>
        </div>
      </div>
    </section>
  );
}
