'use client';
import { motion } from 'framer-motion';
import GradientText from '@/components/ui/GradientText';
import TiltCard from '@/components/ui/TiltCard';
import { BriefcaseIcon, LightningIcon, DollarIcon, ClockIcon, ThinkingIcon, TrendDownIcon, ShieldIcon, CheckCircleIcon } from '@/components/icons/IconComponents';

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

export default function McKinseyProblem() {
  return (
    <section id="problem" className="relative py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
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
            The Problem
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold">
            <GradientText preset="cosmic" as="span">
              Why Consultants Get It Wrong 70% of the Time
            </GradientText>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Your employees have the answers. Consultants have opinions.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* McKinsey Column */}
          <motion.div variants={fadeInUp}>
            <TiltCard className="h-full" tiltIntensity={4}>
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/20 flex items-center justify-center">
                    <BriefcaseIcon className="text-red-400" size={28} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">McKinsey</h3>
                </div>
                <ul className="space-y-6 flex-grow">
                  <ComparisonItem icon={<DollarIcon size={24} />} text="$200K-$500K per project" />
                  <ComparisonItem icon={<ClockIcon size={24} />} text="6-12 week timeline" />
                  <ComparisonItem icon={<ThinkingIcon size={24} />} text="Based on consultant opinion" />
                  <ComparisonItem icon={<TrendDownIcon size={24} />} text="70% fail to implement" />
                  <ComparisonItem icon={<ShieldIcon size={24} />} text="No skin in the game" />
                  <ComparisonItem icon={<BriefcaseIcon size={24} />} text="Biased by who pays them" />
                </ul>
              </div>
            </TiltCard>
          </motion.div>

          {/* GroundTruth Column */}
          <motion.div variants={fadeInUp}>
            <TiltCard className="h-full" tiltIntensity={4}>
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center">
                    <LightningIcon className="text-emerald-400" size={28} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">GroundTruth</h3>
                </div>
                <ul className="space-y-6 flex-grow">
                  <ComparisonItem icon={<DollarIcon size={24} />} text="$15K per project" positive />
                  <ComparisonItem icon={<LightningIcon size={24} />} text="Results in 30 days" positive />
                  <ComparisonItem icon={<DollarIcon size={24} />} text="Based on employee stakes" positive />
                  <ComparisonItem icon={<TrendUpIcon size={24} />} text="60-80% employee buy-in" positive />
                  <ComparisonItem icon={<TargetIcon size={24} />} text="Real money = real signals" positive />
                  <ComparisonItem icon={<ShieldIcon size={24} />} text="Anonymous + blockchain-verified" positive />
                </ul>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>

        {/* Bottom Line */}
        <motion.div
          className="mt-16 text-center space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            The Bottom Line:
          </p>
          <p className="text-3xl md:text-4xl font-bold">
            <span className="text-gray-600 dark:text-gray-400">McKinsey tells you what they think.</span>
            <br className="hidden md:block" />
            <GradientText preset="emerald" className="inline-block mt-2">
              GroundTruth shows you what your team knows.
            </GradientText>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ComparisonItem({ icon, text, positive }: {
  icon: React.ReactNode;
  text: string;
  positive?: boolean;
}) {
  return (
    <li className="flex items-start gap-4">
      <span className={`flex-shrink-0 ${positive ? 'text-emerald-400' : 'text-red-400/70'}`}>{icon}</span>
      <span className={`text-lg leading-relaxed ${
        positive ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-400'
      }`}>
        {text}
      </span>
    </li>
  );
}

import { TrendUpIcon, TargetIcon } from '@/components/icons/IconComponents';
