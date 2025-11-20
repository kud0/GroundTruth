'use client';

import { AdminPanel } from '@/components/AdminPanel';
import { CustomCursor } from '@/components/CustomCursor';
import { Scanline } from '@/components/Scanline';
import { ThreeBackground } from '@/components/ThreeBackground';
import { BrutalistNav } from '@/components/BrutalistNav';

export default function AdminPage() {
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
              /// ADMIN PANEL
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-color)' }}>
              CREATE
              <br />
              MARKET
            </h1>
            <p className="text-xl max-w-2xl" style={{ color: 'var(--text-dim)' }}>
              Deploy a new prediction market to the Solana blockchain
            </p>
          </div>
        </section>

        {/* Admin Panel */}
        <section className="relative py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <AdminPanel />
          </div>
        </section>

        {/* Deployed Smart Contracts */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="mono text-xs mb-4" style={{ color: 'var(--secondary)' }}>
                /// BLOCKCHAIN INFRASTRUCTURE
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-color)' }}>
                DEPLOYED CONTRACTS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Market Factory Card */}
              <div className="data-card hover-trigger">
                <div className="flex items-center gap-3 mb-6">
                  <div className="mono text-xs px-3 py-1 border" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                    FACTORY
                  </div>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-color)' }}>
                    Market Factory
                  </h3>
                </div>

                <div className="mb-6 p-4 mono text-xs border" style={{
                  borderColor: 'var(--card-border)',
                  background: 'rgba(0,0,0,0.1)',
                  color: 'var(--text-color)',
                  wordBreak: 'break-all'
                }}>
                  FANZBSDyC6JjQViH5aXiuVqg2gsEJQZRSMdVGWnTn5zz
                </div>

                <a
                  href="https://explorer.solana.com/address/FANZBSDyC6JjQViH5aXiuVqg2gsEJQZRSMdVGWnTn5zz?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mono text-xs px-6 py-3 border hover-trigger transition-all hover:bg-[var(--accent)] hover:text-white mb-6"
                  style={{ borderColor: 'var(--text-color)', color: 'var(--text-color)' }}
                >
                  VIEW ON EXPLORER →
                </a>

                <div className="space-y-3 pt-6 border-t" style={{ borderColor: 'var(--card-border)' }}>
                  <div className="flex items-center gap-2 mono text-xs" style={{ color: 'var(--text-dim)' }}>
                    <div className="w-1 h-1" style={{ backgroundColor: 'var(--accent)' }}></div>
                    Creates prediction markets
                  </div>
                  <div className="flex items-center gap-2 mono text-xs" style={{ color: 'var(--text-dim)' }}>
                    <div className="w-1 h-1" style={{ backgroundColor: 'var(--accent)' }}></div>
                    Closes betting periods
                  </div>
                  <div className="flex items-center gap-2 mono text-xs" style={{ color: 'var(--text-dim)' }}>
                    <div className="w-1 h-1" style={{ backgroundColor: 'var(--accent)' }}></div>
                    Resolves outcomes
                  </div>
                </div>
              </div>

              {/* Betting Pool Card */}
              <div className="data-card hover-trigger">
                <div className="flex items-center gap-3 mb-6">
                  <div className="mono text-xs px-3 py-1 border" style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>
                    POOL
                  </div>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-color)' }}>
                    Betting Pool
                  </h3>
                </div>

                <div className="mb-6 p-4 mono text-xs border" style={{
                  borderColor: 'var(--card-border)',
                  background: 'rgba(0,0,0,0.1)',
                  color: 'var(--text-color)',
                  wordBreak: 'break-all'
                }}>
                  52a6eQd5ocZUnjudnFHuaqVSNHGQ9jzvFKiDgD9qvu2e
                </div>

                <a
                  href="https://explorer.solana.com/address/52a6eQd5ocZUnjudnFHuaqVSNHGQ9jzvFKiDgD9qvu2e?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mono text-xs px-6 py-3 border hover-trigger transition-all hover:bg-[var(--secondary)] hover:text-white mb-6"
                  style={{ borderColor: 'var(--text-color)', color: 'var(--text-color)' }}
                >
                  VIEW ON EXPLORER →
                </a>

                <div className="space-y-3 pt-6 border-t" style={{ borderColor: 'var(--card-border)' }}>
                  <div className="flex items-center gap-2 mono text-xs" style={{ color: 'var(--text-dim)' }}>
                    <div className="w-1 h-1" style={{ backgroundColor: 'var(--secondary)' }}></div>
                    Accepts USDC bets
                  </div>
                  <div className="flex items-center gap-2 mono text-xs" style={{ color: 'var(--text-dim)' }}>
                    <div className="w-1 h-1" style={{ backgroundColor: 'var(--secondary)' }}></div>
                    Calculates payouts (3% fee)
                  </div>
                  <div className="flex items-center gap-2 mono text-xs" style={{ color: 'var(--text-dim)' }}>
                    <div className="w-1 h-1" style={{ backgroundColor: 'var(--secondary)' }}></div>
                    Distributes winnings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: 'var(--card-border)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Program Size */}
              <div className="text-center">
                <div className="text-4xl font-bold mono mb-2" style={{ color: 'var(--accent)' }}>
                  526KB
                </div>
                <div className="mono text-xs" style={{ color: 'var(--text-dim)' }}>
                  PROGRAM SIZE
                </div>
              </div>

              {/* Network */}
              <div className="text-center">
                <div className="text-4xl font-bold mono mb-2" style={{ color: 'var(--secondary)' }}>
                  DEVNET
                </div>
                <div className="mono text-xs" style={{ color: 'var(--text-dim)' }}>
                  NETWORK
                </div>
              </div>

              {/* Gas Fees */}
              <div className="text-center">
                <div className="text-4xl font-bold mono mb-2" style={{ color: 'var(--accent)' }}>
                  $0.0005
                </div>
                <div className="mono text-xs" style={{ color: 'var(--text-dim)' }}>
                  GAS FEES
                </div>
              </div>

              {/* Platform Fee */}
              <div className="text-center">
                <div className="text-4xl font-bold mono mb-2" style={{ color: 'var(--accent)' }}>
                  3%
                </div>
                <div className="mono text-xs" style={{ color: 'var(--text-dim)' }}>
                  PLATFORM FEE
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
