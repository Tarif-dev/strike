import { useState, useEffect } from 'react';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import { IDL } from '@/idl/strike_contracts_new';
import { toast } from '@/hooks/use-toast';

// The program ID from your application
const PROGRAM_ID = new PublicKey('2Bnp9uikuv1EuAfHbcXizF8FcqNDKQg7hfuKbLC9y6hT');

/**
 * Fetch the total prize pool for a given match
 * 
 * @param matchId - The ID of the match
 * @param connection - Solana connection object
 * @param wallet - Solana wallet context
 * @returns Promise resolving to the prize pool amount in USDC
 */
export const fetchPrizePool = async (
  matchId: string,
  connection: Connection, 
  wallet: WalletContextState
): Promise<string> => {
  if (!matchId || !connection) {
    console.log("Match ID or connection not available");
    return "0";
  }

  try {
    // Create provider and program
    console.log("Match ID:", matchId);
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    const program = new Program(IDL, provider);
    
    // Use the short match ID for PDA derivation
    const shortMatchId = matchId.split("-")[0];
    const matchIdBuffer = Buffer.from(shortMatchId);
    
    // Derive the match pool PDA
    const [matchPoolPDA] = await PublicKey.findProgramAddress(
      [Buffer.from("match_pool"), matchIdBuffer],
      PROGRAM_ID
    );
    
    // Fetch the match pool account data
    const matchPoolAccount = await program.account.matchPool.fetch(matchPoolPDA);
    
    // Get the total deposited amount
    console.log("Match pool account:", matchPoolAccount);
    const totalDeposited = matchPoolAccount.totalDeposited;
    console.log("Total deposited:", totalDeposited.toString());
    
    // Convert from lamports to USDC (assuming 6 decimals for USDC)
    const totalDepositedUsdc = (totalDeposited.toNumber() / 1_000_000).toFixed(2);
    
    console.log("Total pool deposits:", totalDepositedUsdc, "USDC");
    
    return totalDepositedUsdc;
  } catch (error) {
    console.error("Error fetching prize pool:", error);
    toast({
      title: "Error fetching prize pool",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return "0";
  }
};

/**
 * React hook for fetching and using the prize pool
 * 
 * @param matchId - The ID of the match
 * @param connection - Solana connection object
 * @param wallet - Solana wallet context
 * @returns Object containing prize pool, loading state, and refresh function
 */
export const usePrizePool = (
  matchId: string | undefined,
  connection: Connection | null,
  wallet: WalletContextState
) => {
  const [prizePool, setPrizePool] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrizePoolData = async () => {
    if (!matchId || !connection || !wallet.connected) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pool = await fetchPrizePool(matchId, connection, wallet);
      setPrizePool(pool);
    } catch (err) {
      console.error("Error in usePrizePool:", err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (matchId && connection && wallet.connected) {
      fetchPrizePoolData();
    }
  }, [matchId, connection, wallet.connected]);

  return {
    prizePool,
    loading,
    error,
    refetch: fetchPrizePoolData
  };
};
