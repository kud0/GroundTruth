'use client';

import { useState } from 'react';
import { BettingCard } from '@/components/BettingCard';
import { useMarkets } from '@/hooks/useMarkets';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { CustomCursor } from '@/components/CustomCursor';
import { Scanline } from '@/components/Scanline';
import { ThreeBackground } from '@/components/ThreeBackground';
import { BrutalistNav } from '@/components/BrutalistNav';

export default function MarketsPage() {
  const { markets, loading, error } = useMarkets();

  return (
    <>
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Scanline Effect */}
      <Scanline />

      {/* Three.js Background */}
      <ThreeBackground />

      {/* Navigation */}
      <BrutalistNav />

      {/* Main Content */}
      <main className="relative min-h-screen" style={{ paddingTop: '120px' }}>
        {/* Page Header */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4 mono text-xs" style={{ color: 'var(--accent)' }}>
              /// LIVE MARKETS
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-color)' }}>
              ACTIVE
              <br />
              MARKETS
            </h1>
            <p className="text-xl max-w-2xl" style={{ color: 'var(--text-dim)' }}>
              Real-time prediction markets where your team's insights become value
            </p>

            {/* Connect Wallet CTA */}
            <div className="mt-8 flex items-center gap-6">
              <ConnectWalletButton />
              <div className="mono text-xs" style={{ color: 'var(--text-dim)' }}>
                BLOCKCHAIN: SOLANA
              </div>
            </div>
          </div>
        </section>

        {/* Markets Grid */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {loading && (
              <div className="text-center py-20">
                <div className="mono text-xs mb-4" style={{ color: 'var(--accent)' }}>
                  LOADING ORACLE DATA
                </div>
                <div className="inline-flex items-center gap-3" style={{ color: 'var(--text-dim)' }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }}></div>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)', animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)', animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}

            {error && (
              <div className="max-w-2xl mx-auto">
                <div className="data-card">
                  <div className="mono text-xs mb-2" style={{ color: 'var(--error)' }}>
                    ERROR
                  </div>
                  <p style={{ color: 'var(--text-color)' }}>{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && markets.length === 0 && (
              <div className="max-w-3xl mx-auto text-center py-20">
                <div className="data-card">
                  <div className="mono text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
                    NO ACTIVE MARKETS
                  </div>
                  <h3 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-color)' }}>
                    AWAITING FIRST ORACLE
                  </h3>
                  <p className="text-lg mb-8" style={{ color: 'var(--text-dim)' }}>
                    Be the first to create a prediction market and harness your team's collective intelligence
                  </p>
                  <a
                    href="/admin"
                    className="inline-block mono text-xs px-8 py-4 border hover-trigger transition-all hover:bg-[var(--accent)] hover:text-white"
                    style={{ borderColor: 'var(--text-color)', color: 'var(--text-color)' }}
                  >
                    CREATE MARKET →
                  </a>
                </div>
              </div>
            )}

            {!loading && !error && markets.length > 0 && (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {markets.map((market, index) => (
                    <div key={market.publicKey} className="hover-trigger">
                      <BettingCard market={market} />
                    </div>
                  ))}
                </div>

                {/* Market Stats */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mono mb-2" style={{ color: 'var(--accent)' }}>
                      {markets.length}
                    </div>
                    <div className="mono text-xs" style={{ color: 'var(--text-dim)' }}>
                      ACTIVE MARKETS
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mono mb-2" style={{ color: 'var(--accent)' }}>
                      {markets.filter(m => m.status === 'open').length}
                    </div>
                    <div className="mono text-xs" style={{ color: 'var(--text-dim)' }}>
                      OPEN FOR BETTING
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mono mb-2" style={{ color: 'var(--accent)' }}>
                      87%
                    </div>
                    <div className="mono text-xs" style={{ color: 'var(--text-dim)' }}>
                      ACCURACY RATE
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mono mb-2" style={{ color: 'var(--accent)' }}>
                      ON-CHAIN
                    </div>
                    <div className="mono text-xs" style={{ color: 'var(--text-dim)' }}>
                      VERIFIED TRUTH
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative py-32 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: 'var(--card-border)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="mono text-xs mb-6" style={{ color: 'var(--secondary)' }}>
              /// CREATE YOUR ORACLE
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-color)' }}>
              LAUNCH YOUR
              <br />
              MARKET
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-dim)' }}>
              Create a prediction market for your organization and tap into collective intelligence
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/admin"
                className="inline-block mono text-xs px-8 py-4 border hover-trigger transition-all hover:bg-[var(--accent)] hover:text-white"
                style={{ borderColor: 'var(--text-color)', color: 'var(--text-color)' }}
              >
                CREATE MARKET →
              </a>
              <ConnectWalletButton />
            </div>

            <div className="mt-12 mono text-xs flex items-center justify-center gap-6" style={{ color: 'var(--text-dim)' }}>
              <span>SOLANA VERIFIED</span>
              <span>•</span>
              <span>100% TRANSPARENT</span>
              <span>•</span>
              <span>INSTANT SETTLEMENT</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
