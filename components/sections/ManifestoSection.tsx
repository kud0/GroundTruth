'use client';

export function ManifestoSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-32 relative z-10">
      <div className="max-w-5xl">
        <div className="mono mb-6" style={{ color: 'var(--secondary)' }}>
          /// THE PROBLEM
        </div>
        <p className="display-font text-4xl md:text-6xl font-bold leading-tight reveal-text">
          CONSULTANTS HAVE OPINIONS. <br />
          MARKETS HAVE <span style={{ color: 'var(--accent)' }}>STAKES.</span>
        </p>
        <p
          className="mt-8 text-xl md:text-2xl max-w-2xl"
          style={{ color: 'var(--text-dim)' }}
        >
          Replace $500K consultant bias with $15K mathematical truth. Validate strategic
          decisions with blockchain-verified employee forecasts.
        </p>
      </div>
    </section>
  );
}
