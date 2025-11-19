'use client';

import { BettingCard } from '@/components/BettingCard';
import { SimulationDemo } from '@/components/SimulationDemo';
import { GetUSDCBanner } from '@/components/GetUSDCBanner';
import { USDCHelper } from '@/components/USDCHelper';
import { useMarkets } from '@/hooks/useMarkets';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import AnimatedBackground from '@/components/AnimatedBackground';
import GradientText from '@/components/ui/GradientText';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import MagneticButton from '@/components/ui/MagneticButton';
import TiltCard from '@/components/ui/TiltCard';
import { motion } from 'framer-motion';
import { BrainIcon, BlockchainIcon, DiamondIcon, LightningIcon, TargetIcon, RocketIcon, ChartIcon } from '@/components/icons/IconComponents';

// Animation variants
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

export default function Home() {
  const { markets, loading, error } = useMarkets();

  return (
    <main className="relative min-h-screen text-gray-900 dark:text-white">
      {/* Animated Background with moving orbs and particles */}
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            className="text-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Status Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live on Solana Devnet</span>
            </motion.div>

            {/* Main Headline with Gradient Text */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight">
                <GradientText
                  as="div"
                  preset="cosmic"
                  className="block mb-4"
                  speed="slow"
                >
                  Collective
                </GradientText>
                <GradientText
                  as="div"
                  preset="rainbow"
                  className="block"
                  speed="normal"
                >
                  Intelligence
                </GradientText>
              </h1>
              <div className="flex items-center justify-center gap-4 text-xl md:text-2xl text-gray-600 dark:text-gray-400">
                <span>Powered by</span>
                <GradientText preset="purple" className="font-mono">
                  Blockchain
                </GradientText>
              </div>
            </motion.div>

            {/* Subheadline */}
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
              Harness your team's wisdom through on-chain prediction markets.
              <br className="hidden md:block" />
              Real stakes. Real transparency. Real results.
            </motion.p>

            {/* CTA Buttons with Magnetic Effect */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <ConnectWalletButton />
              <MagneticButton
                variant="secondary"
                size="lg"
                glowIntensity="high"
                onClick={() => window.location.href = '/admin'}
              >
                <LightningIcon className="mr-2" size={20} />
                <span>Launch Dashboard</span>
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </MagneticButton>
            </motion.div>

            {/* Metrics with Animated Counters */}
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-16">
              <div className="group cursor-default">
                <GradientText
                  as="div"
                  preset="purple"
                  className="text-4xl md:text-5xl font-bold"
                >
                  <AnimatedCounter
                    value={0.001}
                    decimals={3}
                    prefix="<$"
                    duration={2}
                    delay={0.2}
                  />
                </GradientText>
                <div className="text-sm text-gray-700 dark:text-gray-500 mt-2 font-medium">Transaction Cost</div>
              </div>
              <div className="group cursor-default">
                <GradientText
                  as="div"
                  preset="blue"
                  className="text-4xl md:text-5xl font-bold"
                >
                  <AnimatedCounter
                    value={3}
                    suffix="%"
                    duration={2}
                    delay={0.4}
                  />
                </GradientText>
                <div className="text-sm text-gray-700 dark:text-gray-500 mt-2 font-medium">Platform Fee</div>
              </div>
              <div className="group cursor-default">
                <GradientText
                  as="div"
                  preset="emerald"
                  className="text-4xl md:text-5xl font-bold"
                >
                  <AnimatedCounter
                    value={100}
                    suffix="%"
                    duration={2}
                    delay={0.6}
                  />
                </GradientText>
                <div className="text-sm text-gray-700 dark:text-gray-500 mt-2 font-medium">On-Chain</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="w-6 h-10 border-2 border-gray-300 dark:border-white/20 rounded-full flex items-start justify-center p-2 animate-bounce">
            <div className="w-1 h-3 bg-gray-400 dark:bg-white/40 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section with Tilt Cards */}
      <section className="relative py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-block px-4 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              Why choose us
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold">
              <GradientText preset="cosmic" as="span">
                Built for the future
              </GradientText>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
              Enterprise-grade prediction markets powered by blockchain technology
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Feature 1 - Tilt Card */}
            <motion.div variants={fadeInUp}>
              <TiltCard className="h-full" tiltIntensity={10}>
                <div className="p-8 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center mb-6">
                    <BrainIcon className="text-purple-400" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Collective Intelligence</h3>
                  <p className="text-gray-700 dark:text-gray-400 leading-relaxed flex-grow">
                    Aggregate your team's insights into actionable predictions. The wisdom of crowds beats individual experts.
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium">
                    <GradientText preset="purple">
                      Learn more
                    </GradientText>
                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Feature 2 - Tilt Card */}
            <motion.div variants={fadeInUp}>
              <TiltCard className="h-full" tiltIntensity={10}>
                <div className="p-8 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center mb-6">
                    <BlockchainIcon className="text-blue-400" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Blockchain Native</h3>
                  <p className="text-gray-700 dark:text-gray-400 leading-relaxed flex-grow">
                    Built on Solana for sub-second finality and pennies in fees. Every transaction is cryptographically verified.
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium">
                    <GradientText preset="blue">
                      Explore tech
                    </GradientText>
                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Feature 3 - Tilt Card */}
            <motion.div variants={fadeInUp}>
              <TiltCard className="h-full" tiltIntensity={10}>
                <div className="p-8 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center mb-6">
                    <DiamondIcon className="text-emerald-400" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Skin in the Game</h3>
                  <p className="text-gray-700 dark:text-gray-400 leading-relaxed flex-grow">
                    Real USDC stakes ensure genuine conviction. When money's on the line, predictions become more thoughtful.
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium">
                    <GradientText preset="emerald">
                      See how
                    </GradientText>
                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Active Markets Section */}
      <section id="markets" className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-block px-4 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              Active now
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold">
              <GradientText preset="rainbow" as="span">
                Live Markets
              </GradientText>
            </motion.h2>
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
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600 dark:text-gray-400">Loading markets from blockchain...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            </motion.div>
          )}

          {!loading && !error && markets.length === 0 && (
            <motion.div
              className="text-center py-16 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10"
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
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
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

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-32 bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-transparent dark:via-transparent dark:to-transparent overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-block px-4 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              Getting started
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold">
              <GradientText preset="cyber" as="span">
                Three steps to insight
              </GradientText>
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              { num: '01', Icon: DiamondIcon, title: 'Connect', desc: 'Link your Phantom wallet to access the platform securely', gradient: 'purple' as const },
              { num: '02', Icon: LightningIcon, title: 'Stake', desc: 'Place USDC bets on outcomes you believe in', gradient: 'blue' as const },
              { num: '03', Icon: TargetIcon, title: 'Earn', desc: 'Winners split the pool when markets resolve', gradient: 'emerald' as const }
            ].map((step) => (
              <motion.div key={step.num} className="text-center group" variants={fadeInUp}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <step.Icon className="text-gray-900 dark:text-white" size={32} />
                </div>
                <GradientText preset={step.gradient as any} className="text-sm font-mono mb-2 block">
                  {step.num}
                </GradientText>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 via-transparent to-transparent"></div>

        <motion.div
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold">
            <GradientText preset="rainbow" as="span" speed="slow">
              Start predicting today
            </GradientText>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Join the future of decision-making where collective intelligence meets blockchain transparency
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <ConnectWalletButton />
            <MagneticButton
              variant="primary"
              size="lg"
              glowIntensity="high"
              onClick={() => window.location.href = '/admin'}
            >
              <LightningIcon className="mr-2" size={20} />
              <span>Launch Platform</span>
            </MagneticButton>
          </motion.div>

          <motion.div variants={fadeInUp} className="pt-16 space-y-4">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-500">
              <span>Solana Blockchain</span>
              <span>•</span>
              <span>Smart Contracts</span>
              <span>•</span>
              <span>100% Transparent</span>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
