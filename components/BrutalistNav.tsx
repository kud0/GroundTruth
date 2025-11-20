'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function BrutalistNav() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <nav>
      <a href="/" className="nav-corner tl hover-trigger">
        <span className="mono text-xs" style={{ color: 'var(--accent)' }}>
          /// 0x1
        </span>
        <br />
        GROUND TRUTH
      </a>

      <div className="nav-corner tr">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="theme-switch hover-trigger"
        >
          {isDark ? '● LIGHT MODE' : '○ DARK MODE'}
        </button>
        <a href="/markets" className="text-right hover-trigger">
          <span className="mono text-xs" style={{ color: 'var(--text-dim)' }}>
            STATUS
          </span>
          <br />
          LIVE MARKETS
        </a>
      </div>

      <div className="nav-corner bl hover-trigger">
        <span className="mono text-xs" style={{ color: 'var(--text-dim)' }}>
          SCROLL
        </span>
        <br />↓
      </div>

      <div className="nav-corner br hover-trigger">
        <span className="mono text-xs" style={{ color: 'var(--text-dim)' }}>
          BLOCKCHAIN
        </span>
        <br />
        SOLANA VERIFIED
      </div>
    </nav>
  );
}
