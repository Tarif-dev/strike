import {
  Calendar,
  Trophy,
  Users,
  Clock,
  Zap,
  AlertCircle,
  Play,
  Database,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MatchData } from "./MatchCard";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { Program, BN } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { IDL } from "@/idl/strike_contracts_new";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * AdminMatchCard
 * 
 * Component for displaying match data from the Cricbuzz API and providing
 * functionality for administrators to initialize match pools on both the
 * database and blockchain.
 * 
 * Used in InitializeMatches.tsx admin page.
 */

// Initialize program ID outside of component
const PROGRAM_ID = new PublicKey(
  "2Bnp9uikuv1EuAfHbcXizF8FcqNDKQg7hfuKbLC9y6hT"
);

const USDC_MINT = new PublicKey(
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
);

interface AdminMatchCardProps {
  match: MatchData;
  className?: string;
  onInitialize?: (matchId: string) => void;
  alreadyInitialized?: boolean;
}

export default function AdminMatchCard({
  match,
  className,
  onInitialize,
  alreadyInitialized = false
}: AdminMatchCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const wallet = useWallet();
  const { connection } = useConnection();
  
  const [initializing, setInitializing] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const [txComplete, setTxComplete] = useState(false);

  if (
    !match ||
    !match.teams ||
    !match.teams.home ||
    !match.teams.away ||
    !match.tournament
  ) {
    return (
      <Card
        className={cn(
          "overflow-hidden bg-gray-900/80 border-gray-800",
          className
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-center py-8 text-gray-400">
            <AlertCircle className="w-5 h-5 mr-2 opacity-70" />
            <p>Match data unavailable</p>
          </div>
        </CardContent>
      </Card>
    );
  }  
  const isLive = match.status === "live";
  const isCompleted = match.status === "completed";
  
  const formatDate = (dateString: string) => {
    try {
      // For null or undefined input
      if (!dateString) {
        return "Date TBD";
      }
      
      // Try to parse the date string as a timestamp (milliseconds since epoch)
      const timestamp = parseInt(dateString);
      if (!isNaN(timestamp)) {
        const date = new Date(timestamp);
        // Check if date is valid
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      }
      
      // If it's not a timestamp, try to parse as ISO date string
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // If all parsing fails, format current date as fallback
      const now = new Date();
      now.setHours(now.getHours() + 24); // Tomorrow
      return now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + " (fallback)";
    } catch (e) {
      console.error("Error formatting date:", e, "Input was:", dateString);
      return "Date Error";
    }
  };

  // Function to initialize match pool on blockchain and database
  const initializeMatchPool = async () => {
    if (!user || !wallet.publicKey || !wallet.connected) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in and wallet connected to initialize matches",
      });
      return;
    }

    setInitializing(true);
    setTxStatus("Preparing initialization...");
    
    try {
      // 1. Prepare data for database and blockchain
      // Log the raw date value for debugging
      console.log("Raw match startTime value:", match.startTime);
      
      // Generate a registration end time (1 hour before match)
      let matchDateTime;
      
      // Check if it's a timestamp (number) and try to parse it
      const timestamp = parseInt(match.startTime);
      if (!isNaN(timestamp)) {
        matchDateTime = new Date(timestamp);
        console.log("Parsed as timestamp:", matchDateTime);
      } else {
        // If not a timestamp, try to parse as ISO date string
        matchDateTime = new Date(match.startTime);
        console.log("Parsed as date string:", matchDateTime);
      }
      
      // Validate start time
      if (isNaN(matchDateTime.getTime())) {
        console.error("Could not parse match start time:", match.startTime);
        
        // Set a fallback date (current time + 24 hours)
        matchDateTime = new Date();
        matchDateTime.setHours(matchDateTime.getHours() + 24);
        console.log("Using fallback date:", matchDateTime);
        
        toast({
          title: "Date Issue",
          description: "Using fallback date for this match. Please verify match time."
        });
      }
      
      const registrationEndTime = new Date(matchDateTime);
      registrationEndTime.setHours(registrationEndTime.getHours() - 1);
      
      // Use match_id from API as identifier
      const matchId = match.id;
      
      if (!matchId) {
        throw new Error("Match ID is missing");
      }
      
      // Create a shorter match ID for Solana by taking the first 8 characters
      // This is used for blockchain but not stored directly in Supabase
      const shortMatchId = matchId.substring(0, 8);
      
      // Match data to be stored in Supabase
      const matchDetails = {
        id: matchId,
        shortId: shortMatchId,
        date: matchDateTime.toISOString(),
        status: "upcoming",
        registrationEndTime: registrationEndTime.toISOString(),
        teams: {
          home: {
            name: match.teams.home.name,
            code: match.teams.home.code,
            logo: match.teams.home.logo,
          },
          away: {
            name: match.teams.away.name,
            code: match.teams.away.code,
            logo: match.teams.away.logo,
          },
        },
        venue: match.venue,
        result: null, // No result yet for new match
      };

      setTxStatus("Storing match data in database...");
      
      // Generate a UUID for the database - Supabase expects match_id to be UUID
      const uuidString = crypto.randomUUID();
      
      console.log("Generated UUID for database:", uuidString, "Original match ID:", matchId);
      
      // 1. First, store in Supabase
      const { data, error } = await supabase
        .from("matches")
        .insert({
          match_id: uuidString, // Use generated UUID for Supabase
          admin: user.id,
          match_details: matchDetails, // Store original match ID in the details JSON
          registration_end_time: registrationEndTime.toISOString(),
          is_active: true,
          is_finalized: false,
          total_deposited: 0,
          bump: 1,
          token_bump: 1,
        })
        .select();

      if (error) {
        console.error("Error storing match data in Supabase:", error);
        throw error;
      }

      // 2. Now initialize the match on the blockchain
      setTxStatus("Preparing blockchain transaction...");

      // Create Anchor provider with proper preflightCommitment
      const provider = new anchor.AnchorProvider(connection, wallet, {
        commitment: "confirmed",
      });

      // Create program instance using the IDL
      const program = new Program(IDL, provider);

      // Convert JavaScript Date to Solana compatible Unix timestamp (seconds)
      const unixRegistrationEndTime = Math.floor(
        registrationEndTime.getTime() / 1000
      );

      // Use the shorter match ID for Solana PDA derivation
      const matchIdBuffer = Buffer.from(match.id);

      setTxStatus("Deriving program addresses...");

      // Find PDA for the match pool
      const [matchPoolPDA, matchBump] = await PublicKey.findProgramAddress(
        [Buffer.from("match_pool"), matchIdBuffer],
        PROGRAM_ID
      );

      // Find PDA for the pool token account
      const [poolTokenPDA, tokenBump] = await PublicKey.findProgramAddress(
        [Buffer.from("pool_token"), matchIdBuffer],
        PROGRAM_ID
      );

      setTxStatus("Building transaction...");

      try {
        // Log account data to help diagnose issues
        console.log("Transaction accounts:", {
          matchPool: matchPoolPDA.toString(),
          poolTokenAccount: poolTokenPDA.toString(),
          tokenMint: USDC_MINT.toString(),
          admin: wallet.publicKey.toString(),
          bumps: { matchBump, tokenBump },
          shortMatchId,
        });

        // Create the instruction using program methods
        const ix = await program.methods
          .initialize(
            shortMatchId, // Using the shorter ID format for Solana
            new BN(unixRegistrationEndTime)
          )
          .accounts({
            matchPool: matchPoolPDA,
            poolTokenAccount: poolTokenPDA,
            tokenMint: USDC_MINT,
            admin: wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: new PublicKey(
              "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ),
            associatedTokenProgram: new PublicKey(
              "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
            ),
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .instruction();

        // Add the instruction to the transaction
        const transaction = new Transaction().add(ix);
        const { blockhash } = await connection.getLatestBlockhash("confirmed");
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
        
        // Simulate transaction before sending
        try {
          console.log("Simulating transaction before sending...");
          const { value: simulationResult } =
            await connection.simulateTransaction(transaction);

          console.log("Simulation result:", simulationResult);

          if (simulationResult.err) {
            console.error("Simulation error:", simulationResult.err);
            if (simulationResult.logs) {
              console.error("Simulation logs:", simulationResult.logs);
              const programErrorLog = simulationResult.logs
                .filter(
                  (log) =>
                    log.includes("Program log:") ||
                    log.includes("Program failed")
                )
                .join("\n");

              if (programErrorLog) {
                throw new Error(`Program simulation error: ${programErrorLog}`);
              }
            }
            throw new Error(
              `Simulation failed: ${JSON.stringify(simulationResult.err)}`
            );
          } else {
            console.log("Simulation successful. Proceeding with transaction.");
          }
        } catch (simError) {
          console.error("Error during simulation:", simError);
          throw new Error(`Transaction simulation failed: ${simError.message}`);
        }
        
        setTxStatus("Requesting wallet signature...");
        
        const signature = await wallet.sendTransaction(transaction, connection, {
          skipPreflight: false,
          preflightCommitment: "processed",
          maxRetries: 3,
        });

        console.log("Transaction sent! Signature:", signature);
        
        setTxStatus(
          `Transaction sent! Signature: ${signature.substring(0, 8)}...`
        );
        setTxSignature(signature);

        // Wait for confirmation
        const confirmationStatus = await connection.confirmTransaction(
          signature,
          "confirmed"
        );

        if (confirmationStatus.value.err) {
          throw new Error(
            `Transaction failed: ${JSON.stringify(
              confirmationStatus.value.err
            )}`
          );
        }

        setTxStatus("Transaction confirmed! Match initialized successfully.");
        setTxComplete(true);

        // Show success message
        toast({
          title: "Match Initialized",
          description: `${match.teams.home.name} vs ${match.teams.away.name} on ${formatDate(match.startTime)} is now initialized.`,
        });

        // Callback if provided
        if (onInitialize) {
          onInitialize(match.id);
        }
      } catch (txError) {
        console.error("Transaction error:", txError);

        // Check for specific error types
        if (txError.message?.includes("User rejected")) {
          setTxStatus("Transaction rejected by user");
          throw new Error(
            "You declined the transaction in your wallet. Please try again."
          );
        } else {
          setTxStatus(`Transaction failed: ${txError.message}`);
          throw txError;
        }
      }
    } catch (error) {
      console.error("Error initializing match:", error);
      toast({
        variant: "destructive",
        title: "Failed to initialize match",
        description:
          error instanceof Error 
            ? error.message 
            : "An unknown error occurred",
      });
    } finally {
      setTimeout(() => {
        setInitializing(false);
      }, 2000);
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden bg-gray-900/80 border-gray-800 hover:border-neon-green/30 transition-all",
        className
      )}
    >
      <CardContent className="p-4 md:p-6">
        {/* Date and tournament */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center text-xs text-gray-400 gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(match.startTime)}</span>
          </div>
          <Badge
            variant="outline"
            className="text-neon-green border-neon-green/30 text-xs px-2"
          >
            {match.tournament.name}
          </Badge>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between my-4">
          <div className="flex-1 flex flex-col items-center">
            <div className="w-16 h-16 relative mb-2">
              <img
                src={match.teams.home.logo || "/team_logos/tbd.jpeg"}
                alt={match.teams.home.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.log(`Error loading team logo: ${match.teams.home.logo}`);
                  e.currentTarget.src = "/team_logos/tbd.jpeg";
                }}
              />
            </div>
            <span className="font-bold text-sm text-center">
              {match.teams.home.code || "TBD"}
            </span>
          </div>

          <div className="mx-3 text-center">
            <div className="text-xs text-neon-green font-bold mb-1">VS</div>
            <div className="text-[10px] text-gray-400">
              {match.venue?.split(',')[0] || "Venue TBD"}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center">
            <div className="w-16 h-16 relative mb-2">
              <img
                src={match.teams.away.logo || "/team_logos/tbd.jpeg"}
                alt={match.teams.away.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.log(`Error loading team logo: ${match.teams.away.logo}`);
                  e.currentTarget.src = "/team_logos/tbd.jpeg";
                }}
              />
            </div>
            <span className="font-bold text-sm text-center">
              {match.teams.away.code || "TBD"}
            </span>
          </div>
        </div>

        {/* Match status badge */}
        <div className="flex items-center justify-center gap-2 my-3">
          {isLive ? (
            <Badge className="bg-red-500 border-0 text-white animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full mr-1.5"></span>
              LIVE
            </Badge>
          ) : isCompleted ? (
            <Badge className="bg-gray-700 border-0 text-gray-300">
              COMPLETED
            </Badge>
          ) : (
            <Badge className="bg-yellow-600 border-0 text-white">UPCOMING</Badge>
          )}
        </div>

        {/* Admin actions section */}
        <div className="mt-4">
          {alreadyInitialized ? (
            <div className="flex items-center justify-center text-neon-green/80 bg-neon-green/10 p-2 rounded-md">
              <Database className="w-4 h-4 mr-2" />
              <span className="text-sm">Already Initialized</span>
            </div>
          ) : (
            <Button 
              className="w-full bg-neon-green text-gray-900 hover:bg-neon-green/90 flex items-center justify-center"
              onClick={initializeMatchPool}
              disabled={initializing || txComplete}
            >
              {initializing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {txStatus ? (
                    <span className="truncate max-w-[180px]">{txStatus}</span>
                  ) : (
                    "Initializing..."
                  )}
                </>
              ) : txComplete ? (
                <>
                  <Trophy className="w-4 h-4 mr-2" />
                  Match Initialized
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Initialize Pool
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
