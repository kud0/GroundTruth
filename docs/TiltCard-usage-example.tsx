// Example usage of TiltCard component
import TiltCard from '@/components/ui/TiltCard';

export default function ExampleUsage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

        {/* Basic Card */}
        <TiltCard className="w-full h-80">
          <div className="p-8 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Premium Card</h3>
              <p className="text-gray-300">
                Hover over this card to see the 3D tilt effect with smooth animations.
              </p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold">
              Learn More
            </button>
          </div>
        </TiltCard>

        {/* High Intensity Card */}
        <TiltCard
          className="w-full h-80"
          tiltIntensity={25}
          glareIntensity={0.5}
          scale={1.05}
        >
          <div className="p-8 h-full flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400" />
              <h3 className="text-2xl font-bold text-white">High Intensity</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Value</span>
                <span className="text-white font-bold">$12,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">24h Change</span>
                <span className="text-green-400 font-bold">+12.5%</span>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* NFT Card Style */}
        <TiltCard
          className="w-full h-80"
          tiltIntensity={20}
          glareIntensity={0.4}
          shadowIntensity={35}
        >
          <div className="h-full flex flex-col">
            <div className="h-48 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-xs opacity-75">Collection</div>
                <div className="text-lg font-bold">Crypto Punk #1234</div>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Floor Price</span>
                <span className="text-white font-bold">2.5 ETH</span>
              </div>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors">
                Place Bid
              </button>
            </div>
          </div>
        </TiltCard>

        {/* Stats Card */}
        <TiltCard className="w-full h-80">
          <div className="p-8 h-full flex flex-col justify-center">
            <div className="text-center space-y-4">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-gray-300">Uptime Guarantee</div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <p className="text-sm text-gray-400">
                Industry-leading reliability for your crypto trading needs
              </p>
            </div>
          </div>
        </TiltCard>

        {/* Feature Card */}
        <TiltCard
          className="w-full h-80"
          borderRadius="16px"
        >
          <div className="p-8 h-full">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Lightning Fast</h3>
            <p className="text-gray-400 mb-6">
              Execute trades in milliseconds with our optimized infrastructure
            </p>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-xs">
                Fast
              </div>
              <div className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-xs">
                Reliable
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Pricing Card */}
        <TiltCard
          className="w-full h-80"
          scale={1.03}
        >
          <div className="p-8 h-full flex flex-col">
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-2">Premium Plan</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">$99</span>
                <span className="text-gray-400">/month</span>
              </div>
            </div>
            <ul className="space-y-3 flex-1">
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited transactions
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Priority support
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Advanced analytics
              </li>
            </ul>
            <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg text-white font-semibold transition-all">
              Get Started
            </button>
          </div>
        </TiltCard>

      </div>
    </div>
  );
}
