'use client';

import { useState, useRef } from 'react';
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ConnectWalletButton } from './ConnectWalletButton';
import { placeBet } from '@/lib/transactions';
import TiltCard from './ui/TiltCard';
import AnimatedCounter, { PercentageCounter } from './ui/AnimatedCounter';

interface Market {
  publicKey?: string;
  question: string;
  closeTime: Date;
  totalYes: number;
  totalNo: number;
  status: 'Open' | 'Closed' | 'Resolved';
}

export function BettingCard({ market }: { market: Market }) {
  const { publicKey, connected } = useWallet();
  const wallet = useAnchorWallet();
  const [amount, setAmount] = useState('');
  const [prediction, setPrediction] = useState<'YES' | 'NO'>('YES');
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const totalPool = market.totalYes + market.totalNo;
  const yesOdds = totalPool > 0 ? (market.totalYes / totalPool) * 100 : 50.0;
  const noOdds = totalPool > 0 ? (market.totalNo / totalPool) * 100 : 50.0;

  // Ripple effect handler
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  // Confetti effect
  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        spread: 90,
        startVelocity: 55,
        decay: 0.92,
        scalar: 1.2,
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handlePlaceBet = async () => {
    if (!connected || !publicKey || !wallet) {
      alert('Please connect your wallet');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid bet amount');
      return;
    }

    if (!market.publicKey) {
      alert('Market address not found');
      return;
    }

    setIsPlacingBet(true);

    try {
      const marketPubkey = new PublicKey(market.publicKey);
      const betAmount = parseFloat(amount);

      const { signature } = await placeBet(wallet, marketPubkey, betAmount, prediction);

      // Show success animation
      setShowSuccess(true);
      triggerConfetti();

      // Show success alert after animation
      setTimeout(() => {
        alert(`Bet placed successfully!\n\nSignature: ${signature}\nAmount: $${amount} USDC\nPrediction: ${prediction}`);
        setShowSuccess(false);
      }, 1500);

      setAmount('');
    } catch (error: any) {
      console.error('Error placing bet:', error);

      let errorMessage = 'Failed to place bet: ';

      if (error?.message?.includes('AccountNotInitialized') && error?.message?.includes('bettor_usdc')) {
        errorMessage = '💰 No USDC Token Account!\n\nYou need the correct devnet USDC to place bets.\n\nRequired USDC Mint: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU\n\nSteps to get the correct devnet USDC:\n1. Visit: https://spl-token-faucet.com/?token-name=USDC\n2. Make sure you\'re on Solana Devnet\n3. Connect your Phantom wallet\n4. Request airdrop\n\nNote: If you have USDC-Dev from a different source, it might be a different token mint.';
      } else if (error?.message?.includes('insufficient')) {
        errorMessage = '💸 Insufficient USDC Balance!\n\nYou don\'t have enough USDC (mint: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU) to place this bet.\n\nThe USDC in your wallet might be from a different mint address.\n\nGet the correct devnet USDC at: https://spl-token-faucet.com/?token-name=USDC';
      } else if (error?.message?.includes('custom program error: 0x1')) {
        errorMessage = '❌ Token Transfer Failed!\n\nThis usually means:\n- You don\'t have the correct USDC token\n- Your USDC is from a different mint address\n\nRequired mint: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU\n\nGet devnet USDC from: https://spl-token-faucet.com/?token-name=USDC';
      } else {
        errorMessage += (error?.message || String(error));
      }

      alert(errorMessage);
    } finally {
      setIsPlacingBet(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard
        className="group"
        tiltIntensity={8}
        glareIntensity={0.2}
        scale={1.01}
        transitionSpeed={0.2}
      >
        <div className="relative p-8">
        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-3xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, times: [0, 0.6, 1] }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 0.3,
                  }}
                  className="text-8xl mb-4"
                >
                  🎉
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white"
                >
                  Bet Placed!
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-start justify-between mb-8"
        >
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {market.question}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Closes {market.closeTime.toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              market.status === 'Open'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : market.status === 'Closed'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
            {market.status}
          </motion.span>
        </motion.div>

        {/* Odds Display */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* YES */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            className="relative group/odds"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-lg group-hover/odds:blur-xl transition-all duration-300"></div>
            <div className="relative bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 hover:bg-emerald-500/20 transition-all duration-300 overflow-hidden">
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'linear',
                  repeatDelay: 2,
                }}
              />
              <div className="text-sm text-emerald-400 font-medium mb-2">YES</div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                <PercentageCounter value={yesOdds} decimals={1} duration={1.5} />
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-400">
                <AnimatedCounter value={market.totalYes} prefix="$" decimals={2} duration={1.5} /> pool
              </div>
            </div>
          </motion.div>

          {/* NO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            className="relative group/odds"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-2xl blur-lg group-hover/odds:blur-xl transition-all duration-300"></div>
            <div className="relative bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 hover:bg-rose-500/20 transition-all duration-300 overflow-hidden">
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'linear',
                  repeatDelay: 2,
                  delay: 0.5,
                }}
              />
              <div className="text-sm text-rose-400 font-medium mb-2">NO</div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                <PercentageCounter value={noOdds} decimals={1} duration={1.5} />
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-400">
                <AnimatedCounter value={market.totalNo} prefix="$" decimals={2} duration={1.5} /> pool
              </div>
            </div>
          </motion.div>
        </div>

        {!connected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center py-12 border border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-white/5"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl mb-4"
            >
              🔐
            </motion.div>
            <p className="text-gray-700 dark:text-gray-400 mb-6">
              Connect your wallet to place a bet
            </p>
            <ConnectWalletButton />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-6"
          >
            {/* Prediction Selection */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                Your Prediction
              </label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => setPrediction('YES')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`py-4 px-6 rounded-xl font-bold transition-all duration-300 relative overflow-hidden ${
                    prediction === 'YES'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10'
                  }`}
                >
                  {prediction === 'YES' && (
                    <motion.div
                      layoutId="prediction-highlight"
                      className="absolute inset-0 bg-emerald-500"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">YES</span>
                </motion.button>
                <motion.button
                  onClick={() => setPrediction('NO')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`py-4 px-6 rounded-xl font-bold transition-all duration-300 relative overflow-hidden ${
                    prediction === 'NO'
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10'
                  }`}
                >
                  {prediction === 'NO' && (
                    <motion.div
                      layoutId="prediction-highlight"
                      className="absolute inset-0 bg-rose-500"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">NO</span>
                </motion.button>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                Bet Amount (USDC)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 text-lg font-mono transition-all duration-300"
                  min="0"
                  step="0.01"
                />
                <motion.div
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-500 font-medium"
                  animate={amount ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  USDC
                </motion.div>
              </div>
            </div>

            {/* Place Bet Button */}
            <motion.button
              ref={buttonRef}
              onClick={(e) => {
                createRipple(e);
                handlePlaceBet();
              }}
              disabled={!amount || parseFloat(amount) <= 0 || market.status !== 'Open' || isPlacingBet}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-5 px-6 rounded-xl disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-purple-500/50 disabled:shadow-none overflow-hidden"
            >
              {/* Ripple effects */}
              <AnimatePresence>
                {ripples.map((ripple) => (
                  <motion.span
                    key={ripple.id}
                    className="absolute rounded-full bg-white/30"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                    }}
                    initial={{ width: 0, height: 0, x: 0, y: 0 }}
                    animate={{
                      width: 400,
                      height: 400,
                      x: -200,
                      y: -200,
                      opacity: 0,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                ))}
              </AnimatePresence>

              {/* Animated gradient overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <span className="relative z-10 flex items-center justify-center gap-2">
                {isPlacingBet ? (
                  <>
                    <motion.svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </motion.svg>
                    <motion.span
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                    >
                      Placing Bet...
                    </motion.span>
                  </>
                ) : market.status !== 'Open' ? (
                  'Market Closed'
                ) : (
                  `Place ${amount || '0'} USDC on ${prediction}`
                )}
              </span>
            </motion.button>

            {/* Potential Payout */}
            <AnimatePresence>
              {amount && parseFloat(amount) > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-purple-100 dark:bg-purple-500/10 border border-purple-300 dark:border-purple-500/20 rounded-xl overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700 dark:text-gray-400">Potential Payout:</span>
                    <motion.span
                      key={amount + prediction}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                    >
                      <AnimatedCounter
                        value={parseFloat(amount) * (1 + (prediction === 'YES' ? yesOdds : noOdds) / 100)}
                        prefix="$"
                        decimals={2}
                        duration={0.8}
                        className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                      />
                    </motion.span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-500">
                    3% platform fee applies to winnings
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
        </div>
      </TiltCard>
    </motion.div>
  );
}
