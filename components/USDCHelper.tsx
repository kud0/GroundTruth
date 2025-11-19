'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { USDC_MINT_DEVNET } from '@/lib/programIds';

export function USDCHelper() {
  const { publicKey } = useWallet();
  const [showHelper, setShowHelper] = useState(true);

  if (!publicKey || !showHelper) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-6 rounded-lg mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            ℹ️ Important: Correct USDC Token Required
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This platform uses a specific devnet USDC token. If you're getting "insufficient balance" errors even though you have USDC, you might have a different USDC token.
          </p>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
            <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Required USDC Mint Address:
            </div>
            <div className="font-mono text-xs text-blue-600 dark:text-blue-400 break-all">
              {USDC_MINT_DEVNET.toString()}
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p className="font-bold">How to get the correct USDC:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Make sure your Phantom wallet is on <strong>Solana Devnet</strong></li>
              <li>Visit <a href="https://spl-token-faucet.com/?token-name=USDC" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">SPL Token Faucet</a></li>
              <li>Connect your wallet and request USDC airdrop</li>
              <li>The faucet will create a token account with the correct mint address</li>
            </ol>
          </div>

          <div className="mt-4 flex gap-3">
            <a
              href={`https://spl-token-faucet.com/?token-name=USDC`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Get Correct USDC →
            </a>
            <button
              onClick={() => setShowHelper(false)}
              className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
