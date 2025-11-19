'use client';
import { motion } from 'framer-motion';
import GradientText from '@/components/ui/GradientText';
import TiltCard from '@/components/ui/TiltCard';
import { QuestionIcon, DollarIcon, ChartIcon, CheckCircleIcon, BrainIcon, LightningIcon, ShieldIcon, TargetIcon } from '@/components/icons/IconComponents';

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

const steps = [
  {
    number: '01',
    icon: QuestionIcon,
    iconGradient: 'from-purple-500/20 to-pink-500/20',
    iconBorder: 'border-purple-500/20',
    iconColor: 'text-purple-400',
    title: 'Create a Strategic Question',
    description: 'Your company faces a critical decision: Should we enter the EU market? Raise prices 20%? Launch this new product? Whatever keeps you up at night - turn it into a yes/no question.',
    example: {
      question: 'Will our Q4 product launch hit 50K users in the first month?',
      details: 'Company provides $5K USDC pool for employees to bet with'
    },
    gradientPreset: 'purple' as const,
  },
  {
    number: '02',
    icon: DollarIcon,
    iconGradient: 'from-blue-500/20 to-cyan-500/20',
    iconBorder: 'border-blue-500/20',
    iconColor: 'text-blue-400',
    title: 'Employees Predict with Real Money',
    description: 'Your team knows what consultants don\'t - they see the broken processes, the unrealistic timelines, the gaps in execution. Now they can prove it by betting real money (USDC) on the outcome they believe will happen.',
    example: {
      question: 'Engineering team bets 30 USDC on "No" (they see technical blockers)',
      details: 'Marketing bets 50 USDC on "Yes" (they see strong demand signals)'
    },
    gradientPreset: 'blue' as const,
  },
  {
    number: '03',
    icon: ChartIcon,
    iconGradient: 'from-emerald-500/20 to-teal-500/20',
    iconBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
    title: 'Market Reveals Department-Level Truth',
    description: 'Unlike surveys or consultant interviews, you see the split by department. When Engineering is 30% confident but Marketing is 90% confident - that\'s a signal consultants would miss entirely.',
    example: {
      question: 'Engineering: 42% YES | Marketing: 92% YES | Sales: 38% YES',
      details: 'This split reveals execution risk that leadership didn\'t see'
    },
    gradientPreset: 'emerald' as const,
  },
  {
    number: '04',
    icon: CheckCircleIcon,
    iconGradient: 'from-rainbow-500/20 to-purple-500/20',
    iconBorder: 'border-purple-500/20',
    iconColor: 'text-purple-400',
    title: 'Results Are Blockchain-Verified',
    description: 'When the outcome is known (did you hit 50K users?), the market resolves automatically. Winners split the pool. Every prediction is permanently recorded on Solana - tamper-proof, transparent, auditable.',
    example: {
      question: 'Actual result: Only 28K users in Month 1',
      details: 'Engineering team was right - they earned money for being honest'
    },
    gradientPreset: 'cosmic' as const,
  },
];

const benefits = [
  {
    icon: BrainIcon,
    iconGradient: 'from-purple-500/20 to-pink-500/20',
    iconBorder: 'border-purple-500/20',
    iconColor: 'text-purple-400',
    title: 'Skin in the Game',
    description: 'Employees risk real money = honest predictions, not political answers'
  },
  {
    icon: TargetIcon,
    iconGradient: 'from-blue-500/20 to-cyan-500/20',
    iconBorder: 'border-blue-500/20',
    iconColor: 'text-blue-400',
    title: 'Collective Intelligence',
    description: '500 employees > 5 consultants for forecasting complex outcomes'
  },
  {
    icon: LightningIcon,
    iconGradient: 'from-emerald-500/20 to-teal-500/20',
    iconBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
    title: 'Speed',
    description: 'Results in 30 days vs 6-12 weeks for consultant reports'
  },
  {
    icon: ShieldIcon,
    iconGradient: 'from-orange-500/20 to-red-500/20',
    iconBorder: 'border-orange-500/20',
    iconColor: 'text-orange-400',
    title: 'Anonymous',
    description: 'Employees speak truth without fear of political backlash'
  },
  {
    icon: ChartIcon,
    iconGradient: 'from-cyan-500/20 to-blue-500/20',
    iconBorder: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
    title: 'Data-Driven',
    description: '87% accuracy vs 62% for traditional consultant forecasts'
  },
  {
    icon: DollarIcon,
    iconGradient: 'from-emerald-500/20 to-green-500/20',
    iconBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
    title: '95% Cheaper',
    description: '$15K per decision vs $500K for McKinsey engagement'
  },
];

export default function HowItWorksDetailed() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
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
            The Process
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold">
            <GradientText preset="cyber" as="span">
              How GroundTruth Works
            </GradientText>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Transform employee insights into strategic intelligence in 4 simple steps
          </motion.p>
        </motion.div>

        <div className="space-y-8 mb-24">
          {steps.map((step, index) => (
            <StepCard key={step.number} {...step} index={index} />
          ))}
        </div>

        {/* Why This Works */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <TiltCard tiltIntensity={3}>
            <div className="p-12">
              <h3 className="text-3xl font-bold mb-8 text-center">
                <GradientText preset="cosmic">Why This Works Better Than Consultants</GradientText>
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit) => (
                  <BenefitCard key={benefit.title} {...benefit} />
                ))}
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}

function StepCard({ number, icon: Icon, iconGradient, iconBorder, iconColor, title, description, example, gradientPreset, index }: any) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      transition={{ delay: index * 0.1 }}
    >
      <TiltCard tiltIntensity={4}>
        <div className="p-8 md:p-10">
          <div className="flex items-start gap-6 mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${iconGradient} border ${iconBorder} flex items-center justify-center flex-shrink-0`}>
              <Icon className={iconColor} size={32} />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <GradientText preset={gradientPreset} className="text-5xl font-mono font-bold">
                  {number}
                </GradientText>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
              <p className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed">{description}</p>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-2 font-medium uppercase tracking-wider">Example:</p>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg mb-2">{example.question}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm italic">{example.details}</p>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

function BenefitCard({ icon: Icon, iconGradient, iconBorder, iconColor, title, description }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconGradient} border ${iconBorder} flex items-center justify-center flex-shrink-0`}>
        <Icon className={iconColor} size={24} />
      </div>
      <div>
        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{title}</h4>
        <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
