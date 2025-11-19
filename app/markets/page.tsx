'use client';

import { BettingCard } from '@/components/BettingCard';
import { SimulationDemo } from '@/components/SimulationDemo';
import { GetUSDCBanner } from '@/components/GetUSDCBanner';
import { USDCHelper } from '@/components/USDCHelper';
import { useMarkets } from '@/hooks/useMarkets';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import AnimatedBackground from '@/components/AnimatedBackground';
import GradientText from '@/components/ui/GradientText';
import MagneticButton from '@/components/ui/MagneticButton';
import { motion } from 'framer-motion';
import { ChartIcon, RocketIcon } from '@/components/icons/IconComponents';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function MarketsPage() {
  const { markets, loading, error } = useMarkets();

  return (
    <main className="relative min-h-screen text-gray-900 dark:text-white">
      {/* Animated Background with moving orbs and particles */}
      <AnimatedBackground />

      {/* Active Markets Section */}
      <section id="markets" className="relative py-32 pt-44 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16 space-y-4"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-block px-4 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              Active now
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold">
              <GradientText preset="rainbow" as="span">
                Live Markets
              </GradientText>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
              Real-time prediction markets where your team's insights become value
            </motion.p>
          </motion.div>

          {/* USDC Helper */}
          <USDCHelper />

          {/* Get USDC Banner */}
          <GetUSDCBanner />

          {loading && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="inline-flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p>Loading markets from blockchain...</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            </motion.div>
          )}

          {!loading && !error && markets.length === 0 && (
            <motion.div
              className="text-center py-16 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 max-w-3xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ChartIcon className="mx-auto mb-6 text-purple-400" size={80} />
              <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                No Active Markets
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Be the first to create a prediction market and harness your team's collective intelligence!
              </p>
              <MagneticButton
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/admin'}
              >
                <RocketIcon className="mr-2" size={20} />
                Create First Market
              </MagneticButton>
            </motion.div>
          )}

          {!loading && !error && markets.length > 0 && (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {markets.map((market, index) => (
                <motion.div key={market.publicKey} variants={fadeInUp}>
                  <BettingCard market={market} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* AI Simulation Demo */}
      {markets.length > 0 && (
        <SimulationDemo question={markets[0].question} />
      )}

      {/* Bottom CTA */}
      <section className="relative py-32 bg-gradient-to-t from-purple-500/5 via-transparent to-transparent">
        <motion.div
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold">
            <GradientText preset="cosmic" as="span">
              Ready to Create Your Market?
            </GradientText>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Launch a prediction market for your organization and tap into collective intelligence
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <MagneticButton
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/admin'}
            >
              <RocketIcon className="mr-2" size={20} />
              <span>Create Market</span>
            </MagneticButton>
            <ConnectWalletButton />
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
