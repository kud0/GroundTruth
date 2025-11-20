'use client';
import { motion } from 'framer-motion';
import GradientText from '@/components/ui/GradientText';
import MagneticButton from '@/components/ui/MagneticButton';
import TiltCard from '@/components/ui/TiltCard';
import { CheckCircleIcon, RocketIcon, BuildingIcon } from '@/components/icons/IconComponents';

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

const pricingTiers = [
  {
    icon: RocketIcon,
    iconGradient: 'from-blue-500/20 to-cyan-500/20',
    iconBorder: 'border-blue-500/20',
    iconColor: 'text-blue-400',
    name: 'Pay-Per-Project',
    price: '$10K',
    period: 'per project',
    description: 'Perfect for testing or one-off validation',
    features: [
      'One strategic question',
      '30-day market window',
      'Full analytics dashboard',
      'Departmental breakdowns',
      'Email support',
    ],
    cta: 'Start Pilot',
    highlighted: false,
  },
  {
    icon: RocketIcon,
    iconGradient: 'from-purple-500/20 to-pink-500/20',
    iconBorder: 'border-purple-500/20',
    iconColor: 'text-purple-400',
    name: 'Annual Contract',
    price: '$90K',
    period: 'per year',
    savings: '10% savings',
    description: 'Best for agencies running 10+ projects/year',
    features: [
      '10 projects per year',
      'Priority support',
      'Custom branding',
      'Quarterly business reviews',
      'Dedicated success manager',
    ],
    cta: 'Book Demo',
    highlighted: true,
  },
  {
    icon: BuildingIcon,
    iconGradient: 'from-emerald-500/20 to-teal-500/20',
    iconBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
    name: 'Enterprise',
    price: '$200K',
    period: 'per year',
    savings: '20% savings',
    description: 'For large consulting firms or enterprises',
    features: [
      '25 projects per year',
      'White-label option',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
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
            Transparent Pricing
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold">
            <GradientText preset="cosmic" as="span">
              No Hidden Fees. No Surprises.
            </GradientText>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Choose the plan that fits your needs
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <p className="text-lg text-gray-600 dark:text-gray-400">
            All plans include: Blockchain verification • Anonymous betting • Real-time analytics • Compliance reports
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function PricingCard({ icon: Icon, iconGradient, iconBorder, iconColor, name, price, period, savings, description, features, cta, highlighted }: any) {
  return (
    <motion.div variants={fadeInUp} className="relative">
      {highlighted && (
        <div className="flex justify-center mb-2">
          <div className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-700 to-pink-700 text-white text-sm font-black tracking-wide whitespace-nowrap shadow-xl shadow-purple-500/60 border border-white/20">
            MOST POPULAR
          </div>
        </div>
      )}
      <TiltCard className="h-full" tiltIntensity={4}>
        <div className={`p-8 h-full flex flex-col relative ${highlighted ? 'border-2 border-purple-500/30' : ''}`}>

          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconGradient} border ${iconBorder} flex items-center justify-center mb-6`}>
            <Icon className={iconColor} size={28} />
          </div>

          <h3 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">{name}</h3>
          <div className="mb-4">
            <span className="text-5xl font-bold">
              <GradientText preset={highlighted ? 'cosmic' : 'blue'}>{price}</GradientText>
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">{period}</span>
          </div>

          {savings && (
            <div className="text-emerald-500 dark:text-emerald-400 text-sm font-semibold mb-6">{savings}</div>
          )}

          <p className="text-gray-700 dark:text-gray-400 mb-8 text-lg">{description}</p>

          <ul className="space-y-4 mb-10 flex-grow">
            {features.map((feature: string) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckCircleIcon className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" size={20} />
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          <MagneticButton
            variant={highlighted ? 'primary' : 'secondary'}
            size="lg"
            className="w-full"
            onClick={() => window.location.href = highlighted ? '#pilot' : '#pilot'}
          >
            {cta}
          </MagneticButton>
        </div>
      </TiltCard>
    </motion.div>
  );
}
