import { PublicKey } from '@solana/web3.js';

// Deployed program IDs on Solana Devnet
export const PROGRAM_IDS = {
  marketFactory: new PublicKey('FANZBSDyC6JjQViH5aXiuVqg2gsEJQZRSMdVGWnTn5zz'),
  bettingPool: new PublicKey('52a6eQd5ocZUnjudnFHuaqVSNHGQ9jzvFKiDgD9qvu2e'),
} as const;

// USDC mint on devnet (USDC-Dev from spl-token-faucet)
export const USDC_MINT_DEVNET = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr');

// Network config
export const NETWORK = 'devnet';
export const RPC_ENDPOINT = 'https://api.devnet.solana.com';
