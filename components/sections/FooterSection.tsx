'use client';

export function FooterSection() {
  return (
    <section
      className="h-[50vh] flex flex-col justify-between p-10 relative"
      style={{ borderTop: '1px solid var(--card-border)' }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <h4 className="mono text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
            PLATFORM
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-color)' }}>
            <li className="hover-trigger">Markets</li>
            <li className="hover-trigger">Agencies</li>
            <li className="hover-trigger">Enterprise</li>
          </ul>
        </div>
        <div>
          <h4 className="mono text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
            COMPANY
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-color)' }}>
            <li className="hover-trigger">About</li>
            <li className="hover-trigger">Blog</li>
            <li className="hover-trigger">Careers</li>
          </ul>
        </div>
        <div>
          <h4 className="mono text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
            RESOURCES
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-color)' }}>
            <li className="hover-trigger">Documentation</li>
            <li className="hover-trigger">API</li>
            <li className="hover-trigger">Support</li>
          </ul>
        </div>
        <div>
          <h4 className="mono text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
            LEGAL
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-color)' }}>
            <li className="hover-trigger">Privacy</li>
            <li className="hover-trigger">Terms</li>
            <li className="hover-trigger">Security</li>
          </ul>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <h1
          className="text-[15vw] leading-none font-[Syne] select-none"
          style={{ color: 'var(--text-color)', opacity: 0.05 }}
        >
          TRUTH
        </h1>
        <div className="text-right mono text-xs" style={{ color: 'var(--text-dim)' }}>
          EST. 2025
          <br />
          ALL RIGHTS RESERVED
        </div>
      </div>
    </section>
  );
}
