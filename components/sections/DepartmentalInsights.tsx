'use client';
import { motion } from 'framer-motion';
import GradientText from '@/components/ui/GradientText';
import TiltCard from '@/components/ui/TiltCard';
import { ChartIcon, InfoIcon } from '@/components/icons/IconComponents';

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

const departments = [
  { name: 'Engineering', percent: 78, gradient: 'from-blue-500/20 to-cyan-500/20', borderColor: 'border-blue-500/20', barColor: 'bg-gradient-to-r from-blue-500 to-cyan-500', signal: 'Code is production-ready' },
  { name: 'Marketing', percent: 92, gradient: 'from-purple-500/20 to-pink-500/20', borderColor: 'border-purple-500/20', barColor: 'bg-gradient-to-r from-purple-500 to-pink-500', signal: 'Demand is validated' },
  { name: 'Sales', percent: 42, gradient: 'from-red-500/20 to-orange-500/20', borderColor: 'border-red-500/20', barColor: 'bg-gradient-to-r from-red-500 to-orange-500', signal: 'Pipeline is weak (RED FLAG)' },
  { name: 'Product', percent: 65, gradient: 'from-emerald-500/20 to-teal-500/20', borderColor: 'border-emerald-500/20', barColor: 'bg-gradient-to-r from-emerald-500 to-teal-500', signal: 'Feature gaps exist' },
];

export default function DepartmentalInsights() {
  return (
    <section id="insights" className="relative py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
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
            Departmental Intelligence
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold">
            <GradientText preset="rainbow" as="span">
              See What Consultants Miss
            </GradientText>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Department-level intelligence that reveals organizational truth before expensive mistakes are made
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <TiltCard className="max-w-5xl mx-auto" tiltIntensity={3}>
            <div className="p-8 md:p-12">
              {/* Example Question */}
              <div className="mb-10 pb-8 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-3 font-mono uppercase tracking-wider">Prediction Market</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  "Will our Q4 product launch hit 50K users in Month 1?"
                </h3>
              </div>

              {/* Department Breakdown */}
              <div className="space-y-8 mb-10">
                {departments.map((dept, index) => (
                  <DepartmentBar key={dept.name} {...dept} delay={index * 0.15} />
                ))}
              </div>

              {/* Critical Insight */}
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl p-8 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                    <InfoIcon className="text-red-400" size={24} />
                  </div>
                  <div>
                    <p className="text-red-500 dark:text-red-400 font-bold text-xl mb-3">Critical Insight</p>
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      Sales at 42% signals go-to-market execution risk. Marketing sees demand,
                      but Sales can't deliver. <span className="font-bold text-gray-900 dark:text-white">Investigate capacity
                      before launch to avoid failure.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-xl border border-red-500/20">
                  <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm font-medium">With Consultants:</p>
                  <p className="text-red-500 dark:text-red-400 font-bold text-lg">You'd never see this split</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-xl border border-emerald-500/20">
                  <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm font-medium">With GroundTruth:</p>
                  <p className="text-emerald-500 dark:text-emerald-400 font-bold text-lg">Drill down by role, tenure, location</p>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}

function DepartmentBar({ name, percent, gradient, borderColor, barColor, signal, delay }: {
  name: string;
  percent: number;
  gradient: string;
  borderColor: string;
  barColor: string;
  signal: string;
  delay: number;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} border ${borderColor} flex items-center justify-center`}>
            <ChartIcon className="text-gray-700 dark:text-gray-300" size={20} />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">{name}</span>
        </div>
        <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">{percent}% YES</span>
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
        <motion.div
          className={`h-full ${barColor}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </div>
      <p className="text-gray-600 dark:text-gray-400 italic text-sm">{signal}</p>
    </div>
  );
}
