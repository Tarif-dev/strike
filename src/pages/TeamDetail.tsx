import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  User,
  Loader2,
  Calendar,
  MapPin,
  Edit,
  Shield,
  Star,
  Share2,
  BarChart3,
  Users,
  Clock,
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { players } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  WalletNotConnectedError,
  WalletSendTransactionError,
} from "@solana/wallet-adapter-base";
import MagicBlockRealTimePerformance from "@/components/common/MagicBlockRealTimePerformance";
import MagicBlockPrizeDistribution from "@/components/common/MagicBlockPrizeDistribution";
import MagicBlockMatchStatistics from "@/components/common/MagicBlockMatchStatistics";
import ZkCompressionStatistics from "@/components/common/ZkCompressionStatistics";
import ZkCompressionPrizeDistribution from "@/components/common/ZkCompressionPrizeDistribution";
import { Program, BN } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { IDL } from "@/idl/strike_contracts_new";
import { fetchPrizePool, usePrizePool } from "@/utils/prize-pool";
import PrizePoolDisplay from "@/components/cricket/PrizePoolDisplay";
import PrizeDistributionDisplay from "@/components/cricket/PrizeDistributionDisplay";
import {
  calculatePrizeDistribution,
  calculateTeamPrize,
} from "@/utils/prize-distribution";
import {
  PrizeDistributionResult,
  PrizePoolDisplayProps,
} from "@/interfaces/prize-distribution";
import { TeamData } from "@/types/match";
// import { getAssociatedTokenAddressSync } from "@solana/spl-token";

// Define team type from Supabase
type DatabaseTeam = Database["public"]["Tables"]["teams"]["Row"];

interface TeamDetail extends DatabaseTeam {
  playerDetails?: any[]; // Explicitly define playerDetails as an array
}

// Define player positions for styled display
const positionColors = {
  Batsman: {
    bg: "bg-blue-500/20",
    text: "text-blue-500",
    border: "border-blue-500/30",
  },
  Bowler: {
    bg: "bg-purple-500/20",
    text: "text-purple-500",
    border: "border-purple-500/30",
  },
  "All-rounder": {
    bg: "bg-amber-500/20",
    text: "text-amber-500",
    border: "border-amber-500/30",
  },
  "Wicket-keeper": {
    bg: "bg-green-500/20",
    text: "text-green-500",
    border: "border-green-500/30",
  },
};

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("players");
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBlockchainProcessing, setIsBlockchainProcessing] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const [txComplete, setTxComplete] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [matchId, setmatchId] = useState("");
  const { connection } = useConnection();
  const wallet = useWallet();
  const {
    publicKey,
    connected,
    connecting,
    disconnect,
    select,
    sendTransaction,
  } = wallet;

  // State for prize distribution
  const [prizeDistribution, setPrizeDistribution] =
    useState<PrizeDistributionResult | null>(null);

  // Use our custom hook for prize pool
  const {
    prizePool,
    loading: prizePoolLoading,
    error: prizePoolError,
    refetch: refetchPrizePool,
  } = usePrizePool(matchId, connection, wallet);

  // Calculate prize distribution based on team rankings when prize pool data changes
  useEffect(() => {
    if (team && prizePool && Number(prizePool) > 0) {
      // In a real application, this would be fetched from the backend
      // For demonstration, we'll create mock data with the current team at the top
      const mockRankedTeams: TeamData[] = [
        {
          id: team.id,
          team_name: team.team_name,
          total_points: team.total_points || 0,
          user_id: team.user_id,
          match_id: team.match_id,
          players: Array.isArray(team.players) ? team.players : [],
          captain_id: team.captain_id,
          vice_captain_id: team.vice_captain_id,
          created_at: team.created_at,
          updated_at: team.updated_at,
          match_details: team.match_details,
        },
        // Add mock competitors to demonstrate distribution UI
        {
          id: "competitor-1",
          team_name: "Competitor Team 1",
          total_points: Math.max(0, (team.total_points || 0) - 20),
          user_id: "mock-user-1",
          match_id: team.match_id,
          players: [],
          captain_id: "",
          vice_captain_id: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          match_details: team.match_details,
        },
        {
          id: "competitor-2",
          team_name: "Competitor Team 2",
          total_points: Math.max(0, (team.total_points || 0) - 40),
          user_id: "mock-user-2",
          match_id: team.match_id,
          players: [],
          captain_id: "",
          vice_captain_id: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          match_details: team.match_details,
        },
      ];

      // Calculate distribution using our utility function
      const distribution = calculatePrizeDistribution(
        mockRankedTeams,
        prizePool
      );
      setPrizeDistribution(distribution);
    }
  }, [team, prizePool]);

  const { setVisible } = useWalletModal();
  useEffect(() => {
    if (connected) {
      console.log("connection", connection);
      setWalletError("");
    }
  }, [connected]);

  const ensureWalletConnection = async () => {
    if (!connected && !connecting) {
      setWalletError("Wallet connection lost. Attempting to reconnect...");

      // If wallet was previously selected, try to reconnect
      if (wallet.wallet) {
        try {
          // Attempt to disconnect and reconnect
          await disconnect();
          setTimeout(() => {
            select(wallet.wallet.adapter.name);
          }, 500);
          return false;
        } catch (error) {
          console.error("Error reconnecting wallet:", error);
          setWalletError(
            "Failed to reconnect wallet. Please connect manually."
          );
          return false;
        }
      } else {
        setWalletError("Wallet not connected. Please connect your wallet.");
        return false;
      }
    }
    return true;
  };
  const PROGRAM_ID = new PublicKey(
    "2Bnp9uikuv1EuAfHbcXizF8FcqNDKQg7hfuKbLC9y6hT"
  );
  const USDC_MINT = new PublicKey(
    "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
  );
  const TOKEN_PROGRAM = new PublicKey(
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
  );
  const ASSOCIATED_TOKEN_PROGRAM = new PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
  );
  const onSubmit = async (values) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create matches",
      });
      return;
    }

    // Check wallet connection status and attempt reconnection if needed
    if (!(await ensureWalletConnection())) {
      toast({
        variant: "destructive",
        title: "Wallet connection issue",
        description:
          walletError || "Please connect your Solana wallet to create a match",
      });
      return;
    }
    if (!connected || !publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your Solana wallet to create a match",
      });
      return;
    }
    setIsSubmitting(true);
    setIsBlockchainProcessing(false);
    setWalletError("");
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    const program = new Program(IDL, provider);
    const shortMatchId = matchId;

    console.log("short match id", shortMatchId);
    const matchIdBuffer = Buffer.from(shortMatchId);
    setTxStatus("Deriving program address...");
    const [matchPoolPDA, matchBump] = await PublicKey.findProgramAddress(
      [Buffer.from("match_pool"), matchIdBuffer],
      PROGRAM_ID
    );
    const [poolTokenPDA, tokenBump] = await PublicKey.findProgramAddress(
      [Buffer.from("pool_token"), matchIdBuffer],
      PROGRAM_ID
    );
    setTxStatus("Building transaction...");
    const userTokenAccount = PublicKey.findProgramAddressSync(
      [
        wallet.publicKey.toBuffer(),
        TOKEN_PROGRAM.toBuffer(),
        USDC_MINT.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM
    )[0];
    console.log("userTokenAccount", userTokenAccount.toString());
    const amountLamports = new BN(parseFloat("10") * 1_000_000);
    const tx = await program.methods
      .deposit(amountLamports)
      .accounts({
        matchPool: matchPoolPDA,
        poolTokenAccount: poolTokenPDA,
        userTokenAccount: userTokenAccount,
        user: publicKey,
        tokenProgram: TOKEN_PROGRAM,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .transaction();
    const transaction = new Transaction();
    transaction.add(tx);
    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;
    // Add right before sendTransaction
    try {
      console.log("Simulating transaction before sending...");
      const { value: simulationResult } =
        await connection.simulateTransaction(transaction);

      console.log("Simulation result:", simulationResult);

      if (simulationResult.err) {
        console.error("Simulation error:", simulationResult.err);
        // Parse and display a more user-friendly error
        if (simulationResult.logs) {
          console.error("Simulation logs:", simulationResult.logs);
          const programErrorLog = simulationResult.logs
            .filter(
              (log) =>
                log.includes("Program log:") || log.includes("Program failed")
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

    // Send the transaction
    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, "confirmed");

    // After successful payment, update the team in the database with the wallet address
    if (publicKey) {
      try {
        const { error: updateError } = await supabase
          .from("teams")
          .update({ wallet_address: publicKey.toString() })
          .eq("id", id);

        if (updateError) {
          console.error("Error updating wallet address:", updateError);
          // We don't throw here as the payment was successful
          toast({
            title: "Deposit successful",
            description: `You have successfully deposited ${10} USDC, but there was an issue saving your wallet information.`,
          });
        } else {
          toast({
            title: "Deposit successful",
            description: `You have successfully deposited ${10} USDC`,
          });
        }
      } catch (walletUpdateError) {
        console.error("Exception updating wallet address:", walletUpdateError);
        toast({
          title: "Deposit successful",
          description: `You have successfully deposited ${10} USDC, but there was an issue saving your wallet information.`,
        });
      }
    } else {
      toast({
        title: "Deposit successful",
        description: `You have successfully deposited ${10} USDC`,
      });
    }
  };

  // Add state for Play button and dialog
  const [showPlayDialog, setShowPlayDialog] = useState(false);
  const [totalPoolDeposits, setTotalPoolDeposits] = useState<string>("0");
  const [loadingPoolData, setLoadingPoolData] = useState(false);

  // Fetch team data from Supabase
  useEffect(() => {
    if (id) {
      fetchTeamData();
    }
  }, [id]);
  useEffect(() => {
    console.log("waiting");
    if (matchId && connected) {
      fetchTotalPoolDeposits();
    }
  }, [matchId, connected]);

  const fetchTotalPoolDeposits = async () => {
    if (!matchId || !connection) {
      console.log("Match ID or connection not available");
      return;
    }

    try {
      setLoadingPoolData(true);

      // Use the utility function to fetch the prize pool
      const poolAmount = await fetchPrizePool(matchId, connection, wallet);
      setTotalPoolDeposits(poolAmount);
    } catch (error) {
      console.error("Error fetching pool deposits:", error);
      toast({
        title: "Error fetching pool data",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoadingPoolData(false);
    }
  };

  const fetchTeamData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching team:", error);
        setError("Failed to load team data.");
        toast({
          title: "Error",
          description: "Failed to load team data",
          variant: "destructive",
        });
      } else if (data) {
        // Process players data
        const playersList = data.players as any[];
        setmatchId(data.match_id);

        // Add mock player data to enhance the UI
        const teamPlayers = playersList.map((playerData) => {
          // Try to find the player in mock data
          const mockPlayer = players.find((p) => p.id === playerData.id) || {
            id: playerData.id,
            name: playerData.name || "Unknown Player",
            position: playerData.position || "Unknown",
            image: playerData.image || undefined,
            points: playerData.points || 0,
            team: playerData.team || "Unknown Team",
            stats: {
              matches: Math.floor(Math.random() * 50) + 10,
              runs: Math.floor(Math.random() * 1000) + 100,
              wickets: Math.floor(Math.random() * 30),
              average: (Math.random() * 40 + 10).toFixed(2),
              strikeRate: (Math.random() * 100 + 50).toFixed(2),
              economy: (Math.random() * 8 + 4).toFixed(2),
            },
          };

          return mockPlayer;
        });

        setTeam({ ...data, playerDetails: teamPlayers });
      } else {
        setError("Team not found.");
      }
    } catch (err) {
      console.error("Unexpected error fetching team:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getPlayerPositionStyle = (position: string) => {
    return (
      positionColors[position as keyof typeof positionColors] || {
        bg: "bg-gray-500/20",
        text: "text-gray-500",
        border: "border-gray-500/30",
      }
    );
  };

  // Format match date
  const formatMatchDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return "Unknown date";
    }
  };
  const payAmount = async () => {
    onSubmit(10);
  };

  // Use the PrizePoolDisplay component to show prize pool information
  const renderPoolInfo = () => {
    if (!matchId) return null;

    // Return the reusable PrizePoolDisplay component
    return <PrizePoolDisplay matchId={matchId} />;
  };

  // Render the prize distribution section
  const renderPrizeDistribution = () => {
    if (!prizeDistribution || !team) return null;

    return (
      <div className="mt-4">
        <PrizeDistributionDisplay
          distributions={prizeDistribution.distributions}
          percentages={prizeDistribution.percentages}
          amounts={prizeDistribution.amounts}
          teamId={team.id}
        />
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <PageContainer>
        <div className="h-screen flex flex-col items-center justify-center">
          <div className="w-16 h-16 relative mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-neon-green/30 animate-ping"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-neon-green animate-spin" />
            </div>
          </div>
          <p className="text-xl font-semibold text-white">
            Loading team details...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Please wait while we fetch your team information
          </p>
        </div>
      </PageContainer>
    );
  }

  // Show error state
  if (error || !team) {
    return (
      <PageContainer>
        <div className="flex justify-between items-center py-4">
          <Link
            to="/profile"
            className="flex items-center gap-1 text-neon-green"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
            <Shield className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Team Not Found</h2>
          <p className="text-gray-400 mb-8 max-w-md text-center">
            {error ||
              "We couldn't find the team you're looking for. It may have been deleted or you might not have permission to view it."}
          </p>
          <Link to="/profile">
            <Button className="bg-neon-green hover:bg-neon-green/90 text-black">
              Back to Profile
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  // Parse match details
  const matchDetails = team.match_details as any;
  const homeTeam = matchDetails?.teams?.home;
  const awayTeam = matchDetails?.teams?.away;
  const matchDate = matchDetails?.date || team.created_at;

  // Find captain and vice-captain
  const captain = team.playerDetails?.find((p) => p.id === team.captain_id);
  const viceCaptain = team.playerDetails?.find(
    (p) => p.id === team.vice_captain_id
  );

  // Organize players by position
  const batsmen =
    team.playerDetails?.filter((p) => p.position === "Batsman") || [];
  const bowlers =
    team.playerDetails?.filter((p) => p.position === "Bowler") || [];
  const allRounders =
    team.playerDetails?.filter((p) => p.position === "All-rounder") || [];
  const wicketKeepers =
    team.playerDetails?.filter((p) => p.position === "Wicket-keeper") || [];

  return (
    <PageContainer className="pb-24">
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl overflow-hidden mb-6">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

        {/* Glowing accent */}
        <div className="absolute h-px top-0 left-5 right-5 bg-gradient-to-r from-transparent via-neon-green to-transparent"></div>

        <div className="relative p-6">
          {/* Back button and actions */}
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/profile"
              className="flex items-center gap-1 text-neon-green hover:text-neon-green/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>

            <div className="flex items-center gap-2">
              {team.user_id === user?.id && (
                <Link to={`/teams/${team.id}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-neon-green border-neon-green/30 hover:bg-neon-green/10"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Team
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Team name and match info with Play Contest Button aligned to the right */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neon-green">
                {team.team_name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                <Badge
                  variant="outline"
                  className="bg-neon-green/10 text-neon-green border-neon-green/30"
                >
                  {team.total_points || 0} pts
                </Badge>

                <div className="flex items-center text-gray-400">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{formatMatchDate(team.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Play Contest Button moved to the right */}
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-700/30"
              onClick={() => setShowPlayDialog(true)}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Play Contest
            </Button>
          </div>

          {/* Match details */}
          {matchDetails && (
            <div className="mt-6 bg-gray-900/60 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
              <p className="text-xs text-neon-green mb-2">MATCH DETAILS</p>

              <div className="flex items-center justify-between">
                <div className="flex-1 text-center">
                  <div className="h-16 w-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                    {homeTeam?.logo ? (
                      <img
                        src={homeTeam.logo}
                        alt={homeTeam.name}
                        className="h-10 w-10"
                      />
                    ) : (
                      <Shield className="h-8 w-8 text-blue-400" />
                    )}
                  </div>
                  <p className="font-medium mt-2">
                    {homeTeam?.name || "Home Team"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {homeTeam?.code || "HOME"}
                  </p>
                </div>

                <div className="flex-shrink-0 mx-4">
                  <div className="text-gray-400 text-sm mb-1 flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{matchDetails?.time || "7:30 PM"}</span>
                  </div>
                  <div className="bg-gray-800/80 py-1.5 px-3 rounded-full">
                    <span className="text-sm font-medium">VS</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 text-center">
                    {matchDetails?.tournament?.name || "Tournament"}
                  </div>
                </div>

                <div className="flex-1 text-center">
                  <div className="h-16 w-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                    {awayTeam?.logo ? (
                      <img
                        src={awayTeam.logo}
                        alt={awayTeam.name}
                        className="h-10 w-10"
                      />
                    ) : (
                      <Shield className="h-8 w-8 text-red-400" />
                    )}
                  </div>
                  <p className="font-medium mt-2">
                    {awayTeam?.name || "Away Team"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {awayTeam?.code || "AWAY"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1 text-sm text-gray-400">
                <MapPin className="h-3.5 w-3.5" />
                <span>{matchDetails?.venue || "Stadium"}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-900/60 border-gray-800">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-lg font-bold">
              {team.playerDetails?.length || 0}
            </p>
            <p className="text-xs text-gray-400">Players</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-800">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-lg font-bold">{team.total_points || 0}</p>
            <p className="text-xs text-gray-400">Total Points</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-800">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-neon-green/20 flex items-center justify-center mb-2">
              <Star className="h-5 w-5 text-neon-green" />
            </div>
            <p className="text-lg font-bold">
              {captain?.name?.split(" ")[0] || "None"}
            </p>
            <p className="text-xs text-gray-400">Captain</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-800">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-2">
              <Trophy className="h-5 w-5 text-amber-400" />
            </div>
            <p className="text-lg font-bold">
              {viceCaptain?.name?.split(" ")[0] || "None"}
            </p>
            <p className="text-xs text-gray-400">Vice Captain</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for team content */}
      <Tabs
        defaultValue="players"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="prizes">Prizes</TabsTrigger>
        </TabsList>

        {/* Players Tab - Display team members */}
        {activeTab === "players" && (
          <div className="space-y-6">
            {/* Captain & Vice-Captain Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {captain && (
                <Card className="border border-neon-green/20 bg-gradient-to-br from-gray-900 to-gray-950">
                  <CardHeader className="pb-2">
                    <Badge className="bg-neon-green/20 text-neon-green w-fit mb-1">
                      Captain
                    </Badge>
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-3 ring-2 ring-neon-green">
                        {captain.image ? (
                          <AvatarImage src={captain.image} />
                        ) : (
                          <AvatarFallback className="bg-neon-green/20 text-neon-green">
                            {captain.name?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <CardTitle>{captain.name}</CardTitle>
                        <CardDescription>{captain.team}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <p className="text-xs text-gray-400">Points</p>
                        <p className="font-medium text-neon-green">
                          {captain.points || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Position</p>
                        <p className="font-medium">{captain.position}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {viceCaptain && (
                <Card className="border border-amber-500/20 bg-gradient-to-br from-gray-900 to-gray-950">
                  <CardHeader className="pb-2">
                    <Badge className="bg-amber-500/20 text-amber-400 w-fit mb-1">
                      Vice Captain
                    </Badge>
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-3 ring-2 ring-amber-400/70">
                        {viceCaptain.image ? (
                          <AvatarImage src={viceCaptain.image} />
                        ) : (
                          <AvatarFallback className="bg-amber-500/20 text-amber-400">
                            {viceCaptain.name?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <CardTitle>{viceCaptain.name}</CardTitle>
                        <CardDescription>{viceCaptain.team}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <p className="text-xs text-gray-400">Points</p>
                        <p className="font-medium text-amber-400">
                          {viceCaptain.points || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Position</p>
                        <p className="font-medium">{viceCaptain.position}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Players by Position */}
            {batsmen.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
                  Batsmen ({batsmen.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {batsmen.map((player) => {
                    const style = getPlayerPositionStyle(player.position);
                    return (
                      <div
                        key={player.id}
                        className="bg-gray-900/60 border border-gray-800 hover:border-blue-500/30 rounded-lg p-3 transition-all"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            {player.image ? (
                              <AvatarImage src={player.image} />
                            ) : (
                              <AvatarFallback
                                className={`${style.bg} ${style.text}`}
                              >
                                {player.name?.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {player.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {player.team}
                            </p>
                          </div>
                          <Badge
                            className={`${style.bg} ${style.text} border ${style.border}`}
                          >
                            {player.points || 0} pts
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {bowlers.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <div className="h-2 w-2 bg-purple-500 rounded-full mr-2"></div>
                  Bowlers ({bowlers.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bowlers.map((player) => {
                    const style = getPlayerPositionStyle(player.position);
                    return (
                      <div
                        key={player.id}
                        className="bg-gray-900/60 border border-gray-800 hover:border-purple-500/30 rounded-lg p-3 transition-all"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            {player.image ? (
                              <AvatarImage src={player.image} />
                            ) : (
                              <AvatarFallback
                                className={`${style.bg} ${style.text}`}
                              >
                                {player.name?.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {player.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {player.team}
                            </p>
                          </div>
                          <Badge
                            className={`${style.bg} ${style.text} border ${style.border}`}
                          >
                            {player.points || 0} pts
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {allRounders.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
                  All-Rounders ({allRounders.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {allRounders.map((player) => {
                    const style = getPlayerPositionStyle(player.position);
                    return (
                      <div
                        key={player.id}
                        className="bg-gray-900/60 border border-gray-800 hover:border-amber-500/30 rounded-lg p-3 transition-all"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            {player.image ? (
                              <AvatarImage src={player.image} />
                            ) : (
                              <AvatarFallback
                                className={`${style.bg} ${style.text}`}
                              >
                                {player.name?.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {player.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {player.team}
                            </p>
                          </div>
                          <Badge
                            className={`${style.bg} ${style.text} border ${style.border}`}
                          >
                            {player.points || 0} pts
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {wicketKeepers.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                  Wicket-Keepers ({wicketKeepers.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {wicketKeepers.map((player) => {
                    const style = getPlayerPositionStyle(player.position);
                    return (
                      <div
                        key={player.id}
                        className="bg-gray-900/60 border border-gray-800 hover:border-green-500/30 rounded-lg p-3 transition-all"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            {player.image ? (
                              <AvatarImage src={player.image} />
                            ) : (
                              <AvatarFallback
                                className={`${style.bg} ${style.text}`}
                              >
                                {player.name?.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {player.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {player.team}
                            </p>
                          </div>
                          <Badge
                            className={`${style.bg} ${style.text} border ${style.border}`}
                          >
                            {player.points || 0} pts
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {team.playerDetails?.length === 0 && (
              <div className="py-12 text-center">
                <div className="h-16 w-16 bg-gray-800/80 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Players Found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  This team doesn't have any players yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Stats Tab - Show statistics about the team */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <MagicBlockMatchStatistics />

            <ZkCompressionStatistics />

            <Card className="bg-gray-900/60 border-gray-800">
              <CardHeader>
                <CardTitle>Team Composition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Batsmen</span>
                      <span>{batsmen.length} players</span>
                    </div>
                    <Progress
                      value={
                        (batsmen.length /
                          (team.playerDetails &&
                          Array.isArray(team.playerDetails) &&
                          team.playerDetails.length > 0
                            ? team.playerDetails.length
                            : 1)) *
                        100
                      }
                      className="h-2 bg-gray-800"
                    >
                      <div className="h-full bg-blue-500 rounded-full" />
                    </Progress>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Bowlers</span>
                      <span>{bowlers.length} players</span>
                    </div>
                    <Progress
                      value={
                        (bowlers.length /
                          (team.playerDetails &&
                          Array.isArray(team.playerDetails) &&
                          team.playerDetails.length > 0
                            ? team.playerDetails.length
                            : 1)) *
                        100
                      }
                      className="h-2 bg-gray-800"
                    >
                      <div className="h-full bg-purple-500 rounded-full" />
                    </Progress>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">All-Rounders</span>
                      <span>{allRounders.length} players</span>
                    </div>
                    <Progress
                      value={
                        (allRounders.length /
                          (team.playerDetails &&
                          Array.isArray(team.playerDetails) &&
                          team.playerDetails.length > 0
                            ? team.playerDetails.length
                            : 1)) *
                        100
                      }
                      className="h-2 bg-gray-800"
                    >
                      <div className="h-full bg-amber-500 rounded-full" />
                    </Progress>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Wicket-Keepers</span>
                      <span>{wicketKeepers.length} players</span>
                    </div>
                    <Progress
                      value={
                        (wicketKeepers.length /
                          (team.playerDetails &&
                          Array.isArray(team.playerDetails) &&
                          team.playerDetails.length > 0
                            ? team.playerDetails.length
                            : 1)) *
                        100
                      }
                      className="h-2 bg-gray-800"
                    >
                      <div className="h-full bg-green-500 rounded-full" />
                    </Progress>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 border-gray-800">
              <CardHeader>
                <CardTitle>Team Points Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {team.playerDetails && team.playerDetails.length > 0 ? (
                    team.playerDetails
                      .sort((a, b) => (b.points || 0) - (a.points || 0))
                      .slice(0, 5)
                      .map((player, index) => (
                        <div key={player.id} className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            {player.image ? (
                              <AvatarImage src={player.image} />
                            ) : (
                              <AvatarFallback className="bg-gray-800">
                                {player.name?.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {player.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-medium text-neon-green">
                              {player.points || 0} pts
                            </span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-400 text-center py-8">
                      No statistics available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 border-gray-800">
              <CardHeader>
                <CardTitle>Team Distribution by Cricket Teams</CardTitle>
              </CardHeader>
              <CardContent>
                {team.playerDetails && team.playerDetails.length > 0 ? (
                  <div className="space-y-4">
                    {/* Group players by team and show distribution */}
                    {Object.entries(
                      team.playerDetails.reduce(
                        (acc, player) => {
                          const team = player.team || "Unknown Team";
                          if (!acc[team]) acc[team] = [];
                          acc[team].push(player);
                          return acc;
                        },
                        {} as Record<string, any[]>
                      )
                    ).map(([teamName, players]) => (
                      <div key={teamName}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="truncate">{teamName}</span>
                          <span>{(players as any[]).length} players</span>
                        </div>
                        <Progress
                          value={
                            ((players as any[]).length /
                              (team.playerDetails?.length || 1)) *
                            100
                          }
                          className="h-2 bg-gray-800"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    No data available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            <MagicBlockRealTimePerformance
              playerName={captain?.name || "Captain"}
              teamName={matchDetails?.team1?.name || "Team"}
              matchType={matchDetails?.match_type || "T20"}
            />

            <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-amber-400" />
                  Overall Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-neon-green/20 to-blue-500/20 mx-auto flex items-center justify-center border border-neon-green/30">
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-blue-500">
                    {team.total_points || 0}
                  </div>
                </div>
                <p className="mt-4 text-xl font-semibold">Total Points</p>
                <p className="text-sm text-gray-400 mt-1">
                  Based on player performances in{" "}
                  {matchDetails?.tournament?.name || "this tournament"}
                </p>

                <div className="mt-8 max-w-md mx-auto">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    Performance by Category
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Batting</span>
                        <span>{Math.floor(Math.random() * 50) + 50}%</span>
                      </div>
                      <Progress
                        value={Math.floor(Math.random() * 50) + 50}
                        className="h-1.5 bg-gray-800"
                      >
                        <div className="h-full bg-blue-500 rounded-full" />
                      </Progress>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Bowling</span>
                        <span>{Math.floor(Math.random() * 50) + 40}%</span>
                      </div>
                      <Progress
                        value={Math.floor(Math.random() * 50) + 40}
                        className="h-1.5 bg-gray-800"
                      >
                        <div className="h-full bg-purple-500 rounded-full" />
                      </Progress>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Fielding</span>
                        <span>{Math.floor(Math.random() * 30) + 60}%</span>
                      </div>
                      <Progress
                        value={Math.floor(Math.random() * 30) + 60}
                        className="h-1.5 bg-gray-800"
                      >
                        <div className="h-full bg-amber-500 rounded-full" />
                      </Progress>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader>
                  <CardTitle>Captain Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {captain ? (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-3">
                          {captain.image ? (
                            <AvatarImage src={captain.image} />
                          ) : (
                            <AvatarFallback className="bg-neon-green/20 text-neon-green">
                              {captain.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{captain.name}</p>
                          <Badge className="bg-neon-green/20 text-neon-green mt-1">
                            2x Points: {(captain.points || 0) * 2}
                          </Badge>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-3">
                        {captain.position === "Batsman" && (
                          <>
                            <div>
                              <p className="text-xs text-gray-400">Runs</p>
                              <p className="font-medium">
                                {captain.stats?.runs || "0"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">
                                Strike Rate
                              </p>
                              <p className="font-medium">
                                {captain.stats?.strikeRate || "0"}
                              </p>
                            </div>
                          </>
                        )}

                        {captain.position === "Bowler" && (
                          <>
                            <div>
                              <p className="text-xs text-gray-400">Wickets</p>
                              <p className="font-medium">
                                {captain.stats?.wickets || "0"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Economy</p>
                              <p className="font-medium">
                                {captain.stats?.economy || "0"}
                              </p>
                            </div>
                          </>
                        )}

                        {(captain.position === "All-rounder" ||
                          captain.position === "Wicket-keeper") && (
                          <>
                            <div>
                              <p className="text-xs text-gray-400">Runs</p>
                              <p className="font-medium">
                                {captain.stats?.runs || "0"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Wickets</p>
                              <p className="font-medium">
                                {captain.stats?.wickets || "0"}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">
                      No captain selected
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader>
                  <CardTitle>Vice-Captain Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {viceCaptain ? (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-3">
                          {viceCaptain.image ? (
                            <AvatarImage src={viceCaptain.image} />
                          ) : (
                            <AvatarFallback className="bg-amber-500/20 text-amber-400">
                              {viceCaptain.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{viceCaptain.name}</p>
                          <Badge className="bg-amber-500/20 text-amber-400 mt-1">
                            1.5x Points:{" "}
                            {((viceCaptain.points || 0) * 1.5).toFixed(1)}
                          </Badge>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-3">
                        {viceCaptain.position === "Batsman" && (
                          <>
                            <div>
                              <p className="text-xs text-gray-400">Runs</p>
                              <p className="font-medium">
                                {viceCaptain.stats?.runs || "0"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">
                                Strike Rate
                              </p>
                              <p className="font-medium">
                                {viceCaptain.stats?.strikeRate || "0"}
                              </p>
                            </div>
                          </>
                        )}

                        {viceCaptain.position === "Bowler" && (
                          <>
                            <div>
                              <p className="text-xs text-gray-400">Wickets</p>
                              <p className="font-medium">
                                {viceCaptain.stats?.wickets || "0"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Economy</p>
                              <p className="font-medium">
                                {viceCaptain.stats?.economy || "0"}
                              </p>
                            </div>
                          </>
                        )}

                        {(viceCaptain.position === "All-rounder" ||
                          viceCaptain.position === "Wicket-keeper") && (
                          <>
                            <div>
                              <p className="text-xs text-gray-400">Runs</p>
                              <p className="font-medium">
                                {viceCaptain.stats?.runs || "0"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Wickets</p>
                              <p className="font-medium">
                                {viceCaptain.stats?.wickets || "0"}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">
                      No vice-captain selected
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900/60 border-gray-800">
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                {team.playerDetails && team.playerDetails.length > 0 ? (
                  <div className="space-y-4">
                    {team.playerDetails
                      .sort((a, b) => (b.points || 0) - (a.points || 0))
                      .slice(0, 3)
                      .map((player, index) => (
                        <div
                          key={player.id}
                          className="flex items-center justify-between p-3 bg-gray-800/60 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Badge className="bg-gray-700/80 h-6 w-6 flex items-center justify-center rounded-full p-0">
                              {index + 1}
                            </Badge>
                            <Avatar className="h-9 w-9">
                              {player.image ? (
                                <AvatarImage src={player.image} />
                              ) : (
                                <AvatarFallback>
                                  {player.name?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium">{player.name}</p>
                              <p className="text-xs text-gray-400">
                                {player.position}
                              </p>
                            </div>
                          </div>
                          <div>
                            <Badge className="bg-neon-green text-black">
                              {player.points || 0} pts
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    No performers data available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Prizes Tab - Show contest prizes */}
        {activeTab === "prizes" && (
          <div className="space-y-6">
            <MagicBlockPrizeDistribution
              prizePool={prizePool ? `${prizePool} USDC` : "500,000 USDC"}
              totalParticipants={150000}
              estimatedTime="< 1 second"
            />

            <ZkCompressionPrizeDistribution
              prizePool={prizePool ? `${prizePool} USDC` : "500,000 USDC"}
              totalParticipants={150000}
              estimatedTime="< 2 seconds"
            />

            <Card className="bg-gray-900/60 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 text-neon-green mr-2" />
                  Contest Prizes
                </CardTitle>
                <CardDescription>
                  View potential prize distribution based on current standings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <h3 className="text-sm font-medium mb-2">Prize Pool</h3>
                    <PrizePoolDisplay matchId={matchId} />

                    <div className="mt-4 text-xs text-gray-400">
                      <p>
                        Join the contest by depositing USDC into the prize pool.
                        Prize distribution is based on final team rankings after
                        the match.
                      </p>
                    </div>
                  </div>

                  {prizeDistribution && (
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                      <h3 className="text-sm font-medium mb-2">
                        Projected Prize Distribution
                      </h3>
                      <PrizeDistributionDisplay
                        distributions={prizeDistribution.distributions}
                        percentages={prizeDistribution.percentages}
                        amounts={prizeDistribution.amounts}
                        teamId={team?.id}
                      />

                      <div className="mt-4 text-xs text-gray-400">
                        <p>
                          * Final distribution may vary based on actual
                          participant count and performance
                        </p>
                      </div>
                    </div>
                  )}

                  {connected ? (
                    <div className="flex justify-center">
                      <Button
                        onClick={() => setShowPlayDialog(true)}
                        className="bg-neon-green hover:bg-neon-green/90 text-black font-medium"
                      >
                        Play for Prize Pool
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="mb-2 text-center text-sm text-gray-400">
                        Connect your wallet to play for prizes
                      </div>
                      <WalletMultiButton className="max-w-xs" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>

      {/* Play Contest Dialog */}
      <Dialog open={showPlayDialog} onOpenChange={setShowPlayDialog}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl">Play Contest</DialogTitle>
            <DialogDescription>
              Pool 10.00 USDC to participate in this contest and win rewards.
            </DialogDescription>
          </DialogHeader>

          {/* Prize Pool Display */}
          {renderPoolInfo()}

          {/* Prize Distribution Display */}
          {renderPrizeDistribution()}

          <div className="my-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <div className="flex justify-between mb-3">
              <span className="text-gray-400">Entry Fee:</span>
              <span className="font-bold flex items-center">
                <img src="/solana.png" alt="USDC" className="w-4 h-4 mr-1" />
                10.00 USDC
              </span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-400">Pool Size:</span>
              <span>1,000+ participants</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Prize Pool:</span>
              <span className="text-neon-green font-bold">
                {prizePool || "0"} USDC
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlayDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                payAmount();
                // Here would be wallet integration code
                toast({
                  title: "Transaction Initiated",
                  description: "Please confirm the transaction in your wallet",
                });

                // Mock successful transaction after 2 seconds
                setTimeout(() => {
                  setShowPlayDialog(false);
                  toast({
                    title: "Successfully Joined!",
                    description: "You're now participating in the contest",
                    variant: "default",
                  });
                }, 2000);
              }}
            >
              Confirm & Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default TeamDetail;
