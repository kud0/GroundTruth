'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { USDC_MINT_DEVNET } from '@/lib/programIds';

export function GetUSDCBanner() {
  const { publicKey } = useWallet();
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkBalance() {
      if (!publicKey) {
        setUsdcBalance(null);
        return;
      }

      setLoading(true);
      try {
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const usdcAccount = await getAssociatedTokenAddress(
          USDC_MINT_DEVNET,
          publicKey
        );

        try {
          const balance = await connection.getTokenAccountBalance(usdcAccount);
          setUsdcBalance(parseFloat(balance.value.uiAmount?.toString() || '0'));
        } catch (error) {
          // Account doesn't exist yet
          setUsdcBalance(0);
        }
      } catch (error) {
        console.error('Error checking USDC balance:', error);
        setUsdcBalance(null);
      } finally {
        setLoading(false);
      }
    }

    checkBalance();
  }, [publicKey]);

  if (!publicKey) return null;
  if (loading) return null;
  if (usdcBalance === null) return null;
  if (usdcBalance > 0) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-l-4 border-yellow-400 p-6 rounded-lg mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-4xl">💰</span>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Get Devnet USDC to Start Betting!
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You need USDC tokens in your wallet to place bets. Follow these steps to get free devnet USDC:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li>Visit the SPL Token Faucet</li>
            <li>Connect your Phantom wallet</li>
            <li>Select "USDC" from the token list</li>
            <li>Click "Airdrop" to receive test USDC</li>
          </ol>
          <div className="flex gap-3">
            <a
              href="https://spl-token-faucet.com/?token-name=USDC"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition"
            >
              Get Devnet USDC →
            </a>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              🔄 Refresh Balance
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Note: This is devnet (test network) USDC - it has no real value.
          </p>
        </div>
      </div>
    </div>
  );
}
