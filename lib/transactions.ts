import { AnchorWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, PublicKey, SYSVAR_RENT_PUBKEY, Transaction } from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { getMarketFactoryProgram, getBettingPoolProgram, getMarketPDA, getBettingPoolPDA, getConnection } from './anchorClient';
import { USDC_MINT_DEVNET } from './programIds';
import * as anchor from '@coral-xyz/anchor';

export async function createMarket(
  wallet: AnchorWallet,
  question: string,
  closeTime: Date,
  resolutionTime: Date
) {
  const marketProgram = getMarketFactoryProgram(wallet);
  const poolProgram = getBettingPoolProgram(wallet);
  const connection = getConnection();

  // Derive market PDA from authority + question
  const marketPDA = getMarketPDA(wallet.publicKey, question);

  const closeTimeUnix = Math.floor(closeTime.getTime() / 1000);
  const resolutionTimeUnix = Math.floor(resolutionTime.getTime() / 1000);

  // Step 1: Create the market
  const marketTx = await marketProgram.methods
    .createMarket(question, new anchor.BN(closeTimeUnix), new anchor.BN(resolutionTimeUnix))
    .accounts({
      market: marketPDA,
      authority: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log('Market created:', marketTx);

  // Step 2: Initialize the betting pool ONLY if it doesn't exist yet
  const poolPDA = getBettingPoolPDA(USDC_MINT_DEVNET);
  const poolAccount = await connection.getAccountInfo(poolPDA);

  let poolTx = null;

  if (!poolAccount) {
    console.log('Pool does not exist, initializing...');

    const [vaultPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), poolPDA.toBuffer()],
      poolProgram.programId
    );

    poolTx = await poolProgram.methods
      .initializePool(marketPDA)
      .accounts({
        pool: poolPDA,
        vault: vaultPDA,
        usdcMint: USDC_MINT_DEVNET,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    console.log('Pool initialized:', poolTx);
  } else {
    console.log('Pool already exists, skipping initialization');
  }

  return { signature: marketTx, marketPDA, poolSignature: poolTx, poolPDA };
}

export async function placeBet(
  wallet: AnchorWallet,
  marketPubkey: PublicKey,
  amount: number,
  prediction: 'YES' | 'NO'
) {
  const program = getBettingPoolProgram(wallet);
  const connection = getConnection();

  // Convert USDC amount to lamports (6 decimals)
  const amountLamports = Math.floor(amount * 1_000_000);

  // Derive PDAs (pool is derived from USDC mint, not market)
  const poolPDA = getBettingPoolPDA(USDC_MINT_DEVNET);

  const [betPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('bet'),
      poolPDA.toBuffer(),
      wallet.publicKey.toBuffer(),
    ],
    program.programId
  );

  const [vaultPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('vault'),
      poolPDA.toBuffer(),
    ],
    program.programId
  );

  // Get user's USDC token account
  const bettorUsdc = await getAssociatedTokenAddress(
    USDC_MINT_DEVNET,
    wallet.publicKey
  );

  console.log('=== Bet Transaction Debug ===');
  console.log('USDC Mint:', USDC_MINT_DEVNET.toString());
  console.log('User USDC Account:', bettorUsdc.toString());
  console.log('User Wallet:', wallet.publicKey.toString());

  // Check if the USDC token account exists, create it if not
  const accountInfo = await connection.getAccountInfo(bettorUsdc);
  console.log('USDC Account exists?', accountInfo !== null);

  if (accountInfo) {
    // Check the actual balance
    try {
      const tokenBalance = await connection.getTokenAccountBalance(bettorUsdc);
      console.log('USDC Balance:', tokenBalance.value.uiAmount, 'USDC');
      console.log('USDC Balance (raw):', tokenBalance.value.amount);

      if (parseFloat(tokenBalance.value.amount) < amountLamports) {
        throw new Error(`Insufficient USDC balance. You have ${tokenBalance.value.uiAmount} USDC but need ${amount} USDC. Make sure you got USDC from the correct mint: ${USDC_MINT_DEVNET.toString()}`);
      }
    } catch (error: any) {
      if (error.message.includes('Insufficient')) {
        throw error;
      }
      console.error('Error checking balance:', error);
    }
  }

  if (!accountInfo) {
    console.log('Creating USDC token account for user...');

    // Create the associated token account first
    const createAtaIx = createAssociatedTokenAccountInstruction(
      wallet.publicKey, // payer
      bettorUsdc, // associated token account
      wallet.publicKey, // owner
      USDC_MINT_DEVNET, // mint
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction().add(createAtaIx);
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const signed = await wallet.signTransaction(transaction);
    const createAtaTx = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(createAtaTx);

    console.log('USDC token account created:', createAtaTx);
  }

  const tx = await program.methods
    .placeBet(new anchor.BN(amountLamports), prediction === 'YES')
    .accounts({
      pool: poolPDA,
      bet: betPDA,
      vault: vaultPDA,
      bettorUsdc: bettorUsdc,
      bettor: wallet.publicKey,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();

  return { signature: tx, betPDA };
}
