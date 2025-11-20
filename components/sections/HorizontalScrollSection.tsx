'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function HorizontalScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    // Only enable horizontal scroll on desktop (768px and above)
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    let scrollTween: gsap.core.Tween | null = null;

    const setupScrollTrigger = () => {
      if (mediaQuery.matches) {
        const horSection = sectionRef.current;
        const horContainer = containerRef.current;

        if (!horSection || !horContainer) return;

        scrollTween = gsap.to(horContainer, {
          x: () => -(horContainer.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: horSection,
            pin: true,
            scrub: 1,
            end: () => '+=' + horContainer.scrollWidth,
          },
        });
      }
    };

    setupScrollTrigger();

    return () => {
      if (scrollTween) scrollTween.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="horizontal-scroll" className="horizontal-wrapper">
      <div ref={containerRef} className="horizontal-container md:flex md:flex-nowrap flex-col md:flex-row">
        {/* Panel 1 - The Bias */}
        <div className="panel">
          <div className="absolute top-10 right-10 mono text-6xl opacity-10">01</div>
          <h2 className="text-6xl mb-8">THE BIAS</h2>
          <div className="w-full md:w-1/2 data-card group">
            <div className="mono text-xs mb-2" style={{ color: 'var(--error)' }}>
              TRADITIONAL MODEL
            </div>
            <h3 className="text-3xl font-bold mb-4">$500K / Project</h3>
            <p style={{ color: 'var(--text-dim)' }}>
              Based on consultant opinion. No skin in the game. Biased by who signs the
              check.
            </p>
          </div>
        </div>

        {/* Panel 2 - The Signal */}
        <div className="panel" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
          <div className="absolute top-10 right-10 mono text-6xl opacity-10">02</div>
          <h2 className="text-6xl mb-8">THE SIGNAL</h2>
          <div className="w-full md:w-1/2 data-card">
            <div className="mono text-xs mb-2" style={{ color: 'var(--accent)' }}>
              SKIN IN THE GAME
            </div>
            <h3 className="text-3xl font-bold mb-4">USDC Betting</h3>
            <p style={{ color: 'var(--text-dim)' }}>
              Your team bets real money on outcomes. Engineering sees blockers. Sales sees
              demand. The market aggregation reveals the{' '}
              <span style={{ color: 'var(--accent)' }}>Truth</span>.
            </p>
          </div>
        </div>

        {/* Panel 3 - Departmental Intelligence */}
        <div className="panel">
          <div className="absolute top-10 right-10 mono text-6xl opacity-10">03</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
            <div>
              <h2 className="text-5xl mb-4">
                DEPARTMENTAL
                <br />
                INTELLIGENCE
              </h2>
              <p style={{ color: 'var(--text-dim)' }}>Will we launch on time?</p>
            </div>
            <div className="space-y-3 mono text-sm">
              {/* Marketing Bar */}
              <div
                className="w-full p-3 border"
                style={{
                  background: 'rgba(0,0,0,0.1)',
                  borderColor: 'var(--card-border)',
                }}
              >
                <div className="flex justify-between mb-2">
                  <span>MARKETING</span>{' '}
                  <span style={{ color: 'var(--accent)' }}>92% YES</span>
                </div>
                <div className="w-full h-1 bg-gray-700">
                  <div
                    className="h-full"
                    style={{ backgroundColor: 'var(--accent)', width: '92%' }}
                  />
                </div>
              </div>

              {/* Sales Bar */}
              <div
                className="w-full p-3 border"
                style={{
                  background: 'rgba(0,0,0,0.1)',
                  borderColor: 'var(--card-border)',
                }}
              >
                <div className="flex justify-between mb-2">
                  <span>SALES</span>{' '}
                  <span style={{ color: 'var(--accent)' }}>78% YES</span>
                </div>
                <div className="w-full h-1 bg-gray-700">
                  <div
                    className="h-full"
                    style={{ backgroundColor: 'var(--accent)', width: '78%' }}
                  />
                </div>
              </div>

              {/* Product Bar */}
              <div
                className="w-full p-3 border"
                style={{
                  background: 'rgba(0,0,0,0.1)',
                  borderColor: 'var(--card-border)',
                }}
              >
                <div className="flex justify-between mb-2">
                  <span>PRODUCT</span>{' '}
                  <span style={{ color: '#fbbf24' }}>54% YES</span>
                </div>
                <div className="w-full h-1 bg-gray-700">
                  <div
                    className="h-full"
                    style={{ backgroundColor: '#fbbf24', width: '54%' }}
                  />
                </div>
              </div>

              {/* Engineering Bar */}
              <div
                className="w-full p-3 border"
                style={{
                  background: 'rgba(0,0,0,0.1)',
                  borderColor: 'var(--card-border)',
                }}
              >
                <div className="flex justify-between mb-2">
                  <span>ENGINEERING</span>{' '}
                  <span style={{ color: 'var(--error)' }}>28% YES</span>
                </div>
                <div className="w-full h-1 bg-gray-700">
                  <div
                    className="h-full"
                    style={{ backgroundColor: 'var(--error)', width: '28%' }}
                  />
                </div>
              </div>

              {/* Operations Bar */}
              <div
                className="w-full p-3 border"
                style={{
                  background: 'rgba(0,0,0,0.1)',
                  borderColor: 'var(--card-border)',
                }}
              >
                <div className="flex justify-between mb-2">
                  <span>OPERATIONS</span>{' '}
                  <span style={{ color: '#fbbf24' }}>65% YES</span>
                </div>
                <div className="w-full h-1 bg-gray-700">
                  <div
                    className="h-full"
                    style={{ backgroundColor: '#fbbf24', width: '65%' }}
                  />
                </div>
              </div>

              {/* Finance Bar */}
              <div
                className="w-full p-3 border"
                style={{
                  background: 'rgba(0,0,0,0.1)',
                  borderColor: 'var(--card-border)',
                }}
              >
                <div className="flex justify-between mb-2">
                  <span>FINANCE</span>{' '}
                  <span style={{ color: 'var(--error)' }}>41% YES</span>
                </div>
                <div className="w-full h-1 bg-gray-700">
                  <div
                    className="h-full"
                    style={{ backgroundColor: 'var(--error)', width: '41%' }}
                  />
                </div>
              </div>

              <div className="text-xs pt-2" style={{ color: 'var(--text-dim)' }}>
                CRITICAL INSIGHT: EXECUTION RISK DETECTED
              </div>
            </div>
          </div>
        </div>

        {/* Panel 4 - CTA */}
        <div className="panel items-center justify-center">
          <div className="text-center">
            <p className="mono mb-4" style={{ color: 'var(--accent)' }}>
              BLOCKCHAIN VERIFIED
            </p>
            <h2 className="text-[8vw] leading-none hover-trigger cursor-pointer transition-all hover:text-[var(--accent)]">
              START
              <br />
              PREDICTING
            </h2>
            <a
              href="#"
              className="inline-block mt-10 px-8 py-4 border hover:bg-[var(--accent)] hover:text-white transition-all mono"
              style={{ borderColor: 'var(--text-color)', color: 'var(--text-color)' }}
            >
              BOOK DEMO -&gt;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
