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
      <button className="mono text-xs px-6 py-3 border hover-trigger" style={{ borderColor: 'var(--text-dim)', color: 'var(--text-dim)' }}>
        LOADING...
      </button>
    );
  }

  if (publicKey) {
    return (
      <div className="flex items-center gap-3">
        <div className="mono text-xs px-4 py-3 border" style={{ borderColor: 'var(--accent)', background: 'rgba(20, 241, 149, 0.05)' }}>
          <div style={{ color: 'var(--text-dim)' }}>CONNECTED</div>
          <div className="font-bold mt-1" style={{ color: 'var(--accent)' }}>
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </div>
        </div>
        <button
          onClick={disconnect}
          className="mono text-xs px-6 py-3 border hover-trigger transition-all hover:bg-[var(--error)] hover:text-white"
          style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
        >
          DISCONNECT
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
        select(phantomWallet.adapter.name);
        await new Promise(resolve => setTimeout(resolve, 800));

        if (wallet && !publicKey) {
          try {
            await connect();
          } catch (connectError) {
            console.error('Connect error:', connectError);
          }
        }
      } else {
        alert('Phantom wallet not detected. Opening installation page...');
        window.open('https://phantom.app/', '_blank');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
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
      className="mono text-xs px-6 py-3 border hover-trigger transition-all hover:bg-[var(--accent)] hover:text-white disabled:opacity-50"
      style={{ borderColor: 'var(--text-color)', color: 'var(--text-color)' }}
    >
      {connecting ? (
        '● CONNECTING...'
      ) : (
        '○ CONNECT WALLET'
      )}
    </button>
  );
}
