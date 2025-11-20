'use client';

import { useState } from 'react';
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import confetti from 'canvas-confetti';
import { ConnectWalletButton } from './ConnectWalletButton';
import { placeBet } from '@/lib/transactions';

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

  const totalPool = market.totalYes + market.totalNo;
  const yesOdds = totalPool > 0 ? (market.totalYes / totalPool) * 100 : 50.0;
  const noOdds = totalPool > 0 ? (market.totalNo / totalPool) * 100 : 50.0;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handlePlaceBet = async () => {
    if (!connected || !publicKey || !wallet) {
      alert('Please connect your wallet');
      return;
    }

    const betAmount = parseFloat(amount);
    if (isNaN(betAmount) || betAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!market.publicKey) {
      alert('Market address not available');
      return;
    }

    setIsPlacingBet(true);

    try {
      const marketPubkey = new PublicKey(market.publicKey);
      await placeBet(wallet, marketPubkey, betAmount, prediction);

      triggerConfetti();
      setShowSuccess(true);
      setAmount('');

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error placing bet:', error);
      alert(`Failed to place bet: ${error?.message || String(error)}`);
    } finally {
      setIsPlacingBet(false);
    }
  };

  const isMarketOpen = market.status === 'Open';
  const timeRemaining = new Date(market.closeTime).getTime() - Date.now();
  const hoursRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)));

  return (
    <div className="data-card h-full flex flex-col relative overflow-hidden group hover-trigger">
      {/* Status Badge */}
      <div className="absolute top-4 right-4 mono text-xs px-3 py-1 border" style={{
        borderColor: isMarketOpen ? 'var(--accent)' : 'var(--text-dim)',
        color: isMarketOpen ? 'var(--accent)' : 'var(--text-dim)',
        background: isMarketOpen ? 'rgba(20, 241, 149, 0.05)' : 'rgba(0,0,0,0.1)'
      }}>
        {market.status.toUpperCase()}
      </div>

      {/* Question */}
      <h3 className="text-2xl font-bold mb-6 pr-20" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-color)' }}>
        {market.question}
      </h3>

      {/* Market Stats */}
      <div className="mb-6 space-y-3">
        {/* YES Bar */}
        <div>
          <div className="flex justify-between mb-2 mono text-xs">
            <span style={{ color: 'var(--text-color)' }}>YES</span>
            <span style={{ color: 'var(--accent)' }}>{yesOdds.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 border" style={{ borderColor: 'var(--card-border)', background: 'rgba(0,0,0,0.1)' }}>
            <div className="h-full transition-all duration-500" style={{
              backgroundColor: 'var(--accent)',
              width: `${yesOdds}%`
            }} />
          </div>
        </div>

        {/* NO Bar */}
        <div>
          <div className="flex justify-between mb-2 mono text-xs">
            <span style={{ color: 'var(--text-color)' }}>NO</span>
            <span style={{ color: 'var(--error)' }}>{noOdds.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 border" style={{ borderColor: 'var(--card-border)', background: 'rgba(0,0,0,0.1)' }}>
            <div className="h-full transition-all duration-500" style={{
              backgroundColor: 'var(--error)',
              width: `${noOdds}%`
            }} />
          </div>
        </div>
      </div>

      {/* Pool Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--card-border)' }}>
        <div>
          <div className="mono text-xs mb-1" style={{ color: 'var(--text-dim)' }}>POOL</div>
          <div className="text-xl font-bold mono" style={{ color: 'var(--text-color)' }}>
            {totalPool.toFixed(2)} USDC
          </div>
        </div>
        <div>
          <div className="mono text-xs mb-1" style={{ color: 'var(--text-dim)' }}>CLOSES</div>
          <div className="text-xl font-bold mono" style={{ color: isMarketOpen ? 'var(--accent)' : 'var(--text-dim)' }}>
            {hoursRemaining}H
          </div>
        </div>
      </div>

      {/* Betting Interface */}
      {isMarketOpen ? (
        <div className="mt-auto space-y-4">
          {/* Prediction Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPrediction('YES')}
              className="mono text-xs px-4 py-3 border transition-all hover-trigger"
              style={{
                borderColor: prediction === 'YES' ? 'var(--accent)' : 'var(--card-border)',
                background: prediction === 'YES' ? 'rgba(20, 241, 149, 0.1)' : 'transparent',
                color: prediction === 'YES' ? 'var(--accent)' : 'var(--text-color)'
              }}
            >
              YES
            </button>
            <button
              onClick={() => setPrediction('NO')}
              className="mono text-xs px-4 py-3 border transition-all hover-trigger"
              style={{
                borderColor: prediction === 'NO' ? 'var(--error)' : 'var(--card-border)',
                background: prediction === 'NO' ? 'rgba(255, 59, 48, 0.1)' : 'transparent',
                color: prediction === 'NO' ? 'var(--error)' : 'var(--text-color)'
              }}
            >
              NO
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <div className="mono text-xs mb-2" style={{ color: 'var(--text-dim)' }}>AMOUNT (USDC)</div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full mono px-4 py-3 border bg-transparent outline-none transition-colors"
              style={{
                borderColor: 'var(--card-border)',
                color: 'var(--text-color)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
            />
          </div>

          {/* Place Bet Button */}
          {connected ? (
            <button
              onClick={handlePlaceBet}
              disabled={isPlacingBet || !amount}
              className="w-full mono text-xs px-6 py-4 border hover-trigger transition-all hover:bg-[var(--accent)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: 'var(--text-color)',
                color: 'var(--text-color)'
              }}
            >
              {isPlacingBet ? '● PLACING BET...' : 'PLACE BET →'}
            </button>
          ) : (
            <ConnectWalletButton />
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="text-center mono text-xs py-2" style={{ color: 'var(--accent)' }}>
              ✓ BET PLACED SUCCESSFULLY
            </div>
          )}
        </div>
      ) : (
        <div className="mt-auto text-center mono text-xs py-4" style={{ color: 'var(--text-dim)' }}>
          MARKET {market.status.toUpperCase()}
        </div>
      )}
    </div>
  );
}
