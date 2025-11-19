'use client';

import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import AnimatedBackground from '@/components/AnimatedBackground';
import GradientText from '@/components/ui/GradientText';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import MagneticButton from '@/components/ui/MagneticButton';
import TiltCard from '@/components/ui/TiltCard';
import { motion } from 'framer-motion';
import { BrainIcon, BlockchainIcon, DiamondIcon, LightningIcon, TargetIcon, RocketIcon, ChartIcon, ShieldIcon, LockIcon, CheckCircleIcon } from '@/components/icons/IconComponents';
import McKinseyProblem from '@/components/sections/McKinseyProblem';
import DepartmentalInsights from '@/components/sections/DepartmentalInsights';
import UseCases from '@/components/sections/UseCases';
import HowItWorksDetailed from '@/components/sections/HowItWorksDetailed';
import Pricing from '@/components/sections/Pricing';
import MarketsPreview from '@/components/sections/MarketsPreview';

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
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Powered by Solana</span>
            </motion.div>

            {/* Main Headline with Gradient Text */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <GradientText
                  as="div"
                  preset="cosmic"
                  className="block"
                  speed="slow"
                >
                  What Your Employees Really Know
                </GradientText>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Validate strategic decisions with blockchain-verified employee forecasts.
              Replace $500K consultant bias with $15K mathematical truth.
            </motion.p>

            {/* Secondary Description */}
            <motion.p variants={fadeInUp} className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              Used by agencies and enterprises to surface organizational intelligence before expensive mistakes are made.
            </motion.p>

            {/* CTA Buttons with Magnetic Effect */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <MagneticButton
                variant="primary"
                size="lg"
                glowIntensity="high"
                onClick={() => window.location.href = '#how-it-works'}
              >
                <span>See How It Works</span>
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </MagneticButton>
              <MagneticButton
                variant="secondary"
                size="lg"
                onClick={() => window.location.href = '/markets'}
              >
                <ChartIcon className="mr-2" size={20} />
                <span>View Live Markets</span>
              </MagneticButton>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">87%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Forecast Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">60-80%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Participation Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">$1.2M</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Costs Saved</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Markets Resolved</div>
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

      {/* McKinsey Problem - NEW */}
      <McKinseyProblem />

      {/* Markets Preview - Show active markets as proof */}
      <MarketsPreview />

      {/* Departmental Insights - NEW */}
      <DepartmentalInsights />

      {/* Use Cases - NEW */}
      <UseCases />

      {/* How It Works Detailed - NEW */}
      <HowItWorksDetailed />

      {/* Pricing - NEW */}
      <Pricing />

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
              <TiltCard className="h-full" tiltIntensity={4}>
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
              <TiltCard className="h-full" tiltIntensity={4}>
                <div className="p-8 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center mb-6">
                    <BlockchainIcon className="text-blue-400" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Cryptographically Verified</h3>
                  <p className="text-gray-700 dark:text-gray-400 leading-relaxed flex-grow">
                    Blockchain-verified results with instant settlement. Every prediction is tamper-proof and permanently recorded.
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
              <TiltCard className="h-full" tiltIntensity={4}>
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

      {/* Social Proof Section */}
      <section className="relative py-32 bg-gradient-to-b from-purple-50/30 to-white dark:from-transparent dark:to-transparent overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-block px-4 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              Proven Results
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold">
              <GradientText preset="cosmic" as="span">
                Trusted by Forward-Thinking Organizations
              </GradientText>
            </motion.h2>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid md:grid-cols-4 gap-8 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              { value: '10,000+', label: 'Predictions Made' },
              { value: '87%', label: 'Average Accuracy' },
              { value: '$2.5M', label: 'Costs Saved' },
              { value: '50+', label: 'Markets Resolved' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                <div className="text-5xl font-bold mb-2">
                  <GradientText preset="emerald">{stat.value}</GradientText>
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 py-8 border-t border-b border-gray-200 dark:border-gray-700"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <ShieldIcon className="text-emerald-500" size={24} />
              <span className="font-medium">Blockchain Verified</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <LockIcon className="text-blue-500" size={24} />
              <span className="font-medium">100% Anonymous</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <CheckCircleIcon className="text-purple-500" size={24} />
              <span className="font-medium">SOC 2 Compliant</span>
            </div>
          </motion.div>
        </div>
      </section>

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
            <MagneticButton
              variant="primary"
              size="lg"
              glowIntensity="high"
              onClick={() => window.location.href = '#pilot'}
            >
              <TargetIcon className="mr-2" size={20} />
              <span>Request Pilot</span>
            </MagneticButton>
            <ConnectWalletButton />
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
