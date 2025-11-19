'use client';

import { AdminPanel } from '@/components/AdminPanel';
import AnimatedBackground from '@/components/AnimatedBackground';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlockchainIcon, InfoIcon, ChartIcon } from '@/components/icons/IconComponents';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import GradientText from '@/components/ui/GradientText';

export default function AdminPage() {
  return (
    <main className="relative min-h-screen p-8 text-gray-900 dark:text-white">
      {/* Animated Background */}
      <AnimatedBackground />
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold mb-6 transition-colors"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Markets
          </Link>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Create and manage prediction markets on the blockchain
          </p>
        </motion.div>

        {/* Admin Panel */}
        <AdminPanel />

        {/* Deployed Smart Contracts */}
        <motion.div
          className="relative mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center backdrop-blur-xl">
              <BlockchainIcon className="text-blue-400" size={24} />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Deployed Smart Contracts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Market Factory Card */}
            <motion.div
              className="group relative bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-500"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <BlockchainIcon className="text-purple-400" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Market Factory</h3>
                </div>

                <div className="p-4 bg-gray-100 dark:bg-black/20 rounded-lg font-mono text-xs text-gray-700 dark:text-gray-300 break-all border border-gray-200 dark:border-white/5">
                  FANZBSDyC6JjQViH5aXiuVqg2gsEJQZRSMdVGWnTn5zz
                </div>

                <a
                  href="https://explorer.solana.com/address/FANZBSDyC6JjQViH5aXiuVqg2gsEJQZRSMdVGWnTn5zz?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors group/link"
                >
                  <span className="text-sm font-semibold">View on Solana Explorer</span>
                  <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>

                <div className="pt-4 border-t border-gray-200 dark:border-white/5 space-y-2 text-sm text-gray-700 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    <span>Creates prediction markets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    <span>Closes betting periods</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    <span>Resolves outcomes</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Betting Pool Card */}
            <motion.div
              className="group relative bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-500"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <BlockchainIcon className="text-blue-400" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Betting Pool</h3>
                </div>

                <div className="p-4 bg-gray-100 dark:bg-black/20 rounded-lg font-mono text-xs text-gray-700 dark:text-gray-300 break-all border border-gray-200 dark:border-white/5">
                  52a6eQd5ocZUnjudnFHuaqVSNHGQ9jzvFKiDgD9qvu2e
                </div>

                <a
                  href="https://explorer.solana.com/address/52a6eQd5ocZUnjudnFHuaqVSNHGQ9jzvFKiDgD9qvu2e?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group/link"
                >
                  <span className="text-sm font-semibold">View on Solana Explorer</span>
                  <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>

                <div className="pt-4 border-t border-gray-200 dark:border-white/5 space-y-2 text-sm text-gray-700 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    <span>Accepts USDC bets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    <span>Calculates payouts (3% fee)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    <span>Distributes winnings</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="group bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider mb-3">
              <ChartIcon size={14} className="text-emerald-400" />
              Program Size
            </div>
            <GradientText preset="emerald" className="text-3xl font-bold">
              <AnimatedCounter value={526} suffix="KB" duration={2} />
            </GradientText>
          </div>

          <div className="group bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider mb-3">
              <InfoIcon size={14} className="text-blue-400" />
              Network
            </div>
            <div className="text-3xl font-bold">
              <GradientText preset="blue">Devnet</GradientText>
            </div>
          </div>

          <div className="group bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider mb-3">
              <InfoIcon size={14} className="text-purple-400" />
              Gas Fees
            </div>
            <GradientText preset="purple" className="text-3xl font-bold">
              <AnimatedCounter value={0.0005} decimals={4} prefix="$" duration={2} />
            </GradientText>
          </div>

          <div className="group bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:border-pink-500/30 transition-all duration-300">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider mb-3">
              <InfoIcon size={14} className="text-pink-400" />
              Platform Fee
            </div>
            <GradientText preset="cosmic" className="text-3xl font-bold">
              <AnimatedCounter value={3} suffix="%" duration={2} />
            </GradientText>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
