import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  Zap,
  Calendar,
  BarChart3,
  Clock,
  ChevronRight,
  Bell,
  Wallet,
  ArrowRight,
  ArrowUpRight,
  Star,
  MoreHorizontal,
  CalendarDays,
  Sparkles,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import MatchCard from "@/components/cricket/MatchCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs } from "@/components/ui/tabs";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import BlockchainFeatureShowcase from "@/components/common/BlockchainFeatureShowcase";
import MagicBlockBanner from "@/components/common/MagicBlockBanner";
import ZkCompressionBanner from "@/components/common/ZkCompressionBanner";
import TechFeatureCards from "@/components/common/TechFeatureCards";
import ZkCompressionMetrics from "@/components/common/ZkCompressionMetrics";

// Hooks and contexts
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Program, BN } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
// Data
import { teams, players, notifications } from "@/data/mockData";
import { matches } from "@/data/matchesData";
import { IDL } from "@/idl/strike_contracts_new";
// Animation variants
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
};

const staggerItems = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const itemAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Home = () => {
  // States
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [usdcBalance, setUsdcBalance] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [prizePools, setPrizePools] = useState<Record<string, string>>({});
  const [loadingPrizePools, setLoadingPrizePools] = useState(false);
  const navigate = useNavigate(); // add this import if not already present

  const wallet = useWallet();
  const { connecting, disconnect, select, sendTransaction } = wallet;
  const PROGRAM_ID = new PublicKey(
    "2Bnp9uikuv1EuAfHbcXizF8FcqNDKQg7hfuKbLC9y6hT"
  );
  const fetchPrizePools = async () => {
    if (!connection || !connected) {
      return;
    }

    try {
      setLoadingPrizePools(true);

      // Create provider and program
      const provider = new anchor.AnchorProvider(connection, wallet, {
        commitment: "confirmed",
      });
      const program = new Program(IDL, provider);

      // Create a map to store prize pools
      const poolsMap: Record<string, string> = {};

      // Fetch prize pools for all matches
      const matchesToFetch = [...liveMatches, ...upcomingMatches];

      for (const match of matchesToFetch) {
        try {
          // Use the match ID for PDA derivation
          console.log("Fetching prize pool for match:", match.id);
          const shortMatchId = match.id.split("-")[0];
          const matchIdBuffer = Buffer.from(shortMatchId);

          // Derive the match pool PDA
          const [matchPoolPDA] = await PublicKey.findProgramAddress(
            [Buffer.from("match_pool"), matchIdBuffer],
            PROGRAM_ID
          );

          // Fetch the match pool account data using a type assertion
          try {
            // Using "as any" to bypass TypeScript type checking for the fetch method
            const matchPoolAccount = await (
              program.account as any
            ).MatchPool.fetch(matchPoolPDA);

            // Get the total deposited amount
            const totalDeposited = matchPoolAccount.total_deposited;

            // Convert from lamports to USDC (assuming 6 decimals for USDC)
            const totalDepositedUsdc = (
              totalDeposited.toNumber() / 1_000_000
            ).toFixed(2);

            // Store in the map
            poolsMap[match.id] = totalDepositedUsdc;
          } catch (error) {
            console.log(`No pool found for match ${match.id}: ${error}`);
            // If no pool exists, set to 0
            poolsMap[match.id] = "0.00";
          }
        } catch (error) {
          console.log(`Error processing match ${match.id}: ${error}`);
        }
      }
      console.log("Prize pools fetched:", poolsMap);
      setPrizePools(poolsMap);
    } catch (error) {
      console.error("Error fetching prize pools:", error);
    } finally {
      setLoadingPrizePools(false);
    }
  };
  useEffect(() => {
    if (connected && publicKey) {
      fetchPrizePools();
    }
  }, [connected, publicKey]);

  // USDC token mint address (as specified)
  const USDC_MINT = new PublicKey(
    "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
  );

  // Format public key for display
  const formatPublicKey = (key) => {
    if (!key) return "";
    const keyStr = key.toString();
    return `${keyStr.substring(0, 4)}...${keyStr.substring(keyStr.length - 4)}`;
  };

  // Add this function to fetch USDC balance
  const fetchUSDCBalance = async () => {
    if (!publicKey || !connection) return;

    try {
      setTokenLoading(true);

      // Find token accounts owned by the user
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { mint: USDC_MINT }
      );

      // Look for USDC token account
      let userUsdcBalance = 0;

      for (const account of tokenAccounts.value) {
        const parsedInfo = account.account.data.parsed.info;
        const tokenBalance = parsedInfo.tokenAmount.uiAmount;
        userUsdcBalance += tokenBalance;
      }

      setUsdcBalance(userUsdcBalance);
    } catch (error) {
      console.error("Error fetching USDC balance:", error);
      toast({
        title: "Error Fetching Balance",
        description: "Could not load your USDC balance.",
        variant: "destructive",
      });
    } finally {
      setTokenLoading(false);
    }
  };

  // Add this effect to fetch balance when wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      fetchUSDCBalance();
    } else {
      setUsdcBalance(null);
    }
  }, [connected, publicKey]);

  // Get current date for greeting
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
        ? "Good Afternoon"
        : "Good Evening";

  // Format today's date
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", dateOptions);

  // Filter matches by status
  const liveMatches = matches
    .filter((m) => m.status === "live")
    .map((match) => ({
      ...match,
      status: match.status as "live" | "upcoming" | "completed",
    }));
  const upcomingMatches = matches
    .filter((m) => m.status === "upcoming")
    .slice(0, 3)
    .map((match) => ({
      ...match,
      status: match.status as "live" | "upcoming" | "completed",
    }));

  // Top players
  const topPlayers = players
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 3);

  // Unread notifications
  const unreadNotifications = notifications.filter((n) => !n.read);

  // Get user display name from metadata or email
  const getUserDisplayName = () => {
    if (!user) return "";

    // Try to get name from user metadata
    const metadata = user.user_metadata;
    if (metadata?.name) return metadata.name;
    if (metadata?.full_name) return metadata.full_name;

    // Fallback to email
    if (user.email) {
      return user.email.split("@")[0];
    }

    return "";
  };

  // Get user photo URL

  useEffect(() => {
    // Show notification toast if there are unread notifications
    if (unreadNotifications.length > 0) {
      toast({
        title: `${unreadNotifications.length} New Notifications`,
        description: unreadNotifications[0].message,
        duration: 3000,
      });
    }
  }, []);

  return (
    <>
      <PageContainer className="pb-24">
        {/* Wallet balance card */}
        <motion.div {...fadeIn}>
          <Card className="bg-gradient-to-r from-gray-900 to-gray-950 border-gray-800 mb-6 overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-neon-green/10 flex items-center justify-center mr-3">
                    <Wallet className="h-5 w-5 text-neon-green" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Available Balance</p>
                    {!connected ? (
                      <p className="text-md text-gray-400">
                        Wallet not connected
                      </p>
                    ) : (
                      <p className="text-xl font-bold text-white">
                        {tokenLoading ? (
                          <span className="flex items-center">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Loading...
                          </span>
                        ) : (
                          `${
                            usdcBalance !== null
                              ? usdcBalance.toFixed(2)
                              : "0.00"
                          } USDC`
                        )}
                      </p>
                    )}
                  </div>
                </div>
                {!connected ? (
                  <WalletMultiButton className="text-sm px-4 py-2 h-9 bg-neon-green text-gray-900 hover:bg-neon-green/90 rounded-md" />
                ) : (
                  <Button
                    size="sm"
                    className="bg-neon-green text-gray-900 hover:bg-neon-green/90"
                    onClick={() => navigate("/wallet")}
                  >
                    Manage
                  </Button>
                )}
              </div>

              {connected && (
                <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                  <Link to="/wallet">
                    <div className="p-2 bg-gray-800/40 hover:bg-gray-800/60 rounded-lg transition-colors">
                      <p className="text-xs text-gray-400">Wallet</p>
                      <p className="font-medium text-white">
                        {formatPublicKey(publicKey)}
                      </p>
                    </div>
                  </Link>
                  <Link to="/wallet">
                    <div className="p-2 bg-gray-800/40 hover:bg-gray-800/60 rounded-lg transition-colors">
                      <p className="text-xs text-gray-400">Network</p>
                      <p className="font-medium text-white">Solana Devnet</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Live matches section (if any) */}
        {liveMatches.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                <h2 className="font-bold text-lg">Live Matches</h2>
              </div>
              <Link
                to="/matches?filter=live"
                className="text-neon-green text-sm flex items-center"
              >
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {liveMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  showFantasyFeatures={true}
                  featured={match.fantasy?.isHotMatch}
                  prizePool={prizePools[match.id]}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Mega contest highlight */}
        <motion.div
          className="mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-green/20 to-purple-500/20 rounded-xl blur-lg animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800/40 p-5 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>

            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-neon-green" />
              <h3 className="text-sm font-semibold text-neon-green">
                MEGA CONTEST
              </h3>
            </div>

            <h2 className="text-xl font-bold mb-2">IPL 2025 Championship</h2>

            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                <span className="text-lg font-bold text-white">₹10 Crore</span>
              </div>

              <Badge className="bg-gray-800 text-gray-300">
                <Clock className="h-3 w-3 mr-1 text-neon-green" />
                2d left
              </Badge>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Registration</span>
                <span className="text-amber-400">75% Full</span>
              </div>
              <Progress value={75} className="h-1.5 bg-gray-800" />
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-neon-green hover:bg-neon-green/90 text-gray-900 font-medium">
                Join Now
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-700 hover:bg-gray-800/60"
              >
                View Details
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Blockchain Technology Feature Cards */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <TechFeatureCards />
        </motion.div>

        {/* Technology Banners */}
        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <MagicBlockBanner className="rounded-xl" />
          <ZkCompressionBanner className="rounded-xl" />
        </motion.div>

        {/* ZK Compression Metrics */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.37 }}
        >
          <ZkCompressionMetrics />
        </motion.div>

        {/* Upcoming matches */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Upcoming Matches</h2>
            <Link
              to="/matches?filter=upcoming"
              className="text-neon-green text-sm flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                showFantasyFeatures={true}
              />
            ))}
          </div>
        </motion.div>

        {/* Quick links section */}
        <motion.div
          className="mb-8"
          variants={staggerItems}
          initial="initial"
          animate="animate"
        >
          <h2 className="font-bold text-lg mb-4">Quick Actions</h2>

          <div className="grid grid-cols-3 gap-3">
            <motion.div variants={itemAnimation}>
              <Link to="/teams/create">
                <div className="flex flex-col items-center justify-center bg-gray-900/80 hover:bg-gray-900 border border-gray-800/50 rounded-xl p-4 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-neon-green/10 flex items-center justify-center mb-2">
                    <ArrowRight className="h-5 w-5 text-neon-green" />
                  </div>
                  <span className="text-sm text-center">Create Team</span>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={itemAnimation}>
              <Link to="/leagues">
                <div className="flex flex-col items-center justify-center bg-gray-900/80 hover:bg-gray-900 border border-gray-800/50 rounded-xl p-4 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-amber-400/10 flex items-center justify-center mb-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="text-sm text-center">Leagues</span>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={itemAnimation}>
              <Link to="/wallet">
                <div className="flex flex-col items-center justify-center bg-gray-900/80 hover:bg-gray-900 border border-gray-800/50 rounded-xl p-4 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-2">
                    <ArrowUpRight className="h-5 w-5 text-purple-500" />
                  </div>
                  <span className="text-sm text-center">Add Money</span>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          className="mb-8"
          variants={staggerItems}
          initial="initial"
          animate="animate"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Fantasy Stats</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div variants={itemAnimation}>
              <div className="bg-gray-900/80 border border-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <CalendarDays className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-xs text-gray-400">This Season</span>
                </div>
                <p className="text-xl font-bold text-white">500+</p>
                <p className="text-sm text-gray-400">Matches</p>
              </div>
            </motion.div>

            <motion.div variants={itemAnimation}>
              <div className="bg-gray-900/80 border border-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="h-8 w-8 rounded-full bg-neon-green/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-neon-green" />
                  </div>
                  <span className="text-xs text-gray-400">Community</span>
                </div>
                <p className="text-xl font-bold text-white">15M+</p>
                <p className="text-sm text-gray-400">Players</p>
              </div>
            </motion.div>

            <motion.div variants={itemAnimation}>
              <div className="bg-gray-900/80 border border-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="h-8 w-8 rounded-full bg-amber-400/10 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-amber-400" />
                  </div>
                  <span className="text-xs text-gray-400">Total Prizes</span>
                </div>
                <p className="text-xl font-bold text-white">₹10Cr</p>
                <p className="text-sm text-gray-400">Prize Pool</p>
              </div>
            </motion.div>

            <motion.div variants={itemAnimation}>
              <div className="bg-gray-900/80 border border-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-red-400" />
                  </div>
                  <span className="text-xs text-gray-400">Today</span>
                </div>
                <p className="text-xl font-bold text-white">5000+</p>
                <p className="text-sm text-gray-400">Winners</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Top performers */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Top Performers</h2>
            <Link
              to="/matches"
              className="text-neon-green text-sm flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-3">
            {topPlayers.map((player, index) => (
              <Link to={`/matches`} key={player.id}>
                <Card className="bg-gray-900/80 hover:bg-gray-900 border border-gray-800/50 transition-colors">
                  <div className="p-3 flex items-center">
                    <div className="flex items-center flex-1 gap-3">
                      {/* Rank indicator */}
                      <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold">
                        #{index + 1}
                      </div>

                      {/* Player image */}
                      <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-800">
                        {player.image ? (
                          <img
                            src={player.image}
                            alt={player.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Player details */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{player.name}</h3>
                          <img
                            src={player.countryFlag}
                            alt={player.country}
                            className="h-3 w-5"
                          />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <img
                            src={player.teamLogo}
                            alt={player.team}
                            className="h-3 w-3"
                          />
                          <span>{player.position}</span>
                        </div>
                      </div>
                    </div>

                    {/* Player points */}
                    <div className="px-3 py-1.5 bg-neon-green/10 rounded-full">
                      <span className="text-sm font-medium text-neon-green">
                        {player.points} pts
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Featured league */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Featured League</h2>
            <Link
              to="/leagues"
              className="text-neon-green text-sm flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/50 overflow-hidden">
            <div className="relative p-5">
              <div className="absolute top-0 right-0">
                <div className="bg-neon-green text-black font-bold text-xs py-1 px-6 rounded-bl-lg">
                  FEATURED
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-neon-green/20 to-blue-500/20 flex items-center justify-center border border-neon-green/30">
                  <Trophy className="h-7 w-7 text-neon-green" />
                </div>

                <div>
                  <h3 className="text-xl font-bold">IPL Fantasy League</h3>
                  <p className="text-sm text-gray-400">14,726 participants</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-gray-400">Prize Pool</span>
                  <p className="text-xl font-bold text-neon-green">
                    ₹1,000,000
                  </p>
                </div>

                <div>
                  <span className="text-xs text-gray-400">Duration</span>
                  <p className="text-sm">Apr 5 - May 28, 2025</p>
                </div>
              </div>

              <Button className="w-full bg-neon-green hover:bg-neon-green/90 text-gray-900 font-medium">
                Join League
              </Button>
            </div>
          </Card>
        </motion.div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default Home;
