'use client';

import { useEffect, useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { getMarketFactoryProgram, getBettingPoolProgram, getBettingPoolPDA, getConnection } from '@/lib/anchorClient';
import { USDC_MINT_DEVNET } from '@/lib/programIds';

export interface Market {
  publicKey: string;
  question: string;
  closeTime: Date;
  totalYes: number;
  totalNo: number;
  status: 'Open' | 'Closed' | 'Resolved';
  outcome?: boolean;
}

export function useMarkets() {
  const wallet = useAnchorWallet();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarkets() {
      // If no wallet, don't try to fetch markets - just show empty state
      if (!wallet) {
        setMarkets([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const marketProgram = getMarketFactoryProgram(wallet);
        const poolProgram = getBettingPoolProgram(wallet);

        // Fetch all market accounts
        const marketAccounts = await (marketProgram.account as any).market.all();

        // Fetch the betting pool to get actual bet totals
        const poolPDA = getBettingPoolPDA(USDC_MINT_DEVNET);
        let poolData = null;

        try {
          poolData = await (poolProgram.account as any).bettingPool.fetch(poolPDA);
        } catch (err) {
          console.log('Betting pool not initialized yet');
        }

        const formattedMarkets: Market[] = marketAccounts.map((account: any) => {
          const data = account.account;

          // Determine status
          let status: 'Open' | 'Closed' | 'Resolved' = 'Open';
          if (data.status.resolved) {
            status = 'Resolved';
          } else if (data.status.closed) {
            status = 'Closed';
          }

          // Get totals from betting pool if available, otherwise use market data
          const totalYes = poolData
            ? poolData.totalYesAmount.toNumber() / 1_000_000
            : data.totalYesAmount.toNumber() / 1_000_000;
          const totalNo = poolData
            ? poolData.totalNoAmount.toNumber() / 1_000_000
            : data.totalNoAmount.toNumber() / 1_000_000;

          return {
            publicKey: account.publicKey.toString(),
            question: data.question,
            closeTime: new Date(data.closeTime.toNumber() * 1000),
            totalYes,
            totalNo,
            status,
            outcome: data.outcome,
          };
        });

        setMarkets(formattedMarkets);
      } catch (err) {
        console.error('Error fetching markets:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch markets');
        setMarkets([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMarkets();
  }, [wallet]);

  return { markets, loading, error, refetch: () => {} };
}
