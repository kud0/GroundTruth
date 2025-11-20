'use client';

import { useState } from 'react';
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { ConnectWalletButton } from './ConnectWalletButton';
import { createMarket } from '@/lib/transactions';

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
      {connected ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Form Card */}
            <div className="data-card hover-trigger">
              <div className="space-y-8">
                {/* Market Question */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 mono text-xs uppercase" style={{ color: 'var(--text-color)' }}>
                    MARKET QUESTION
                  </label>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., Will we hit $50M ARR by Q4?"
                    className="w-full mono px-4 py-3 border bg-transparent outline-none transition-colors"
                    style={{
                      borderColor: 'var(--card-border)',
                      color: 'var(--text-color)'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                    maxLength={32}
                  />
                  <div className="flex items-center justify-between mono text-xs">
                    <span style={{ color: 'var(--text-dim)' }}>Keep it concise due to blockchain limits</span>
                    <span style={{ color: question.length > 28 ? 'var(--error)' : 'var(--text-dim)' }}>
                      {question.length}/32
                    </span>
                  </div>
                </div>

                {/* Date Inputs Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Close Date */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 mono text-xs uppercase" style={{ color: 'var(--text-color)' }}>
                      BETTING CLOSES
                    </label>
                    <input
                      type="datetime-local"
                      value={closeDate}
                      onChange={(e) => setCloseDate(e.target.value)}
                      min={today}
                      className="w-full mono px-4 py-3 border bg-transparent outline-none transition-colors"
                      style={{
                        borderColor: 'var(--card-border)',
                        color: 'var(--text-color)',
                        colorScheme: 'dark'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                    />
                    <p className="mono text-xs" style={{ color: 'var(--text-dim)' }}>
                      When employees can no longer bet
                    </p>
                  </div>

                  {/* Resolve Date */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 mono text-xs uppercase" style={{ color: 'var(--text-color)' }}>
                      MARKET RESOLVES
                    </label>
                    <input
                      type="datetime-local"
                      value={resolveDate}
                      onChange={(e) => setResolveDate(e.target.value)}
                      min={closeDate || today}
                      className="w-full mono px-4 py-3 border bg-transparent outline-none transition-colors"
                      style={{
                        borderColor: 'var(--card-border)',
                        color: 'var(--text-color)',
                        colorScheme: 'dark'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                    />
                    <p className="mono text-xs" style={{ color: 'var(--text-dim)' }}>
                      When winners get paid out
                    </p>
                  </div>
                </div>

                {/* Create Button */}
                <button
                  onClick={handleCreateMarket}
                  disabled={isCreating || !question || !closeDate || !resolveDate}
                  className="w-full mono text-xs px-6 py-4 border hover-trigger transition-all hover:bg-[var(--accent)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: 'var(--text-color)',
                    color: 'var(--text-color)'
                  }}
                >
                  {isCreating ? '● CREATING MARKET...' : 'CREATE MARKET ON BLOCKCHAIN →'}
                </button>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="data-card">
              <div className="mb-6 mono text-xs" style={{ color: 'var(--text-dim)' }}>
                QUICK TEMPLATES
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Hit $50M ARR by Q4?',
                  'Launch product by Q2?',
                  'Reach 100k users in 2025?',
                  'New office ready Sept?',
                ].map((template) => (
                  <button
                    key={template}
                    onClick={() => setQuestion(template)}
                    className="text-left mono text-xs px-4 py-3 border hover-trigger transition-all"
                    style={{
                      borderColor: 'var(--card-border)',
                      color: 'var(--text-dim)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--text-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--card-border)';
                      e.currentTarget.style.color = 'var(--text-dim)';
                    }}
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Preview */}
            {question && closeDate && resolveDate && (
              <div className="data-card" style={{
                background: 'rgba(20, 241, 149, 0.05)',
                borderColor: 'var(--accent)'
              }}>
                <div className="mb-4 mono text-xs" style={{ color: 'var(--accent)' }}>
                  PREVIEW
                </div>
                <div className="space-y-4">
                  <p className="text-xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-color)' }}>
                    {question}
                  </p>
                  <div className="space-y-2 mono text-xs">
                    <div style={{ color: 'var(--text-dim)' }}>
                      CLOSES
                      <br />
                      <span style={{ color: 'var(--text-color)' }}>{new Date(closeDate).toLocaleString()}</span>
                    </div>
                    <div style={{ color: 'var(--text-dim)' }}>
                      RESOLVES
                      <br />
                      <span style={{ color: 'var(--text-color)' }}>{new Date(resolveDate).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contract Info */}
            <div className="data-card">
              <div className="mb-6 mono text-xs" style={{ color: 'var(--text-dim)' }}>
                SMART CONTRACT INFO
              </div>
              <div className="space-y-4 mono text-xs">
                <div>
                  <div style={{ color: 'var(--text-dim)' }} className="mb-1">MARKET FACTORY</div>
                  <div style={{ color: 'var(--text-color)' }} className="break-all">FANZBSDy...Tn5zz</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-dim)' }} className="mb-1">BETTING POOL</div>
                  <div style={{ color: 'var(--text-color)' }} className="break-all">52a6eQd5...2e</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-dim)' }} className="mb-1">NETWORK</div>
                  <div className="flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }}></div>
                    SOLANA DEVNET
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-dim)' }} className="mb-1">YOUR WALLET</div>
                  <div style={{ color: 'var(--secondary)' }} className="break-all">
                    {publicKey ? `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-6)}` : 'Not connected'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="data-card text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="mb-8 mono text-xs" style={{ color: 'var(--error)' }}>
              ACCESS DENIED
            </div>
            <h3 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-color)' }}>
              ADMIN ACCESS
              <br />
              REQUIRED
            </h3>
            <p className="text-lg mb-8" style={{ color: 'var(--text-dim)' }}>
              Connect your wallet to create prediction markets on the blockchain
            </p>
            <ConnectWalletButton />
          </div>
        </div>
      )}
    </div>
  );
}
