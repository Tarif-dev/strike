import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Filter,
  ChevronDown,
  Search,
  Trophy,
  X,
  Clock,
  CalendarDays,
  LogIn,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import MatchCard, { MatchData } from "@/components/cricket/MatchCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseMatches } from "@/hooks/useSupabaseMatches";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { IDL } from "@/idl/strike_contracts_new";
import { Program, BN } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import axios from "axios";
import { supabase } from "@/integrations/supabase/client";

const options = {
  method: "GET",
  url: "https://cricbuzz-cricket.p.rapidapi.com/matches/v1/upcoming",
  headers: {
    "x-rapidapi-key": "014abe6e35msh76ef70851596118p1e000fjsn01ac2f8b6c4d",
    "x-rapidapi-host": "cricbuzz-cricket.p.rapidapi.com",
  },
};

// Initialize program ID outside of component
const PROGRAM_ID = new PublicKey(
  "2Bnp9uikuv1EuAfHbcXizF8FcqNDKQg7hfuKbLC9y6hT"
);

const Matches = () => {
  const [activeTab, setActiveTab] = useState("All");
  const { matches, loading, error } = useSupabaseMatches(); // Using our new Supabase hook
  const [currentMonth, setCurrentMonth] = useState("");
  const [prizePools, setPrizePools] = useState<Record<string, string>>({});
  const [loadingPrizePools, setLoadingPrizePools] = useState(false);
  const [contestantsMap, setContestantsMap] = useState<Record<string, number>>(
    {}
  );
  const wallet = useWallet();
  const { connection } = useConnection();
  const {
    connecting,
    disconnect,
    select,
    sendTransaction,
    connected,
    publicKey,
  } = wallet;

  useEffect(() => {
    console.log("admin allowed matches", matches);
  }, [matches]);

  // Make sure matches is always an array and status is a valid type
  const safeMatches: MatchData[] = Array.isArray(matches)
    ? matches.map((match) => ({
        ...match,
        status:
          match.status === "completed" ||
          match.status === "live" ||
          match.status === "upcoming"
            ? match.status
            : "upcoming", // Default fallback if status is not one of the expected values
      }))
    : [];

  // Sort all matches by start time, latest first
  const sortedMatches = [...safeMatches].sort((a, b) => {
    return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
  });

  // Filter matches by status ensuring the status matches the expected type
  const liveMatches = sortedMatches.filter((m) => m.status === "live");
  const upcomingMatches = sortedMatches.filter((m) => m.status === "upcoming");
  const completedMatches = sortedMatches.filter(
    (m) => m.status === "completed"
  );

  const getFilteredMatches = () => {
    switch (activeTab) {
      case "Live":
        return liveMatches;
      case "Upcoming":
        return upcomingMatches;
      case "Completed":
        return completedMatches;
      default:
        return sortedMatches;
    }
  };

  const filteredMatches = getFilteredMatches();

  // Fetch prize pools for matches
  const fetchPrizePools = useCallback(async () => {
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
      const contestantsMap: Record<string, number> = {};
      // Fetch prize pools for all matches
      for (const match of filteredMatches) {
        try {
          // Use the match ID for PDA derivation

          const shortMatchId = match.id;
          const matchIdBuffer = Buffer.from(shortMatchId);

          // Derive the match pool PDA
          const [matchPoolPDA] = await PublicKey.findProgramAddress(
            [Buffer.from("match_pool"), matchIdBuffer],
            PROGRAM_ID
          );

          // Fetch the match pool account data using bracket notation
          const matchPoolAccount =
            await program.account["matchPool"].fetch(matchPoolPDA);
          console.log("Match pool account:", matchPoolAccount);

          // Get the total deposited amount
          const totalDeposited = matchPoolAccount.totalDeposited;

          // Convert from lamports to USDC (assuming 6 decimals for USDC)
          const totalDepositedUsdc = (
            totalDeposited.toNumber() / 1_000_000
          ).toFixed(2);

          // Store in the map
          poolsMap[match.id] = totalDepositedUsdc;
          contestantsMap[match.id] = matchPoolAccount?.deposits?.length || 0;
        } catch (error) {
          console.log(`No pool found for match ${match.id}`);
          // If no pool exists, set to 0
          poolsMap[match.id] = "0.00";
          contestantsMap[match.id] = 0;
        }
      }
      console.log("Prize pools fetched:", poolsMap);
      setPrizePools(poolsMap);
      setContestantsMap(contestantsMap);
    } catch (error) {
      console.error("Error fetching prize pools:", error);
    } finally {
      setLoadingPrizePools(false);
    }
  }, [connection, connected, wallet, filteredMatches]);

  // Function to fetch the team counts for each match
  const fetchTeamCounts = useCallback(async () => {
    if (!matches || matches.length === 0) return;

    try {
      // Create a map to store team counts
      const countsMap: Record<string, number> = {};

      // Initialize all matches with zero teams
      matches.forEach((match) => {
        countsMap[match.id] = 0;
      });

      // Fetch all teams and count them per match
      const { data, error } = await supabase.from("teams").select("match_id");

      if (error) {
        console.error("Error fetching team counts:", error);
        return;
      }

      // Count teams for each match
      if (data) {
        data.forEach((team) => {
          if (team.match_id) {
            countsMap[team.match_id] = (countsMap[team.match_id] || 0) + 1;
          }
        });
      }

      console.log("Team counts fetched:", countsMap);
    } catch (error) {
      console.error("Error fetching team counts:", error);
    } finally {
    }
  }, [matches]);

  // Set current month on component mount
  useEffect(() => {
    // Set the current month for display
    const now = new Date();
    setCurrentMonth(
      now.toLocaleString("default", { month: "long", year: "numeric" })
    );
  }, []);

  // Fetch prize pools when wallet is connected and we have matches
  useEffect(() => {
    if (connected && publicKey && matches.length > 0) {
      fetchPrizePools();
    }
  }, [connected, publicKey, matches]);

  // Fetch team counts when matches are loaded
  useEffect(() => {
    if (matches.length > 0) {
      fetchTeamCounts();
    }
  }, [matches, fetchTeamCounts]);

  // Group upcoming matches by date
  const groupedUpcomingMatches =
    activeTab === "Upcoming"
      ? upcomingMatches.reduce((groups: Record<string, MatchData[]>, match) => {
          const date = new Date(match.startTime).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          });
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(match);
          return groups;
        }, {})
      : {};

  return (
    <>
      <PageContainer>
        <div className="mt-4 space-y-6">
          {/* Featured contest banner - only show for upcoming matches */}
          {activeTab === "Upcoming" && upcomingMatches.length > 0 && (
            <div className="relative overflow-hidden rounded-xl">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green/30 to-blue-600/30 rounded-xl blur-sm opacity-75"></div>
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl p-4 md:p-6 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-neon-green/20 text-neon-green px-2 py-0.5 rounded-full text-xs font-medium">
                        MEGA CONTEST
                      </div>
                      <div className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-xs font-medium">
                        ₹10 CRORE PRIZE
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">
                      IPL 2025 Championship League
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Join the biggest fantasy contest of the season
                    </p>
                  </div>
                  <button className="bg-neon-green hover:bg-neon-green/90 text-gray-900 px-6 py-2 rounded-full font-medium transition-colors">
                    Join Mega Contest
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="text-neon-green" />
              <span>{currentMonth}</span>
            </div>
            <button className="flex items-center gap-1 text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          <Tabs
            defaultValue="All"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Live">Live</TabsTrigger>
              <TabsTrigger value="Upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="Completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Clock className="h-8 w-8 text-neon-green animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">Error loading matches: {error}</p>
              <p className="text-muted-foreground text-sm mt-2">
                Check your connection or database settings
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {activeTab === "Upcoming" && upcomingMatches.length > 0 ? (
                // Grouped upcoming matches by date
                Object.entries(groupedUpcomingMatches).map(
                  ([date, matches]) => (
                    <div key={date} className="space-y-4">
                      <h3 className="font-medium text-gray-300 flex items-center gap-2 sticky top-0 bg-gray-950/80 backdrop-blur-sm py-2 z-10">
                        <CalendarDays className="h-4 w-4 text-neon-green" />
                        {date}
                      </h3>
                      <div className="space-y-4">
                        {prizePools &&
                          matches.map((match) => {
                            console.log("Match ID from loop:", match.id);
                            console.log(
                              "Prize Pool from loop :",
                              prizePools[match.id]
                            );
                            return (
                              <MatchCard
                                key={match.id}
                                match={match}
                                showFantasyFeatures={true}
                                prizePool={prizePools[match.id]}
                                contestants={contestantsMap[match.id] || 0}
                              />
                            );
                          })}
                      </div>
                    </div>
                  )
                )
              ) : filteredMatches.length > 0 ? (
                <div className="space-y-4">
                  {filteredMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      showFantasyFeatures={activeTab !== "Completed"}
                      prizePool={prizePools && prizePools[match.id]}
                      contestants={contestantsMap[match.id] || 0}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800 backdrop-blur-sm">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-800/80 flex items-center justify-center mb-4">
                    <CalendarDays className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-xl font-medium mb-2">No matches found</p>
                  <p className="text-gray-400 max-w-md mx-auto">
                    {activeTab === "Live"
                      ? "There are no live matches at the moment. Check back later or explore upcoming matches."
                      : activeTab === "Upcoming"
                        ? "There are no upcoming matches scheduled. Check back later or create one from the admin panel."
                        : activeTab === "Completed"
                          ? "No completed matches found. Match history will appear here."
                          : "No matches available. Check back later for updates."}
                  </p>
                </div>
              )}

              {/* Quick links for creating teams */}
              {(activeTab === "Upcoming" || activeTab === "All") &&
                upcomingMatches.length > 0 && (
                  <div className="mt-8 p-4 bg-gray-900/60 border border-gray-800 rounded-xl">
                    <h3 className="font-medium mb-3">
                      Create Your Fantasy Teams
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {upcomingMatches.slice(0, 2).map((match) => (
                        <Link
                          key={match.id}
                          to={`/teams/create?match=${match.id}`}
                          className="flex items-center justify-between p-3 bg-gray-800/80 hover:bg-gray-800 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                              <span className="font-bold text-neon-green">
                                {match.teams.home.code.substring(0, 1)}
                                {match.teams.away.code.substring(0, 1)}
                              </span>
                            </div>
                            <div className="text-left">
                              <p className="font-medium">
                                {match.teams.home.code} vs{" "}
                                {match.teams.away.code}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(match.startTime).toLocaleString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <span className="text-neon-green text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Create Team →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default Matches;
