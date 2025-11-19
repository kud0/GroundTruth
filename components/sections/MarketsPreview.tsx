'use client';
import { motion } from 'framer-motion';
import GradientText from '@/components/ui/GradientText';
import TiltCard from '@/components/ui/TiltCard';
import MagneticButton from '@/components/ui/MagneticButton';
import { useMarkets } from '@/hooks/useMarkets';
import { ChartIcon, UsersIcon, ClockIcon } from '@/components/icons/IconComponents';

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

export default function MarketsPreview() {
  const { markets, loading } = useMarkets();

  // Show preview of 3-4 markets
  const previewMarkets = markets.slice(0, 3);
  const hasMarkets = !loading && previewMarkets.length > 0;

  if (loading || !hasMarkets) {
    return null; // Don't show preview if no markets
  }

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
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
            Active Now
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold">
            <GradientText preset="rainbow" as="span">
              See What Others Are Predicting
            </GradientText>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Real markets, real money, real insights happening right now
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {previewMarkets.map((market, index) => (
            <MarketPreviewCard key={market.publicKey} market={market} />
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <MagneticButton
            variant="secondary"
            size="lg"
            onClick={() => window.location.href = '/markets'}
          >
            <ChartIcon className="mr-2" size={20} />
            <span>Explore All Markets</span>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}

function MarketPreviewCard({ market }: { market: any }) {
  const totalPool = market.yesPool + market.noPool;
  const yesOdds = totalPool > 0 ? Math.round((market.yesPool / totalPool) * 100) : 50;

  // Calculate days remaining
  const now = Date.now();
  const endTime = market.endTime * 1000;
  const daysRemaining = Math.max(0, Math.ceil((endTime - now) / (1000 * 60 * 60 * 24)));

  return (
    <motion.div variants={fadeInUp}>
      <TiltCard className="h-full" tiltIntensity={4}>
        <div className="p-8 h-full flex flex-col">
          {/* Market Question */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 line-clamp-3">
            {market.question}
          </h3>

          {/* Probability Display */}
          <div className="mb-6">
            <div className="flex items-end gap-2 mb-3">
              <span className="text-5xl font-bold">
                <GradientText preset="emerald">{yesOdds}%</GradientText>
              </span>
              <span className="text-gray-600 dark:text-gray-400 pb-2">YES</span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${yesOdds}%` }}
              />
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center">
                <UsersIcon className="text-blue-400" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">Pool</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {(totalPool / 1_000_000).toFixed(1)} USDC
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center">
                <ClockIcon className="text-purple-400" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">Ends in</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {daysRemaining}d
                </p>
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
