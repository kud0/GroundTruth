'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

export function ConnectWalletButton() {
  const { select, wallets, publicKey, disconnect, connecting, connect, wallet } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg">
        Loading...
      </button>
    );
  }

  if (publicKey) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-green-900/30 rounded-lg">
          <div className="text-xs text-gray-400">Connected:</div>
          <div className="font-mono text-sm font-bold text-green-600">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </div>
        </div>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
        >
          Disconnect
        </button>
      </div>
    );
  }

  const handleConnect = async () => {
    try {
      const phantomWallet = wallets.find((w) =>
        w.adapter.name === 'Phantom' ||
        w.adapter.name.includes('Phantom')
      );

      if (phantomWallet) {
        // Select the wallet
        select(phantomWallet.adapter.name);

        // Wait for selection to complete
        await new Promise(resolve => setTimeout(resolve, 800));

        // Manually trigger connect if wallet is selected but not connected
        if (wallet && !publicKey) {
          try {
            await connect();
          } catch (connectError) {
            console.error('Connect error:', connectError);
            // User likely rejected, ignore
          }
        }
      } else {
        alert('Phantom wallet not detected. Opening installation page...');
        window.open('https://phantom.app/', '_blank');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      // Only show alert if it's not a user rejection
      if (!error?.message?.includes('User rejected') && !error?.message?.includes('User cancelled')) {
        alert('Error connecting wallet: ' + (error?.message || String(error)));
      }
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      type="button"
      className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition flex items-center gap-2"
    >
      {connecting ? (
        <>🔄 Connecting...</>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M96 0H32C14.3 0 0 14.3 0 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32z" fill="#AB9FF2"/>
            <path d="M88.8 64c0-13.7-11.1-24.8-24.8-24.8S39.2 50.3 39.2 64 50.3 88.8 64 88.8 88.8 77.7 88.8 64z" fill="white"/>
          </svg>
          Connect Phantom
        </>
      )}
    </button>
  );
}
