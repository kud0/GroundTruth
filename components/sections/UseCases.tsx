'use client';
import { motion } from 'framer-motion';
import GradientText from '@/components/ui/GradientText';
import TiltCard from '@/components/ui/TiltCard';
import { BuildingIcon, DollarIcon, TargetIcon, RocketIcon, UsersIcon } from '@/components/icons/IconComponents';

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

const useCases = [
  {
    icon: BuildingIcon,
    iconGradient: 'from-blue-500/20 to-cyan-500/20',
    iconBorder: 'border-blue-500/20',
    iconColor: 'text-blue-400',
    title: 'M&A Validation',
    question: 'Will this acquisition create $20M in synergies?',
    result: '35% YES',
    resultColor: 'red',
    insight: 'Operations team highly skeptical of integration complexity',
    action: 'Renegotiated terms and walked away',
    roi: '$80M failed acquisition avoided',
  },
  {
    icon: DollarIcon,
    iconGradient: 'from-emerald-500/20 to-teal-500/20',
    iconBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
    title: 'Pricing Strategy',
    question: 'Can we raise prices 20% without losing >5% of customers?',
    result: '67% YES',
    resultColor: 'green',
    insight: 'Customer Success confident in value perception',
    action: 'Executed price increase in phases',
    roi: '$12M additional annual revenue',
  },
  {
    icon: TargetIcon,
    iconGradient: 'from-purple-500/20 to-pink-500/20',
    iconBorder: 'border-purple-500/20',
    iconColor: 'text-purple-400',
    title: 'Market Entry',
    question: 'Can we profitably enter EU market by 2027?',
    result: '48% YES',
    resultColor: 'yellow',
    insight: 'Operations doubtful, Sales bullish - mixed signals',
    action: 'Piloted UK first before full expansion',
    roi: '$30M premature expansion avoided',
  },
  {
    icon: RocketIcon,
    iconGradient: 'from-orange-500/20 to-red-500/20',
    iconBorder: 'border-orange-500/20',
    iconColor: 'text-orange-400',
    title: 'Product Launch',
    question: 'Will new AI feature hit 50% adoption in Year 1?',
    result: '78% YES',
    resultColor: 'green',
    insight: 'Product + Engineering teams fully aligned',
    action: 'Green-lit launch with confidence',
    roi: '$18M new revenue stream',
  },
  {
    icon: UsersIcon,
    iconGradient: 'from-cyan-500/20 to-blue-500/20',
    iconBorder: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
    title: 'Organizational Change',
    question: 'Will restructure improve decision-making speed?',
    result: '29% YES',
    resultColor: 'red',
    insight: 'Employees predicted failure before implementation',
    action: 'Redesigned structure based on feedback',
    roi: '6 months disruption avoided',
  },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="relative py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
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
            Real Results
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold">
            <GradientText preset="cosmic" as="span">
              Real Decisions. Real Stakes. Real ROI.
            </GradientText>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            See how agencies and enterprises use GroundTruth to validate strategy
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {useCases.map((useCase, index) => (
            <UseCaseCard key={useCase.title} {...useCase} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function UseCaseCard({ icon: Icon, iconGradient, iconBorder, iconColor, title, question, result, resultColor, insight, action, roi, index }: any) {
  const resultStyles: Record<string, { bg: string; border: string; text: string }> = {
    red: { bg: 'from-red-500/10 to-orange-500/10', border: 'border-red-500/30', text: 'text-red-500 dark:text-red-400' },
    green: { bg: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-500/30', text: 'text-emerald-500 dark:text-emerald-400' },
    yellow: { bg: 'from-yellow-500/10 to-orange-500/10', border: 'border-yellow-500/30', text: 'text-yellow-500 dark:text-yellow-400' },
  };

  return (
    <motion.div variants={fadeInUp}>
      <TiltCard className="h-full" tiltIntensity={4}>
        <div className="p-8 h-full flex flex-col">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconGradient} border ${iconBorder} flex items-center justify-center mb-6`}>
            <Icon className={iconColor} size={28} />
          </div>

          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>

          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-2 font-medium">Question:</p>
            <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">"{question}"</p>
          </div>

          <div className={`mb-6 p-4 rounded-xl border-2 bg-gradient-to-br ${resultStyles[resultColor].bg} ${resultStyles[resultColor].border}`}>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prediction Result:</p>
            <p className={`text-3xl font-bold mb-2 ${resultStyles[resultColor].text}`}>{result}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-2 font-medium">Action Taken:</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{action}</p>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-2 font-medium">Business Impact:</p>
            <p className="text-emerald-500 dark:text-emerald-400 font-bold text-lg">{roi}</p>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
