// This function can be used to replace the distributePrizeBlockchain function in MatchDetailAdmin.tsx
// Handles the Solana blockchain prize distribution with proper error handling

const distributePrizeBlockchain = async (matchId: string, amounts: {[key: string]: number}) => {
  try {
    console.log("Starting blockchain prize distribution for match:", matchId);
    console.log("Prize amounts to distribute:", amounts);

    // The program ID from your application
    const PROGRAM_ID = new PublicKey('2Bnp9uikuv1EuAfHbcXizF8FcqNDKQg7hfuKbLC9y6hT');

    // Get Solana connection
    const connection = new Connection(import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com');

    if (!wallet.connected || !wallet.publicKey) {
      throw new Error("Wallet not connected. Please connect your wallet to distribute prizes.");
    }

    // Create provider and program
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    const program = new Program(IDL, provider);

    // Use the short match ID for PDA derivation (same as in fetchPrizePool)
    const shortMatchId = matchId;
    const matchIdBuffer = Buffer.from(shortMatchId);

    // Derive the match pool PDA
    const [matchPoolPDA] = await PublicKey.findProgramAddress(
      [Buffer.from("match_pool"), matchIdBuffer],
      PROGRAM_ID
    );

    // Derive the pool token account
    const [poolTokenPDA] = await PublicKey.findProgramAddress(
      [Buffer.from("pool_token"), matchIdBuffer],
      PROGRAM_ID
    );
    
    // Check if the match is already finalized
    try {
      const matchPoolAccount = await program.account["matchPool"].fetch(matchPoolPDA);
      console.log("Match pool account:", matchPoolAccount);
      
      // If not finalized, call the end_match function first
      if (!matchPoolAccount.isFinalized) {
        console.log("Match not finalized yet. Finalizing match first...");
        
        // Execute the end_match instruction
        const endMatchTx = await program.methods
          .endMatch()
          .accounts({
            match_pool: matchPoolPDA,
            admin: wallet.publicKey,
            system_program: SystemProgram.programId,
          })
          .rpc({
            skipPreflight: true,  // Skip transaction simulation
            commitment: 'confirmed'
          });
        
        console.log("Match finalization transaction successful:", endMatchTx);
        
        // Wait for confirmation
        const confirmation = await connection.confirmTransaction(endMatchTx, 'confirmed');
        console.log("Match finalization confirmed:", confirmation);
      } else {
        console.log("Match is already finalized, proceeding to prize distribution");
      }
    } catch (error) {
      console.error("Error checking match finalization status:", error);
      throw new Error("Failed to check match status: " + (error instanceof Error ? error.message : String(error)));
    }

    // Get team wallet addresses and convert amounts to the format expected by the contract
    const teamPromises = Object.keys(amounts).map(async (teamId) => {
      // Fetch team details to get wallet address
      const { data: teamData } = await supabase
        .from("teams")
        .select("id, wallet_address")
        .eq("id", teamId)
        .single();

      if (!teamData || !teamData.wallet_address) {
        throw new Error(`No wallet address found for team ${teamId}`);
      }

      return {
        teamId,
        walletAddress: teamData.wallet_address,
        amount: amounts[teamId]
      };
    });

    const teamsWithWallets = await Promise.all(teamPromises);

    // Create the prize distributions array in the format expected by the contract
    const prizeDistributions = teamsWithWallets.map(team => ({
      user: new PublicKey(team.walletAddress),
      // Convert USDC to lamports (assuming 6 decimals for USDC)
      amount: new anchor.BN(Math.floor(team.amount * 1_000_000))
    }));
    console.log("Prize distributions:", prizeDistributions);

    console.log("Prepared prize distributions:", prizeDistributions);

    try {
      // Execute the distribute_prizes instruction
      const tx = await program.methods
        .distributePrizes(prizeDistributions)
        .accounts({
          match_pool: matchPoolPDA,
          pool_token_account: poolTokenPDA,
          admin: wallet.publicKey,
          token_program: TOKEN_PROGRAM_ID,
          system_program: SystemProgram.programId,
        })
        .rpc({
          skipPreflight: true,  // Skip transaction simulation 
          commitment: 'confirmed'
        });

      console.log("Prize distribution transaction successful:", tx);
      
      // Record the transaction in the database if needed
      // ...
      
      return tx;
    } catch (txError: any) {
      console.error("Error in distribution transaction:", txError);
      
      // Check for "Transaction simulation failed" error specifically mentioning "already been processed"
      if (txError.message && 
          txError.message.includes("Transaction simulation failed") && 
          txError.message.includes("This transaction has already been processed")) {
        
        console.log("This transaction has already been processed - prizes were already distributed");
        toast({
          title: "Prize Distribution Successful",
          description: "The prizes were already distributed for this match.",
        });
        
        return "Transaction already processed"; // Return a replacement transaction ID
      }
      
      // For other errors, propagate them
      throw txError;
    }
  } catch (error: any) {
    console.error("Error distributing prizes on blockchain:", error);
    toast({
      variant: "destructive",
      title: "Blockchain Distribution Failed",
      description: error instanceof Error ? error.message : "Failed to distribute prizes on the blockchain",
    });
    throw error;
  }
}
