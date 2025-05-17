import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageContainer from "@/components/layout/PageContainer";
import { useSupabaseMatch } from "@/hooks/useSupabaseMatch";
import { testDatabaseConnection, testMatchAccess } from "@/utils/database-test";
import { 
  calculatePlayerPoints as calcFantasyPoints, 
  getPlayerId, 
  getPlayerName,
  findPlayerDetails 
} from "@/utils/fantasy-helpers";
import { fetchPrizePool } from "@/utils/prize-pool";
import { calculatePrizeDistribution } from "@/utils/prize-distribution";
import { calculateEnhancedPrizeDistribution } from "@/utils/enhanced-prize-distribution";
import { processPrizeDistribution } from "@/utils/prize-transaction";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { IDL } from "@/idl/strike_contracts_new";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  ArrowLeft,
  Award,
  Calculator,
  Check,
  ChevronDown,
  Clock,
  Edit,
  FileText,
  Info,
  Loader2,
  Save,
  Search,
  Table,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table as UITable,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { PlayerPerformance, PlayerWithPoints, TeamData, MatchDetailsData, ExtendedMatchData } from "@/types/match";
import { Json } from "@/integrations/supabase/types";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {sampleScoreCard} from "../../samples/sample-scorecard.js"
import axios from "axios"
import { API_KEY } from "@/utils/config.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Scoring rules for cricket fantasy
const SCORING_RULES = {
  BATTING: {
    RUN: 1 as number,
    FOUR: 4 as number,
    SIX: 6 as number,
    FIFTY: 10 as number,
    HUNDRED: 20 as number,
    DUCK: -5 as number,
    STRIKE_RATE_BONUS: {
      GT_170: 6 as number,
      GT_150: 4 as number,
      GT_130: 2 as number
    }
  },
  BOWLING: {
    WICKET: 25 as number,
    LBW_BOWLED: 8 as number,
    THREE_WICKETS: 10 as number,
    FOUR_WICKETS: 15 as number,
    FIVE_WICKETS: 25 as number,
    MAIDEN_OVER: 4 as number,
    ECONOMY_BONUS: {
      LT_5: 6 as number,
      LT_6: 4 as number,
      LT_7: 2 as number
    },
    ECONOMY_PENALTY: {
      GT_10: -2 as number,
      GT_11: -4 as number,
      GT_12: -6 as number
    }
  },
  FIELDING: {
    CATCH: 8 as number, 
    THREE_CATCHES: 4 as number,
    STUMPING: 10 as number,
    RUN_OUT: 6 as number
  },
  CAPTAIN_MULTIPLIER: 2 as number,
  VICE_CAPTAIN_MULTIPLIER: 1.5 as number
};

// Match detail page component
const MatchDetailAdmin = () => {
  const { matchId, id } = useParams<{ matchId: string, id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { match: baseMatch, loading, error } = useSupabaseMatch(id || null);
  const match = baseMatch as ExtendedMatchData | null;
   const wallet = useWallet();
   const { connection } = useConnection();
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("teams");
  const [playerPerformances, setPlayerPerformances] = useState<Record<string, PlayerPerformance>>({});
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [calculatingPoints, setCalculatingPoints] = useState(false);
  const [distributingPrizes, setDistributingPrizes] = useState(false);
  const [showDistributeDialog, setShowDistributeDialog] = useState(false);
  const [matchScorecard, setMatchScorecard] = useState<MatchDetailsData | null>(null);
  const [loadingScorecard, setLoadingScorecard] = useState(false);
  const [prizeDistributionMessage, setPrizeDistributionMessage] = useState("");
  const [selectedPlayerForEdit, setSelectedPlayerForEdit] = useState<string | null>(null);
  const [editingPerformance, setEditingPerformance] = useState<PlayerPerformance>({});
  const [totalPoolDeposits, setTotalPoolDeposits] = useState<string>("0");
  const [isMatchCompleted, setIsMatchCompleted] = useState<boolean | null>(null);
  const [scoreCard, setscoreCard] = useState("")
  
  const getScoreCard=async()=>{
    const options = {
  method: 'GET',
  url: `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/scard`,
  headers: {
    'x-rapidapi-key': "014abe6e35msh76ef70851596118p1e000fjsn01ac2f8b6c4d",
    'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
  }
};

try {
  
	const response = await axios.request(options);
	console.log(response.data);
  const completed = response?.data?.isMatchComplete || false;
  
  if(completed){
    const scorecard=response?.data?.scoreCard;
    console.log("Scorecard data:", response.data.scorecard);
    const scorecard2=response?.data?.scorecard;
    if(scorecard2&&scorecard2.length>0){
      const innings1=Object.values(scorecard2[0].batsman);
      innings1.forEach((batsman)=>{
        batsman.batId=batsman.id;
      });
      const innings2=Object.values(scorecard2[1].batsman);
      innings2.forEach((batsman)=>{
        batsman.batId=batsman.id;
      });
      const bowlerinnings1=Object.values(scorecard2[0].bowler);
      bowlerinnings1.forEach((bowler)=>{
        bowler.bowlerId=bowler.id;
      });
      const bowlerinnings2=Object.values(scorecard2[1].bowler);
      bowlerinnings2.forEach((bowler)=>{
        bowler.bowlerId=bowler.id;
      });
      const allscores=[...innings1, ...innings2, ...bowlerinnings1, ...bowlerinnings2];
      setIsMatchCompleted(completed);
      setscoreCard(allscores);
      console.log("Allscores:", allscores);
      return allscores;
    }
    console.log("Scorecard data:", scorecard);
    const innings1=Object.values(scorecard[0].batTeamDetails?.batsmenData);
    const innings2=Object.values(scorecard[1].batTeamDetails?.batsmenData);
    const bowlerinnings1=Object.values(scorecard[0].bowlTeamDetails?.bowlersData);
    const bowlerinnings2=Object.values(scorecard[1].bowlTeamDetails?.bowlersData);
      const allscores=[...innings1, ...innings2, ...bowlerinnings1, ...bowlerinnings2];
       setIsMatchCompleted(completed);
       setscoreCard(allscores);

      return allscores;
      
     
  }
  else{
    console.log("Match not completed yet");
    return
  }
} catch (error) {
  
	console.error("score card not getting error",error);
  return
}
}
  useEffect(() => {
    if (!matchId) return;
    
    const runDiagnostics = async () => {
      try {
        // Test basic database connectivity
        const connectionTest = await testDatabaseConnection();
        console.log("Database connection test:", connectionTest);
        
        // Test match-specific access
        const matchTest = await testMatchAccess(matchId);
        console.log("Match access test:", matchTest);
      } catch (error) {
        console.error("Error running diagnostics:", error);
      }
    };
    
    runDiagnostics();
  }, [matchId]);

  // Fetch teams for this match
  useEffect(() => {
    if (!matchId) return;
    const fetchTeams = async () => {
      try {
        setLoadingTeams(true);
        
        // First, check if we have data in the teams table
        const { count, error: countError } = await supabase
          .from("teams")
          .select("*", { count: "exact", head: true })
          .eq("match_id", matchId);
        
        if (countError) {
          throw countError;
        }
        
        console.log(`Found ${count} teams for match ${matchId}`);
        
        if (count === 0) {
          // No teams found
          setTeams([]);
          return;
        }
        
        // Fetch teams from the teams table without trying to join profiles
        const { data, error } = await supabase
          .from("teams")
          .select("*")
          .eq("match_id", matchId)
          .order("total_points", { ascending: false });
        
        if (error) {
          throw error;
        }
     
        
        // Ensure proper typing for the teams data
        // console.log("Players data structure:", data[0].players)
        console.log("Players data structure:", data[0])
        // Log the first player to see its structure
        if (Array.isArray(data[0].players) && data[0].players.length > 0) {
          console.log("First player data:", data[0].players[0])
        }
        const typedTeams = (data || []).map(team => {
          // Extract player IDs correctly based on the structure
          const playerIds = Array.isArray(team.players) 
            ? team.players.map(player => {
                // Handle both string IDs and player objects
                if (typeof player === 'string') {
                  return player;
                } else if (player && typeof player === 'object' && 'id' in player) {
                  return player.id;
                }
                return String(player);
              })
            : [];
            
          // Store the original player data for lookup purposes
          const originalPlayers = team.players;
          
          // Construct a normalized team object with string IDs
          return {
            ...team,
            id: team.id,
            user_id: team.user_id,
            team_name: team.team_name,
            match_id: team.match_id,
            players: team.players, // Keep the original data for reference
            originalPlayers: originalPlayers, // Keep the original data for reference
            captain_id: team.captain_id,
            vice_captain_id: team.vice_captain_id,
            created_at: team.created_at,
            updated_at: team.updated_at,
            // total_points: calculateTotalPoints(team.players),
            match_details: team.match_details
          } as TeamData;
        });
        
        

        setTeams(typedTeams);
        console.log("Fetched teams:", typedTeams);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch teams";
        console.error("Error fetching teams:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, []);
     const calculateTotalPoints = async(player,allplayerPerformances) => {
            let sum=0;
            console.log("Player:", player)
            console.log("All Player Performances:", allplayerPerformances)
            console.log("all players", player)
            if(!allplayerPerformances || allplayerPerformances.length==0){
              console.log("No scorecard data available")
              return 0;
            }
            player.forEach((p)=>{
               const playerId=p.id
               let performance1
               const playerPerformance=allplayerPerformances?.filter((performance)=>(performance.batId&&performance.batId==playerId)||(!(performance.batId)&&performance.bowlerId==playerId))
              
               if(playerPerformance?.length>1){
                //he is allrounder
                 performance1={...playerPerformance[0], ...playerPerformance[1]}
               }
               else{
                performance1=playerPerformance[0]
               }
               sum+=calcFantasyPoints(performance1, SCORING_RULES)
              
            })
            return sum;
  }
  const calculatePoints=async()=>{
    const scoreCard=await getScoreCard()
    if(!scoreCard){
      console.log("No scorecard data available")
      return
    }
    console.log("Scorecard data:", scoreCard)
    const t=[]
    teams.forEach(async(team)=>{
      const player=team.players
      const totalPoints=await calculateTotalPoints(player, scoreCard)
      console.log("Total points for team:", team.team_name, totalPoints)
      team={
        ...team,
        total_points: totalPoints
      };
      t.push(team)
    });
    console.log("Teams with calculated points:", teams);
    setTeams(t);
  }
  // Fetch prize pool amount
  useEffect(() => {
    if (!matchId) return;
    
    const getPrizePoolAmount = async () => {
      try {
        const poolAmount = await fetchPrizePool(matchId, connection, wallet);
        setTotalPoolDeposits(poolAmount);
      } catch (error) {
        console.error("Error fetching prize pool:", error);
      }
    };
    
    getPrizePoolAmount();
  }, [matchId, connection, wallet]);

  // Fetch match scorecard/details if available
  useEffect(() => {
    if (!matchId) return;
    
    const fetchMatchScorecard = async () => {
      try {
        setLoadingScorecard(true);
        
        // Fetch match details from matches table's match_details field
        const { data: matchData, error: matchError } = await supabase
          .from("matches")
          .select("match_details")
          .eq("match_id", id)
          .single();
        
        if (matchError) {
          throw matchError;
        }
        
        // Check if match_details has player_performances data
        if (matchData?.match_details && typeof matchData.match_details === 'object') {
          const details = matchData.match_details as Record<string, unknown>;
          
          if (details.player_performances) {
            const performances = details.player_performances as Record<string, PlayerPerformance>;
            setPlayerPerformances(performances);
            setMatchScorecard({
              match_id: matchId,
              player_performances: performances,
              updated_at: new Date().toISOString()
            });
          }
        }
      } catch (error: unknown) {
        console.error("Error fetching match scorecard:", error);
        // Don't show error toast as this might be a new match without scorecard
      } finally {
        setLoadingScorecard(false);
      }
    };

    // fetchMatchScorecard();
  }, [matchId]);

  // Helper function to extract player details
  const findPlayerById = (playerId: string): {name: string; team: string; position: string} => {
    // Try to find the player in all teams data
    for (const team of teams) {
      if (!Array.isArray(team.players)) continue;
      
      // Check each player in the team
      for (const player of team.players) {
        if (typeof player === 'object' && player !== null) {
          // Use explicit type interface to avoid any issues
          interface PlayerObject {
            id?: string;
            name?: string;
            team?: string;
            position?: string;
          }
          const playerObj = player as PlayerObject;
          if (playerObj.id === playerId) {
            return {
              name: playerObj.name ? String(playerObj.name) : String(playerId),
              team: playerObj.team ? String(playerObj.team) : "unknown",
              position: playerObj.position ? String(playerObj.position) : "unknown"
            };
          }
        }
      }
    }
    
    // Return default values if player not found
    return {
      name: String(playerId),
      team: "unknown",
      position: "unknown"
    };
  };

  // Calculate points for all teams based on player performances
  // const calculatePoints = async () => {
  //   if (!matchId || Object.keys(playerPerformances).length === 0) {
  //     toast({
  //       variant: "destructive",
  //       title: "Cannot Calculate Points",
  //       description: "No player performance data available",
  //     });
  //     return;
  //   }
    
  //   try {
  //     setCalculatingPoints(true);
       
  //     // Process each team and calculate points
  //     const updatedTeams = await Promise.all(
  //       teams.map(async (team) => {
  //         // Calculate points for each player in team
  //         let totalTeamPoints = 0;
          
  //         // Ensure player IDs are strings and the array is valid
  //         const playerIds: string[] = Array.isArray(team.players) ? team.players.map(p => String(p)) : [];
          
  //         const playerDetailsWithPoints: PlayerWithPoints[] = playerIds.map((playerId: string) => {
  //           const performance = playerPerformances[playerId] || {};
  //           console.log("Performance for player:", playerId, performance);
  //           const basePoints = calcFantasyPoints(performance, SCORING_RULES);
            
  //           let playerPoints = basePoints;
            
  //           // Apply captain/vice-captain multipliers
  //           if (playerId === team.captain_id) {
  //             playerPoints = basePoints * SCORING_RULES.CAPTAIN_MULTIPLIER;
  //           } else if (playerId === team.vice_captain_id) {
  //             playerPoints = basePoints * SCORING_RULES.VICE_CAPTAIN_MULTIPLIER;
  //           }
            
  //           totalTeamPoints += playerPoints;
            
  //           // Try to find player details from the original data structure
  //           let playerName = String(playerId);
  //           let playerTeam = "unknown";
  //           let playerPosition = "unknown";
            
  //           // Look for player objects in all teams data
  //           for (const t of teams) {
  //             if (!Array.isArray(t.originalPlayers)) continue;
  //             for (const p of t.originalPlayers) {
  //               if (typeof p === 'object' && p !== null) {
  //                 // Use explicit type interface to avoid any issues
  //                 interface PlayerObject {
  //                   id?: string;
  //                   name?: string;
  //                   team?: string;
  //                   position?: string;
  //                 }
  //                 const playerObj = p as PlayerObject;
  //                 if (playerObj.id === playerId) {
  //                   playerName = String(playerObj.name || playerId);
  //                   playerTeam = String(playerObj.team || "unknown");
  //                   playerPosition = String(playerObj.position || "unknown");
  //                   break;
  //                 }
  //               }
  //             }
  //           }
            
  //           return {
  //             id: playerId,
  //             name: playerName,
  //             team: playerTeam,
  //             position: playerPosition,
  //             basePoints,
  //             calculatedPoints: playerPoints,
  //             isCaptain: playerId === team.captain_id,
  //             isViceCaptain: playerId === team.vice_captain_id,
  //             performance
  //           };
  //         });
          
  //         // Round total points to 2 decimal places
  //         totalTeamPoints = Math.round(totalTeamPoints * 100) / 100;
          
  //         // Update team in database with calculated points
  //         const { error } = await supabase
  //           .from("teams")
  //           .update({
  //             total_points: totalTeamPoints,
  //             updated_at: new Date().toISOString()
  //           })
  //           .eq("id", team.id);
            
  //         if (error) throw error;
          
  //         return {
  //           ...team,
  //           total_points: totalTeamPoints,
  //           playerDetails: playerDetailsWithPoints,
  //           calculatedPoints: totalTeamPoints
  //         };
  //       })
  //     );
      
  //     // Sort teams by points to determine ranks
  //     const rankedTeams: TeamData[] = [...updatedTeams].sort((a, b) => {
  //       return (b.total_points || 0) - (a.total_points || 0);
  //     }).map((team, index) => ({
  //       ...team,
  //       rank: index + 1
  //     }));
      
  //     // Save match as finalized if coming from 'completed' state
  //     if (match?.status === "completed") {
  //       const { error } = await supabase
  //         .from("matches")
  //         .update({
  //           is_finalized: true
  //         })
  //         .eq("match_id", id);
          
  //       if (error) throw error;
  //     }
      
  //     // Also store player performances in match_details field of the matches table
  //     const { data: existingMatch, error: fetchError } = await supabase
  //       .from("matches")
  //       .select("match_details")
  //       .eq("match_id", id)
  //       .single();
      
  //     if (fetchError) throw fetchError;
      
  //     // Prepare updated match_details with player performances
  //     const existingDetails = existingMatch?.match_details;
  //     const updatedMatchDetails: Record<string, unknown> = {
  //       ...(typeof existingDetails === 'object' ? existingDetails : {}),
  //       player_performances: playerPerformances,
  //       updated_at: new Date().toISOString()
  //     };
      
  //     // Update the match_details field
  //     const { error: updateError } = await supabase
  //       .from("matches")
  //       .update({
  //         match_details: updatedMatchDetails as Json
  //       })
  //       .eq("match_id", id);
        
  //     if (updateError) throw updateError;
      
  //     setTeams(rankedTeams);
      
  //     toast({
  //       title: "Points Calculated",
  //       description: `Successfully calculated points for ${teams.length} teams`,
  //     });
  //   } catch (error: unknown) {
  //     const errorMessage = error instanceof Error ? error.message : "Failed to calculate points";
  //     console.error("Error calculating points:", error);
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: errorMessage,
  //     });
  //   } finally {
  //     setCalculatingPoints(false);
  //   }
  // };

  // Calculate points for an individual player
  

  // Distribute prizes to winners via blockchain
const distributePrizeBlockchain = async (matchId: string, amounts: {wallet_address: string, prize_amount: number}[]) => {
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
    
    try {
      const matchPoolAccount = await program.account["matchPool"].fetch(matchPoolPDA);
      console.log("Match pool account:", matchPoolAccount);
      
      // If not finalized, call the end_match function first
      if (!matchPoolAccount.isFinalized) {
        console.log("Match not finalized yet. Finalizing match first...");
        
     
        const endMatchTx = await program.methods
          .endMatch()
          .accounts({
            matchPool: matchPoolPDA,
            admin: wallet.publicKey,
            systemProgram: SystemProgram.programId,
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

  
    const usdcMint = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");
    console.log("Using USDC mint address:", usdcMint.toString());

    const prizeDistributions = amounts.map((amount) => ({
      user: new PublicKey(amount.wallet_address),
      // Convert USDC to lamports (assuming 6 decimals for USDC)
      amount: new anchor.BN(Math.floor(amount.prize_amount * 1_000_000))
    }));
    console.log("Prize distributions:", prizeDistributions);

    console.log("Prepared prize distributions:", prizeDistributions);

    // For each prize recipient, find or create their associated token account
    const tokenAccountPromises = prizeDistributions.map(async (prize) => {
      const [tokenAccount] = await PublicKey.findProgramAddress(
        [
          prize.user.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          usdcMint.toBuffer() 
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      
      return {
        pubkey: tokenAccount,
        isWritable: true,
        isSigner: false
      };
    });
    
    const remainingAccounts = await Promise.all(tokenAccountPromises);
    console.log("Including token accounts for winners:", remainingAccounts);
    
    // Execute the distribute_prizes instruction with the token accounts included
    const tx = await program.methods
      .distributePrizes(prizeDistributions)
      .accounts({
        matchPool: matchPoolPDA,
        poolTokenAccount: poolTokenPDA,
        admin: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts(remainingAccounts)
      .rpc({
        skipPreflight: true,  // Skip transaction simulation 
        commitment: 'confirmed'
      });

    console.log("Prize distribution transaction successful:", tx);
    
    // Record the transaction in the database - check if prize_distributions table exists
    // try {
    //   for (const team of teamsWithWallets) {
    //     await supabase
    //       .from("prize_distributions")
    //       .upsert({
    //         match_id: matchId,
    //         team_id: team.teamId,
    //         amount: team.amount,
    //         transaction_signature: tx,
    //         processed_at: new Date().toISOString()
    //       });
    //   }
    // } catch (dbError) {
    //   console.error("Error recording prize transactions in database:", dbError);
    //   // Continue even if database update fails, as the blockchain transaction was successful
    // }

    return tx;
  } catch (error) {
    console.error("Error distributing prizes on blockchain:", error);
    toast({
      variant: "destructive",
      title: "Blockchain Distribution Failed",
      description: error instanceof Error ? error.message : "Failed to distribute prizes on the blockchain",
    });
    throw error;
  }
}

  const distributePrizes = async () => {
    if (!matchId) return;
    
    try {
      setDistributingPrizes(true);
      // Ensure teams are ranked by total points
      const rankedTeams = [...teams].sort((a, b) => {
        return (b.total_points || 0) - (a.total_points || 0);
      });
      
      // If we don't have calculated points, we need to calculate first
      if (rankedTeams.some(team => team.total_points === null)) {
        toast({
          variant: "destructive",
          title: "Cannot Distribute Prizes",
          description: "Points must be calculated first",
        });
        setDistributingPrizes(false);
        return;
      }
      
      // Get fantasy prize information from match data
      if (!totalPoolDeposits) {
        toast({
          variant: "destructive",
          title: "Missing Prize Information",
          description: "No prize pool defined for this match",
        });
        setDistributingPrizes(false);
        return;
      }
      
      // Use the enhanced prize distribution utility to calculate distribution
      const enhancedDistribution = calculateEnhancedPrizeDistribution(rankedTeams, totalPoolDeposits);
      console.log("Enhanced prize distribution:", enhancedDistribution.distributions[0]);
      const amounts= enhancedDistribution.distributions;
      // Store the detailed explanation for display
     
      setPrizeDistributionMessage(enhancedDistribution.explanation);
      
      // Process the prize distribution transactions - create a compatible format for the processor
      const compatibleDistribution = {
        distributions: {},
        percentages: {},
        amounts: {},
        message: enhancedDistribution.explanation
      };
      
      // Map the enhanced distributions to the format expected by processPrizeDistribution
      rankedTeams.forEach(team => {
        // Find the team's distribution if it exists
        const teamDistribution = enhancedDistribution.distributions.find(
          // @ts-expect-error - wallet_address might be added at runtime
          dist => dist.wallet_address === team.wallet_address
        );
        
        if (teamDistribution) {
          compatibleDistribution.distributions[team.id] = `${team.team_name}: Prize awarded`;
          compatibleDistribution.amounts[team.id] = teamDistribution.prize_amount;
          // Calculate a percentage for reporting
          compatibleDistribution.percentages[team.id] = 
            (teamDistribution.prize_amount / parseFloat(totalPoolDeposits)) * 100;
        }
      });
      
      // Process the prize distribution transactions with the compatible format
      console.log("Processing prize distribution with data:", compatibleDistribution.amounts);
      // await processPrizeDistribution(matchId, rankedTeams, compatibleDistribution);

      await distributePrizeBlockchain(matchId, amounts);
 
      // Show the distribution dialog
      setShowDistributeDialog(true);
      
      toast({
        title: "Prizes Distributed",
        description: "Prize distribution has been processed successfully",
      });
    } catch (error) {
      console.error("Error distributing prizes:", error);
      toast({
        variant: "destructive",
        title: "Distribution Failed",
        description: error instanceof Error ? error.message : "Failed to distribute prizes. Please try again.",
      });
    } finally {
      setDistributingPrizes(false);
    }
  };

// Update a player's performance data
  const updatePlayerPerformance = (playerId: string, performance: PlayerPerformance) => {
    setPlayerPerformances(prev => ({
      ...prev,
      [playerId]: {
        ...(prev[playerId] || {}),
        ...performance
      }
    }));
  };

  // Save all player performances to database
  const savePlayerPerformances = async () => {
    if (!matchId) return;
    
    try {
      // Store player performances in the match_details field of the matches table
      const { data: existingMatch, error: fetchError } = await supabase
        .from("matches")
        .select("match_details")
        .eq("match_id", id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Prepare updated match_details with player performances
      const existingDetails = existingMatch?.match_details;
      const updatedMatchDetails: Record<string, unknown> = {
        ...(typeof existingDetails === 'object' ? existingDetails : {}),
        player_performances: playerPerformances,
        updated_at: new Date().toISOString()
      };
      
      // Update the match_details field
      const { error: updateError } = await supabase
        .from("matches")
        .update({
          match_details: updatedMatchDetails as Json
        })
        .eq("match_id", id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Performance Data Saved",
        description: "Player statistics have been saved successfully",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save player performances";
      console.error("Error saving player performances:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  // Get team rank by id
  const getTeamRankById = (teamId: string): number => {
    const sortedTeams = [...teams].sort((a, b) => {
      return (b.total_points || 0) - (a.total_points || 0);
    });
    
    const index = sortedTeams.findIndex(team => team.id === teamId);
    return index !== -1 ? index + 1 : 0;
  };
  
  // Handler for editing player performance
  const handleEditPerformance = (playerId: string) => {
    setSelectedPlayerForEdit(playerId);
    setEditingPerformance(playerPerformances[playerId] || {});
    setShowScoreDialog(true);
  };
  
  // Save edited performance
  const saveEditedPerformance = () => {
    if (!selectedPlayerForEdit) return;
    
    updatePlayerPerformance(selectedPlayerForEdit, editingPerformance);
    setShowScoreDialog(false);
    setSelectedPlayerForEdit(null);
    setEditingPerformance({});
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-cricket-lime" />
        </div>
      </PageContainer>
    );
  }

  if (error || !match) {
    return (
      <PageContainer>
        <div className="mt-8 px-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/manage-matches")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Matches
          </Button>
          <div className="bg-cricket-dark-green/40 rounded-md p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Match Not Found</h2>
            <p className="text-muted-foreground">
              The match you're looking for doesn't exist or you don't have permission to view it.
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mt-8 space-y-6 px-4 pb-10">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/manage-matches")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Matches
          </Button>
          
          <div className="flex items-center gap-2">
           <WalletMultiButton className="bg-neon-green hover:bg-neon-green/90 text-black font-medium shadow-md transition-all duration-200 hover:shadow-lg" />
            
            <Button
              onClick={calculatePoints}
              title={isMatchCompleted === false ? "Cannot calculate points while match is in progress" : ""}
              className="bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90 disabled:opacity-50"
            >
              {calculatingPoints ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Points
                </>
              )}
            </Button>
            
            { (
              <Button
                onClick={distributePrizes}
                disabled={distributingPrizes || teams.some(team => team.total_points === null)}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                {distributingPrizes ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Trophy className="mr-2 h-4 w-4" />
                    Distribute Prizes
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {isMatchCompleted === false && (
          <div className="bg-orange-500/20 text-orange-400 p-4 rounded-md flex items-center mb-4">
            <Clock className="h-5 w-5 mr-2" />
            <div>
              <p className="font-semibold">Match Not Completed</p>
              <p className="text-sm">Fantasy points calculation may not be accurate as the match is still in progress.</p>
            </div>
          </div>
        )}

        {/* Match Header */}
        <Card className="bg-cricket-medium-green">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle className="text-2xl">
                  {match.teams.home.name} vs {match.teams.away.name}
                </CardTitle>
                <CardDescription>
                  {match.venue} • {match.startTime && format(new Date(match.startTime), 'dd MMM yyyy, HH:mm')}
                </CardDescription>
              </div>
              
              <div className="flex flex-col items-end">
                <div className={`px-3 py-1 rounded text-sm font-medium
                  ${match.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' : 
                    match.status === 'live' ? 'bg-green-500/20 text-green-400' : 
                    'bg-purple-500/20 text-purple-400'}`}
                >
                  {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                </div>
                
                {match.is_finalized && (
                  <div className="mt-2 text-sm text-amber-400 flex items-center">
                    <Trophy className="mr-1 h-3 w-3" />
                    Finalized
                  </div>
                )}
                
                {isMatchCompleted !== null && (
                  <div className={`mt-2 text-sm flex items-center ${isMatchCompleted ? 'text-green-400' : 'text-orange-400'}`}>
                    {isMatchCompleted ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        Match Completed
                      </>
                    ) : (
                      <>
                        <Clock className="mr-1 h-3 w-3" />
                        Match In Progress
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="flex items-center">
                <div className="flex flex-col items-center">
                  <img 
                    src={match.teams.home.logo} 
                    alt={match.teams.home.name}
                    className="w-16 h-16 object-contain"
                  />
                  <span className="mt-2 font-semibold">{match.teams.home.code}</span>
                </div>
                
                <div className="mx-4 text-center">
                  <div className="text-xl font-semibold">vs</div>
                  {match.scores.home && match.scores.away && (
                    <div className="mt-2 text-sm">
                      {match.scores.home} - {match.scores.away}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-center">
                  <img 
                    src={match.teams.away.logo} 
                    alt={match.teams.away.name}
                    className="w-16 h-16 object-contain"
                  />
                  <span className="mt-2 font-semibold">{match.teams.away.code}</span>
                </div>
              </div>
              
              {match.result && (
                <div className="ml-4 text-center md:text-left text-sm text-muted-foreground">
                  <strong>Result:</strong> {match.result}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="teams" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="teams">Teams ({teams.length})</TabsTrigger>
            <TabsTrigger value="players">Player Performance</TabsTrigger>
            <TabsTrigger value="prizes">Prize Distribution</TabsTrigger>
          </TabsList>

          {/* Teams Tab */}
          <TabsContent value="teams" className="mt-0">
            {loadingTeams ? (
              <div className="flex justify-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-cricket-lime" />
              </div>
            ) : teams.length === 0 ? (
              <div className="text-center p-10 bg-cricket-dark-green/40 rounded-md">
                <p>No teams have been created for this match yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-full md:w-1/3 mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search teams or users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <UITable>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Rank</TableHead>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Wallet address</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams
                      .sort((a, b) => (b.total_points || 0) - (a.total_points || 0))
                      .filter(team => {
                        if (!searchQuery) return true;
                        const query = searchQuery.toLowerCase();
                        return (
                          team.team_name.toLowerCase().includes(query) ||
                          team.user_id.toLowerCase().includes(query)
                        );
                      })
                      .map((team, index) => (
                        <TableRow key={team.id}>
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell>{team.team_name}</TableCell>
                          <TableCell>
                            {team.wallet_address }
                          </TableCell>
                          <TableCell className="text-right">
                            {team.total_points !== null ? (
                              team.total_points
                            ) : (
                              <span className="text-muted-foreground">Not calculated</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </UITable>
              </div>
            )}
          </TabsContent>

          {/* Player Performance Tab */}
          <TabsContent value="players" className="mt-0">
            <Card className="bg-cricket-medium-green">
              <CardHeader>
                <CardTitle>Player Performance</CardTitle>
                <CardDescription>
                  Add or update player statistics to calculate fantasy points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {Object.keys(playerPerformances).length} players with performance data
                    </div>
                  </div>
                  
                  <UITable>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player ID</TableHead>
                        <TableHead>Batting</TableHead>
                        <TableHead>Bowling</TableHead>
                        <TableHead>Fielding</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!calculatingPoints&& Object.entries(playerPerformances).map(([playerId, performance]) => (
                        <TableRow key={playerId}>
                          <TableCell className="font-medium">
                            {(() => {
                              // Try to find player name from original players in all teams
                              for (const team of teams) {
                                if (team.originalPlayers && Array.isArray(team.originalPlayers)) {
                                  for (const player of team.originalPlayers) {
                                    if (typeof player === 'object' && player !== null) {
                                      // Use explicit type interface for player object
                                      interface PlayerObject {
                                        id?: string;
                                        name?: string;
                                      }
                                      const typedPlayer = player as PlayerObject;
                                      if (typedPlayer.id === playerId) {
                                        return typedPlayer.name || playerId;
                                      }
                                    }
                                  }
                                }
                              }
                              return playerId;
                            })()}
                          </TableCell>
                          <TableCell>
                            {performance.runs !== undefined && (
                              <div className="text-sm">
                                {performance.runs} runs
                                {performance.balls !== undefined && ` (${performance.balls} balls)`}
                                {performance.fours !== undefined && `, ${performance.fours} fours`}
                                {performance.sixes !== undefined && `, ${performance.sixes} sixes`}
                                {performance.strike_rate !== undefined && `, SR: ${performance.strike_rate}`}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {performance.wickets !== undefined && (
                              <div className="text-sm">
                                {performance.wickets} wickets
                                {performance.overs !== undefined && ` (${performance.overs} overs)`}
                                {performance.maidens !== undefined && `, ${performance.maidens} maidens`}
                                {performance.economy !== undefined && `, Eco: ${performance.economy}`}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {performance.catches !== undefined && `${performance.catches} catches`}
                              {performance.stumpings !== undefined && 
                                (performance.catches !== undefined ? `, ${performance.stumpings} stumpings` : `${performance.stumpings} stumpings`)}
                              {performance.run_outs !== undefined && 
                                ((performance.catches !== undefined || performance.stumpings !== undefined) ? 
                                  `, ${performance.run_outs} run outs` : `${performance.run_outs} run outs`)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPerformance(playerId)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {Object.keys(playerPerformances).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No player performance data yet. Click "Edit" to add player statistics.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </UITable>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prize Distribution Tab */}
          <TabsContent value="prizes" className="mt-0">
            <Card className="bg-cricket-medium-green">
              <CardHeader>
                <CardTitle>Prize Distribution</CardTitle>
                <CardDescription>
                  Manage and view prize distribution for winners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-cricket-dark-green/40 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Match Prize Pool</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Prize Pool</p>
                        <p className="font-semibold text-xl">{totalPoolDeposits}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Contestants</p>
                        <p className="font-semibold text-xl">{teams.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Prize Distribution Structure</h3>
                    <div className="space-y-2">
                      {teams.length === 1 ? (
                        <div className="flex justify-between bg-cricket-dark-green/20 p-3 rounded-md">
                          <div className="flex items-center">
                            <div className="bg-amber-500/20 text-amber-500 p-1 rounded-full mr-2">
                              <Trophy className="h-4 w-4" />
                            </div>
                            <span>Single Participant</span>
                          </div>
                          <div>100% of prize pool</div>
                        </div>
                      ) : teams.length === 2 ? (
                        <>
                          <div className="flex justify-between bg-cricket-dark-green/20 p-3 rounded-md">
                            <div className="flex items-center">
                              <div className="bg-amber-500/20 text-amber-500 p-1 rounded-full mr-2">
                                <Trophy className="h-4 w-4" />
                              </div>
                              <span>1st Place</span>
                            </div>
                            <div>70% of prize pool</div>
                          </div>
                          <div className="flex justify-between bg-cricket-dark-green/20 p-3 rounded-md">
                            <div className="flex items-center">
                              <div className="bg-slate-400/20 text-slate-400 p-1 rounded-full mr-2">
                                <Trophy className="h-4 w-4" />
                              </div>
                              <span>2nd Place</span>
                            </div>
                            <div>30% of prize pool</div>
                          </div>
                          <div className="bg-amber-500/10 p-3 rounded-md text-sm">
                            <p className="flex items-center">
                              <Info className="h-4 w-4 mr-2 text-amber-500" />
                              In case of a tie, prizes will be split equally (50% each)
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between bg-cricket-dark-green/20 p-3 rounded-md">
                            <div className="flex items-center">
                              <div className="bg-amber-500/20 text-amber-500 p-1 rounded-full mr-2">
                                <Trophy className="h-4 w-4" />
                              </div>
                              <span>1st Place</span>
                            </div>
                            <div>50% of prize pool</div>
                          </div>
                          <div className="flex justify-between bg-cricket-dark-green/20 p-3 rounded-md">
                            <div className="flex items-center">
                              <div className="bg-slate-400/20 text-slate-400 p-1 rounded-full mr-2">
                                <Trophy className="h-4 w-4" />
                              </div>
                              <span>2nd Place</span>
                            </div>
                            <div>25% of prize pool</div>
                          </div>
                          <div className="flex justify-between bg-cricket-dark-green/20 p-3 rounded-md">
                            <div className="flex items-center">
                              <div className="bg-amber-700/20 text-amber-700 p-1 rounded-full mr-2">
                                <Trophy className="h-4 w-4" />
                              </div>
                              <span>3rd Place</span>
                            </div>
                            <div>15% of prize pool</div>
                          </div>
                          <div className="flex justify-between bg-cricket-dark-green/20 p-3 rounded-md">
                            <div className="flex items-center">
                              <div className="bg-slate-600/20 text-slate-500 p-1 rounded-full mr-2">
                                <Award className="h-4 w-4" />
                              </div>
                              <span>4th-{Math.min(10, teams.length)}th Place</span>
                            </div>
                            <div>10% of prize pool (shared)</div>
                          </div>
                          <div className="bg-amber-500/10 p-3 rounded-md text-sm">
                            <p className="flex items-center">
                              <Info className="h-4 w-4 mr-2 text-amber-500" />
                              In case of ties, prizes for those positions will be shared equally
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Top Winners List */}
                  {!calculatingPoints&& teams.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Current Winners</h3>
                      <UITable>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80px]">Rank</TableHead>
                            <TableHead>Team Name</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead className="text-right">Points</TableHead>
                            <TableHead className="text-right">Prize</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {teams
                            .sort((a, b) => (b.total_points || 0) - (a.total_points || 0))
                            .slice(0, 10)
                            .map((team, index) => (
                              <TableRow key={team.id}>
                                <TableCell className="font-medium">
                                  {index + 1}
                                </TableCell>
                                <TableCell>{team.team_name}</TableCell>
                                <TableCell>
                                  {team.user_id}
                                </TableCell>
                                <TableCell className="text-right">
                                  {team.total_points !== null ? (
                                    team.total_points
                                  ) : (
                                    <span className="text-muted-foreground">Not calculated</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {index === 0 ? "50%" : 
                                    index === 1 ? "30%" : 
                                    index === 2 ? "15%" : 
                                    index < 10 ? "Shared 5%" : "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </UITable>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Player Performance Dialog */}
      <Dialog open={showScoreDialog} onOpenChange={setShowScoreDialog}>
        <DialogContent className="bg-cricket-dark-green border-cricket-medium-green max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Player Performance</DialogTitle>
            <DialogDescription>
              Update statistics for player: {selectedPlayerForEdit}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Batting Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Batting</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Runs</label>
                    <Input 
                      type="number"
                      value={editingPerformance.runs || ''}
                      onChange={(e) => setEditingPerformance({
                        ...editingPerformance,
                        runs: e.target.value ? Number(e.target.value) : undefined
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Balls</label>
                    <Input 
                      type="number"
                      value={editingPerformance.balls || ''}
                      onChange={(e) => setEditingPerformance({
                        ...editingPerformance,
                        balls: e.target.value ? Number(e.target.value) : undefined
                      })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Fours</label>
                    <Input 
                      type="number"
                      value={editingPerformance.fours || ''}
                      onChange={(e) => setEditingPerformance({
                        ...editingPerformance,
                        fours: e.target.value ? Number(e.target.value) : undefined
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Sixes</label>
                    <Input 
                      type="number"
                      value={editingPerformance.sixes || ''}
                      onChange={(e) => setEditingPerformance({
                        ...editingPerformance,
                        sixes: e.target.value ? Number(e.target.value) : undefined
                      })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Strike Rate</label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={editingPerformance.strike_rate || ''}
                    onChange={(e) => setEditingPerformance({
                      ...editingPerformance,
                      strike_rate: e.target.value ? Number(e.target.value) : undefined
                    })}
                  />
                </div>
              </div>
            </div>
            
            {/* Bowling Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Bowling</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Wickets</label>
                    <Input 
                      type="number"
                      value={editingPerformance.wickets || ''}
                      onChange={(e) => setEditingPerformance({
                        ...editingPerformance,
                        wickets: e.target.value ? Number(e.target.value) : undefined
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Overs</label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={editingPerformance.overs || ''}
                      onChange={(e) => setEditingPerformance({
                        ...editingPerformance,
                        overs: e.target.value ? Number(e.target.value) : undefined
                      })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Maidens</label>
                    <Input 
                      type="number"
                      value={editingPerformance.maidens || ''}
                      onChange={(e) => setEditingPerformance({
                        ...editingPerformance,
                        maidens: e.target.value ? Number(e.target.value) : undefined
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Economy</label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={editingPerformance.economy || ''}
                      onChange={(e) => setEditingPerformance({
                        ...editingPerformance,
                        economy: e.target.value ? Number(e.target.value) : undefined
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fielding Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-3">Fielding</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Catches</label>
                  <Input 
                    type="number"
                    value={editingPerformance.catches || ''}
                    onChange={(e) => setEditingPerformance({
                      ...editingPerformance,
                      catches: e.target.value ? Number(e.target.value) : undefined
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Stumpings</label>
                  <Input 
                    type="number"
                    value={editingPerformance.stumpings || ''}
                    onChange={(e) => setEditingPerformance({
                      ...editingPerformance,
                      stumpings: e.target.value ? Number(e.target.value) : undefined
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Run Outs</label>
                  <Input 
                    type="number"
                    value={editingPerformance.run_outs || ''}
                    onChange={(e) => setEditingPerformance({
                      ...editingPerformance,
                      run_outs: e.target.value ? Number(e.target.value) : undefined
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScoreDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90"
              onClick={saveEditedPerformance}
            >
              Save Performance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prize Distribution Dialog */}
      <AlertDialog open={showDistributeDialog} onOpenChange={setShowDistributeDialog}>
        <AlertDialogContent className="bg-cricket-dark-green border-cricket-medium-green">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-amber-500" />
              Prize Distribution Completed
            </AlertDialogTitle>
            <AlertDialogDescription>
              Prizes have been distributed according to the following structure:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4 p-4 bg-cricket-dark-green border border-cricket-medium-green rounded-md">
            <pre className="text-sm whitespace-pre-wrap">{prizeDistributionMessage}</pre>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};

export default MatchDetailAdmin;
