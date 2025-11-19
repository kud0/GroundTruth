import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { PROGRAM_IDS, NETWORK } from './programIds';
import { MARKET_FACTORY_IDL } from './idl/market_factory_idl';
import { BETTING_POOL_IDL } from './idl/betting_pool_idl';

// Cast to Idl with proper typing
const marketFactoryIdl = MARKET_FACTORY_IDL as any as Idl;
const bettingPoolIdl = BETTING_POOL_IDL as any as Idl;

export function getConnection() {
  const endpoint = NETWORK === 'devnet'
    ? 'https://api.devnet.solana.com'
    : 'https://api.mainnet-beta.solana.com';
  return new Connection(endpoint, 'confirmed');
}

export function getProvider(wallet: AnchorWallet) {
  const connection = getConnection();
  return new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });
}

export function getMarketFactoryProgram(wallet: AnchorWallet) {
  const provider = getProvider(wallet);
  try {
    return new Program(
      marketFactoryIdl,
      provider
    );
  } catch (error) {
    console.error('Error creating program:', error);
    console.log('IDL:', marketFactoryIdl);
    console.log('Provider:', provider);
    throw error;
  }
}

export function getBettingPoolProgram(wallet: AnchorWallet) {
  const provider = getProvider(wallet);
  try {
    return new Program(
      bettingPoolIdl,
      provider
    );
  } catch (error) {
    console.error('Error creating betting pool program:', error);
    throw error;
  }
}

// Helper to derive market PDA (uses authority + question as seeds)
// NOTE: Question must be kept short (max 32 chars) due to Solana PDA seed limits
export function getMarketPDA(authority: PublicKey, question: string) {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('market'),
      authority.toBuffer(),
      Buffer.from(question),
    ],
    PROGRAM_IDS.marketFactory
  );
  return pda;
}

// Helper to derive betting pool PDA (uses USDC mint as seed)
export function getBettingPoolPDA(usdcMint: PublicKey) {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('pool'),
      usdcMint.toBuffer(),
    ],
    PROGRAM_IDS.bettingPool
  );
  return pda;
}
