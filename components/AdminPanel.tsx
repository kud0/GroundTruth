'use client';

import { useState } from 'react';
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { ConnectWalletButton } from './ConnectWalletButton';
import { createMarket } from '@/lib/transactions';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TargetIcon,
  RocketIcon,
  LockIcon,
  DocumentIcon,
  RefreshIcon,
  CalendarIcon,
  ClockIcon,
  InfoIcon,
  EyeIcon
} from './icons/IconComponents';

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export function AdminPanel() {
  const { publicKey, connected } = useWallet();
  const wallet = useAnchorWallet();
  const [question, setQuestion] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [resolveDate, setResolveDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateMarket = async () => {
    if (!connected || !publicKey || !wallet) {
      alert('Please connect your wallet first');
      return;
    }

    if (!question || !closeDate || !resolveDate) {
      alert('Please fill in all fields');
      return;
    }

    setIsCreating(true);

    try {
      const closeDateObj = new Date(closeDate);
      const resolveDateObj = new Date(resolveDate);

      const { signature, marketPDA } = await createMarket(
        wallet,
        question,
        closeDateObj,
        resolveDateObj
      );

      alert(`Market created successfully!\n\nSignature: ${signature}\nMarket Address: ${marketPDA.toString()}\n\nQuestion: ${question}\nCloses: ${closeDate}\nResolves: ${resolveDate}`);

      // Reset form
      setQuestion('');
      setCloseDate('');
      setResolveDate('');
    } catch (error: any) {
      console.error('Error creating market:', error);

      let errorMessage = 'Failed to create market: ';

      // Check for common errors
      if (error?.message?.includes('already in use')) {
        errorMessage = 'Market Already Exists!\n\nYou\'ve already created a market with this exact question. Each market must have a unique question.\n\nPlease modify your question or check the homepage to see your existing markets.';
      } else if (error?.message?.includes('Max seed length')) {
        errorMessage = 'Question Too Long!\n\nDue to blockchain limitations, questions must be 32 characters or less.\n\nPlease shorten your question.';
      } else if (error?.message?.includes('ConstraintSeeds')) {
        errorMessage = 'Smart Contract Error: Pool address mismatch. This is a technical issue - please contact support.';
      } else if (error?.message?.includes('insufficient')) {
        errorMessage = 'Insufficient SOL balance. You need some SOL in your wallet to pay for transaction fees.\n\nGet devnet SOL at: https://faucet.solana.com';
      } else {
        errorMessage += (error?.message || String(error));
      }

      alert(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          {/* Header */}
          <motion.div variants={fadeInUp} className="mb-12">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center backdrop-blur-xl">
                    <TargetIcon className="text-purple-400" size={24} />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    Create Market
                  </h1>
                </div>
                <p className="text-lg text-gray-400 ml-[60px]">
                  Deploy a new prediction market to the blockchain
                </p>
              </div>
              {!connected && (
                <motion.div variants={scaleIn}>
                  <ConnectWalletButton />
                </motion.div>
              )}
            </div>
          </motion.div>

          {connected ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form - 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  variants={fadeInUp}
                  className="group relative bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-500"
                >
                  {/* Gradient border effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className="relative space-y-8">
                    {/* Market Question */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        <DocumentIcon className="text-purple-400" size={18} />
                        Market Question
                      </label>
                      <div className="relative group/input">
                        <input
                          type="text"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="e.g., Will we hit $50M ARR by Q4?"
                          className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-xl hover:border-gray-400 dark:hover:border-white/20"
                          maxLength={32}
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-500">Keep it concise due to blockchain limits</span>
                        <motion.span
                          className={`font-mono ${question.length > 28 ? 'text-yellow-400' : 'text-gray-600 dark:text-gray-500'}`}
                          animate={{ scale: question.length > 28 ? [1, 1.1, 1] : 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {question.length}/32
                        </motion.span>
                      </div>
                    </div>

                    {/* Date Inputs Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Close Date */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          <CalendarIcon className="text-blue-400" size={18} />
                          Betting Closes
                        </label>
                        <div className="relative group/input">
                          <input
                            type="datetime-local"
                            value={closeDate}
                            onChange={(e) => setCloseDate(e.target.value)}
                            min={today}
                            className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-xl hover:border-gray-400 dark:hover:border-white/20 [color-scheme:dark]"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-cyan-500/0 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-500 flex items-center gap-1.5">
                          <ClockIcon size={12} className="text-gray-600" />
                          When employees can no longer bet
                        </p>
                      </div>

                      {/* Resolve Date */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          <CalendarIcon className="text-emerald-400" size={18} />
                          Market Resolves
                        </label>
                        <div className="relative group/input">
                          <input
                            type="datetime-local"
                            value={resolveDate}
                            onChange={(e) => setResolveDate(e.target.value)}
                            min={closeDate || today}
                            className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 backdrop-blur-xl hover:border-gray-400 dark:hover:border-white/20 [color-scheme:dark]"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-500 flex items-center gap-1.5">
                          <ClockIcon size={12} className="text-gray-600" />
                          When winners get paid out
                        </p>
                      </div>
                    </div>

                    {/* Create Button */}
                    <motion.button
                      onClick={handleCreateMarket}
                      disabled={isCreating || !question || !closeDate || !resolveDate}
                      className="relative w-full group/btn overflow-hidden rounded-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-100 group-hover/btn:opacity-0 transition-opacity"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                      <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 blur-xl"></div>
                      </div>
                      <div className="relative px-8 py-5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isCreating ? (
                          <>
                            <RefreshIcon className="text-white animate-spin" size={24} />
                            <span className="text-lg font-bold text-white">Creating Market...</span>
                          </>
                        ) : (
                          <>
                            <RocketIcon className="text-white group-hover/btn:scale-110 transition-transform" size={24} />
                            <span className="text-lg font-bold text-white">Create Market on Blockchain</span>
                          </>
                        )}
                      </div>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Quick Templates */}
                <motion.div
                  variants={fadeInUp}
                  className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-8"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <DocumentIcon className="text-purple-400" size={20} />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Templates</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Hit $50M ARR by Q4?',
                      'Launch product by Q2?',
                      'Reach 100k users in 2025?',
                      'New office ready Sept?',
                    ].map((template, index) => (
                      <motion.button
                        key={template}
                        onClick={() => setQuestion(template)}
                        className="group relative text-left p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-sm">
                          {template}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar - 1 column */}
              <div className="space-y-6">
                {/* Preview */}
                <AnimatePresence>
                  {question && closeDate && resolveDate && (
                    <motion.div
                      variants={scaleIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="bg-gradient-to-br from-blue-100 dark:from-blue-500/10 via-purple-100 dark:via-purple-500/10 to-pink-100 dark:to-pink-500/10 backdrop-blur-xl border border-blue-300 dark:border-blue-500/20 rounded-2xl p-6 space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <EyeIcon className="text-blue-400" size={20} />
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Preview</h3>
                      </div>
                      <div className="space-y-3">
                        <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                          {question}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <CalendarIcon className="text-blue-400 mt-0.5 flex-shrink-0" size={16} />
                            <div>
                              <span className="text-gray-700 dark:text-gray-400">Closes:</span>
                              <br />
                              <span className="text-gray-800 dark:text-gray-300">{new Date(closeDate).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CalendarIcon className="text-emerald-400 mt-0.5 flex-shrink-0" size={16} />
                            <div>
                              <span className="text-gray-700 dark:text-gray-400">Resolves:</span>
                              <br />
                              <span className="text-gray-800 dark:text-gray-300">{new Date(resolveDate).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Contract Info */}
                <motion.div
                  variants={fadeInUp}
                  className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <InfoIcon className="text-gray-600 dark:text-gray-400" size={20} />
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Smart Contract Info</h3>
                  </div>
                  <div className="space-y-3 text-sm font-mono">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 dark:text-gray-500 text-xs">Market Factory</span>
                      <span className="text-gray-800 dark:text-gray-300 break-all">FANZBSDy...Tn5zz</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 dark:text-gray-500 text-xs">Betting Pool</span>
                      <span className="text-gray-800 dark:text-gray-300 break-all">52a6eQd5...2e</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 dark:text-gray-500 text-xs">Network</span>
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Solana Devnet
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 dark:text-gray-500 text-xs">Your Wallet</span>
                      <span className="text-purple-400 break-all">
                        {publicKey ? `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-6)}` : 'Not connected'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            <motion.div
              variants={scaleIn}
              className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-16 text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center"
              >
                <LockIcon className="text-purple-400" size={48} />
              </motion.div>
              <h4 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Admin Access Required
              </h4>
              <p className="text-gray-700 dark:text-gray-400 mb-8 text-lg max-w-md mx-auto">
                Connect your wallet to create prediction markets on the blockchain
              </p>
              <ConnectWalletButton />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
