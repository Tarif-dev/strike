import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Calendar,
  Users,
  Trophy,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Activity,
  Info,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { matches } from "../data/matchesData";
import { matchDetails } from "../data/matchDetails";
import PageContainer from "../components/layout/PageContainer";
import Navbar from "../components/layout/Navbar";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { cn } from "@/lib/utils"; 


const MatchDetails = () => {
  const { id: matchId } = useParams();
  const [matchData, setMatchData] = useState<any>(null);
  const [matchDetail, setMatchDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");
 

  useEffect(() => {
    // Find match from matches data
    const match = matches.find((m) => m.id === matchId);
    setMatchData(match);

    // Find match details if available
    const details = matchDetails.find(
      (d) => d.match_info?.match_id === matchId
    );
    setMatchDetail(details);

    setLoading(false);
  }, [matchId]);

  if (loading) {
    return (
      <>
        <PageContainer className="flex items-center justify-center min-h-screen py-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading match details...</p>
          </div>
        </PageContainer>
        <Navbar />
      </>
    );
  }

  // If no match data found
  if (!matchData) {
    return (
      <>
        <PageContainer className="py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Match Not Found</h2>
            <p className="text-gray-400 mb-6">
              We couldn't find the match you're looking for.
            </p>
            <Link
              to="/matches"
              className="flex items-center text-neon-green hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Matches
            </Link>
          </div>
        </PageContainer>
        <Navbar />
      </>
    );
  }

  // If no match details found
  if (!matchDetail) {
    return (
      <>
        <PageContainer className="py-8">
          <div className="mb-6 mt-4">
            <Link
              to="/matches"
              className="flex items-center text-neon-green hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Matches
            </Link>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Match Details</h1>
              <Badge
                variant={
                  matchData.status === "completed" ? "outline" : "default"
                }
              >
                {matchData.status === "completed"
                  ? "Completed"
                  : matchData.status === "live"
                  ? "Live"
                  : "Upcoming"}
              </Badge>
            </div>

            <Card className="p-6 bg-gray-900/70 backdrop-blur-sm mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex flex-col items-center mb-6 md:mb-0">
                  <div className="h-24 w-24 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-800/80 p-0.5 flex items-center justify-center mb-3">
                    <img
                      src={matchData.teams.home.logo}
                      alt={matchData.teams.home.name}
                      className="w-20 h-20 object-contain rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold">
                    {matchData.teams.home.name}
                  </h3>
                  <p className="text-gray-400">{matchData.teams.home.code}</p>
                  {matchData.status === "completed" &&
                    matchData.scores &&
                    matchData.scores.home && (
                      <Badge
                        variant="outline"
                        className="mt-3 text-lg px-3 py-1"
                      >
                        {matchData.scores.home}
                      </Badge>
                    )}
                </div>

                <div className="flex flex-col items-center text-center px-4 mb-6 md:mb-0">
                  <Badge variant="outline" className="mb-2 px-3 py-1">
                    {matchData.tournament.name}
                  </Badge>
                  <div className="text-3xl font-bold mb-2">VS</div>
                  {matchData.status === "completed" && matchData.result && (
                    <div className="text-sm text-center max-w-[200px] text-neon-green">
                      {matchData.result}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-800/80 p-0.5 flex items-center justify-center mb-3">
                    <img
                      src={matchData.teams.away.logo}
                      alt={matchData.teams.away.name}
                      className="w-20 h-20 object-contain rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold">
                    {matchData.teams.away.name}
                  </h3>
                  <p className="text-gray-400">{matchData.teams.away.code}</p>
                  {matchData.status === "completed" &&
                    matchData.scores &&
                    matchData.scores.away && (
                      <Badge
                        variant="outline"
                        className="mt-3 text-lg px-3 py-1"
                      >
                        {matchData.scores.away}
                      </Badge>
                    )}
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="p-4 bg-gray-900/70 backdrop-blur-sm flex items-center">
                <div className="bg-gray-800 rounded-full p-3 mr-3">
                  <MapPin className="w-6 h-6 text-neon-green" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Venue</p>
                  <p className="font-medium">{matchData.venue}</p>
                </div>
              </Card>

              <Card className="p-4 bg-gray-900/70 backdrop-blur-sm flex items-center">
                <div className="bg-gray-800 rounded-full p-3 mr-3">
                  <Calendar className="w-6 h-6 text-neon-green" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="font-medium">
                    {new Date(matchData.startTime).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Card>

              <Card className="p-4 bg-gray-900/70 backdrop-blur-sm flex items-center">
                <div className="bg-gray-800 rounded-full p-3 mr-3">
                  <Clock className="w-6 h-6 text-neon-green" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Time</p>
                  <p className="font-medium">
                    {new Date(matchData.startTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </Card>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <Activity className="w-16 h-16 text-gray-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Sorry, Match Details Not Available
              </h2>
              <p className="text-gray-400 max-w-md">
                We don't have detailed statistics for this match yet. Check back
                later for updates.
              </p>
            </div>
          </div>
        </PageContainer>
        <Navbar />
      </>
    );
  }

  // Prepare data for visualization if match details exist
  const homeTeamCode = matchData.teams.home.code;
  const awayTeamCode = matchData.teams.away.code;

  // Create batting performance data for charts
  const topBatsmen = [];
  if (matchDetail.innings && matchDetail.innings.length > 0) {
    // Get top 5 batsmen from first innings
    const firstInningsBatsmen = matchDetail.innings[0].batting
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 5)
      .map((player) => ({
        name: player.batter.split(" ").pop(), // Get last name for display
        runs: player.runs,
        balls: player.balls,
        team: matchDetail.innings[0].team,
        strikeRate: player.strike_rate,
      }));

    topBatsmen.push(...firstInningsBatsmen);

    // If there's a second innings, get top 5 batsmen
    if (matchDetail.innings.length > 1) {
      const secondInningsBatsmen = matchDetail.innings[1].batting
        .sort((a, b) => b.runs - a.runs)
        .slice(0, 5)
        .map((player) => ({
          name: player.batter.split(" ").pop(),
          runs: player.runs,
          balls: player.balls,
          team: matchDetail.innings[1].team,
          strikeRate: player.strike_rate,
        }));

      topBatsmen.push(...secondInningsBatsmen);
    }
  }

  // Create bowling performance data
  const topBowlers = [];
  if (matchDetail.innings && matchDetail.innings.length > 0) {
    // Get top bowlers from first innings
    const firstInningsBowlers = matchDetail.innings[0].bowling
      .sort((a, b) => b.wickets - a.wickets || a.economy - b.economy)
      .slice(0, 5)
      .map((player) => ({
        name: player.bowler.split(" ").pop(),
        wickets: player.wickets,
        runs: player.runs,
        overs: player.overs,
        economy: player.economy,
        team:
          matchDetail.innings[0].team === homeTeamCode
            ? awayTeamCode
            : homeTeamCode,
      }));

    topBowlers.push(...firstInningsBowlers);

    // If there's a second innings, get top bowlers
    if (matchDetail.innings.length > 1) {
      const secondInningsBowlers = matchDetail.innings[1].bowling
        .sort((a, b) => b.wickets - a.wickets || a.economy - b.economy)
        .slice(0, 5)
        .map((player) => ({
          name: player.bowler.split(" ").pop(),
          wickets: player.wickets,
          runs: player.runs,
          overs: player.overs,
          economy: player.economy,
          team:
            matchDetail.innings[1].team === homeTeamCode
              ? awayTeamCode
              : homeTeamCode,
        }));

      topBowlers.push(...secondInningsBowlers);
    }
  }

  // Create partnership data
  const partnerships = [];
  if (matchDetail.innings && matchDetail.innings.length > 0) {
    // Process fall of wickets to calculate partnerships
    matchDetail.innings.forEach((innings, index) => {
      if (innings.fall_of_wickets && innings.fall_of_wickets.length > 0) {
        let previousScore = 0;
        innings.fall_of_wickets.forEach((wicket) => {
          const scoreStr = wicket.split("(")[0].trim();
          const currentScore = parseInt(scoreStr.split("-")[0]);
          if (!isNaN(currentScore)) {
            const partnershipRuns = currentScore - previousScore;
            const wicketNum = scoreStr.split("-")[1];
            partnerships.push({
              team: innings.team,
              wicket: `Wicket ${wicketNum}`,
              runs: partnershipRuns,
              inningsNum: index + 1,
            });
            previousScore = currentScore;
          }
        });
      }
    });
  }

  // Create data for team comparison
  const teamComparison = [
    {
      name: "Total Score",
      [homeTeamCode]:
        matchDetail.innings &&
        matchDetail.innings.length > 0 &&
        matchDetail.innings[0].team === homeTeamCode
          ? parseInt(matchDetail.innings[0].score.split("/")[0])
          : matchDetail.innings &&
            matchDetail.innings.length > 1 &&
            matchDetail.innings[1].team === homeTeamCode
          ? parseInt(matchDetail.innings[1].score.split("/")[0])
          : 0,
      [awayTeamCode]:
        matchDetail.innings &&
        matchDetail.innings.length > 0 &&
        matchDetail.innings[0].team === awayTeamCode
          ? parseInt(matchDetail.innings[0].score.split("/")[0])
          : matchDetail.innings &&
            matchDetail.innings.length > 1 &&
            matchDetail.innings[1].team === awayTeamCode
          ? parseInt(matchDetail.innings[1].score.split("/")[0])
          : 0,
    },
    {
      name: "Run Rate",
      [homeTeamCode]:
        matchDetail.innings &&
        matchDetail.innings.length > 0 &&
        matchDetail.innings[0].team === homeTeamCode
          ? matchDetail.innings[0].run_rate
          : matchDetail.innings &&
            matchDetail.innings.length > 1 &&
            matchDetail.innings[1].team === homeTeamCode
          ? matchDetail.innings[1].run_rate
          : 0,
      [awayTeamCode]:
        matchDetail.innings &&
        matchDetail.innings.length > 0 &&
        matchDetail.innings[0].team === awayTeamCode
          ? matchDetail.innings[0].run_rate
          : matchDetail.innings &&
            matchDetail.innings.length > 1 &&
            matchDetail.innings[1].team === awayTeamCode
          ? matchDetail.innings[1].run_rate
          : 0,
    },
  ];

  // Calculate 4s and 6s counts for both teams
  let homeFours = 0,
    homeSixes = 0,
    awayFours = 0,
    awaySixes = 0;

  if (matchDetail.innings && matchDetail.innings.length > 0) {
    matchDetail.innings.forEach((innings) => {
      const isHomeTeam = innings.team === homeTeamCode;

      innings.batting.forEach((batter) => {
        if (isHomeTeam) {
          homeFours += batter.fours || 0;
          homeSixes += batter.sixes || 0;
        } else {
          awayFours += batter.fours || 0;
          awaySixes += batter.sixes || 0;
        }
      });
    });
  }

  teamComparison.push(
    {
      name: "Boundaries (4s)",
      [homeTeamCode]: homeFours,
      [awayTeamCode]: awayFours,
    },
    { name: "Sixes (6s)", [homeTeamCode]: homeSixes, [awayTeamCode]: awaySixes }
  );

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#8884d8"];
  const defaultBarColor = "#00C49F";

  const getTeamColor = (team) => {
    if (team === homeTeamCode) return "#00C49F"; // Green for home team
    return "#FFBB28"; // Yellow for away team
  };

  return (
    <>
      <PageContainer className="py-8">
        <div className="mb-6 mt-4">
          <Link
            to="/matches"
            className="flex items-center text-neon-green hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Matches
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Match Details</h1>
            <Badge
              variant={matchData.status === "completed" ? "outline" : "default"}
            >
              {matchData.status === "completed"
                ? "Completed"
                : matchData.status === "live"
                ? "Live"
                : "Upcoming"}
            </Badge>
          </div>

          {/* Match summary card with teams */}
          <Card className="p-6 bg-gray-900/70 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
            <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="flex flex-col items-center mb-6 md:mb-0">
                <div className="h-24 w-24 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-800/80 p-0.5 flex items-center justify-center mb-3">
                  <img
                    src={matchData.teams.home.logo}
                    alt={matchData.teams.home.name}
                    className="w-20 h-20 object-contain rounded-full"
                  />
                </div>
                <h3 className="text-xl font-bold">
                  {matchData.teams.home.name}
                </h3>
                <p className="text-gray-400">{matchData.teams.home.code}</p>
                {matchData.status === "completed" &&
                  matchData.scores &&
                  matchData.scores.home && (
                    <Badge variant="outline" className="mt-3 text-lg px-3 py-1">
                      {matchData.scores.home}
                    </Badge>
                  )}
              </div>

              <div className="flex flex-col items-center text-center px-4 mb-6 md:mb-0">
                <Badge variant="outline" className="mb-2 px-3 py-1">
                  {matchData.tournament.name}
                </Badge>
                <div className="text-3xl font-bold mb-2">VS</div>
                {matchData.status === "completed" && matchData.result && (
                  <div className="text-sm text-center max-w-[200px] text-neon-green">
                    {matchData.result}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-800/80 p-0.5 flex items-center justify-center mb-3">
                  <img
                    src={matchData.teams.away.logo}
                    alt={matchData.teams.away.name}
                    className="w-20 h-20 object-contain rounded-full"
                  />
                </div>
                <h3 className="text-xl font-bold">
                  {matchData.teams.away.name}
                </h3>
                <p className="text-gray-400">{matchData.teams.away.code}</p>
                {matchData.status === "completed" &&
                  matchData.scores &&
                  matchData.scores.away && (
                    <Badge variant="outline" className="mt-3 text-lg px-3 py-1">
                      {matchData.scores.away}
                    </Badge>
                  )}
              </div>
            </div>
          </Card>

          {/* Match key info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gray-900/70 backdrop-blur-sm flex items-center">
              <div className="bg-gray-800 rounded-full p-3 mr-3">
                <MapPin className="w-6 h-6 text-neon-green" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Venue</p>
                <p className="font-medium">
                  {matchDetail.match_info?.venue || matchData.venue}
                </p>
              </div>
            </Card>

            <Card className="p-4 bg-gray-900/70 backdrop-blur-sm flex items-center">
              <div className="bg-gray-800 rounded-full p-3 mr-3">
                <Calendar className="w-6 h-6 text-neon-green" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="font-medium">
                  {new Date(matchData.startTime).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Card>

            <Card className="p-4 bg-gray-900/70 backdrop-blur-sm flex items-center">
              <div className="bg-gray-800 rounded-full p-3 mr-3">
                <Clock className="w-6 h-6 text-neon-green" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Time</p>
                <p className="font-medium">
                  {new Date(matchData.startTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </Card>
          </div>

          {/* Match details tabs */}
          <Tabs
            defaultValue="summary"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>

            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              {/* Match result summary */}
              <Card className="p-6 bg-gray-900/70 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4">Match Summary</h3>

                <div className="mb-6">
                  {matchDetail.summary?.toss && (
                    <p className="text-gray-300 mb-2">
                      <span className="font-medium">Toss:</span>{" "}
                      {matchDetail.summary.toss}
                    </p>
                  )}

                  {matchDetail.summary?.result && (
                    <p className="text-gray-300 mb-2">
                      <span className="font-medium">Result:</span>{" "}
                      {matchDetail.summary.result}
                    </p>
                  )}

                  {matchDetail.summary?.player_of_the_match && (
                    <p className="text-gray-300 mb-2">
                      <span className="font-medium">Player of the Match:</span>{" "}
                      {matchDetail.summary.player_of_the_match}
                    </p>
                  )}
                </div>

                {/* Display innings summary */}
                {matchDetail.innings &&
                  matchDetail.innings.map((innings, index) => (
                    <div
                      key={index}
                      className="mb-4 pb-4 border-b border-gray-800/50 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center mb-3">
                        <Shield className="w-5 h-5 mr-2 text-neon-green" />
                        <h4 className="font-bold text-lg">{innings.team}</h4>
                      </div>

                      <div className="flex flex-wrap gap-x-8 gap-y-3">
                        <div>
                          <span className="text-gray-400 text-sm">Score:</span>
                          <div className="font-bold text-xl">
                            {innings.score}
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-400 text-sm">Overs:</span>
                          <div className="font-bold text-xl">
                            {innings.overs}
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-400 text-sm">
                            Run Rate:
                          </span>
                          <div className="font-bold text-xl">
                            {innings.run_rate}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Top performers quick view */}
                <div className="mt-6">
                  <h4 className="font-bold mb-3 text-lg">Top Performers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Top batsman */}
                    {topBatsmen.length > 0 && (
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">
                          Top Batsman
                        </div>
                        <div className="font-bold text-lg">
                          {topBatsmen[0].name}
                        </div>
                        <div className="text-neon-green font-semibold mt-1">
                          {topBatsmen[0].runs} runs ({topBatsmen[0].balls}{" "}
                          balls)
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {topBatsmen[0].team}
                        </div>
                      </div>
                    )}

                    {/* Top bowler */}
                    {topBowlers.length > 0 && (
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">
                          Top Bowler
                        </div>
                        <div className="font-bold text-lg">
                          {topBowlers[0].name}
                        </div>
                        <div className="text-amber-400 font-semibold mt-1">
                          {topBowlers[0].wickets} wickets ({topBowlers[0].runs}{" "}
                          runs)
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {topBowlers[0].team}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Key stats chart */}
              <Card className="p-6 bg-gray-900/70 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4">Team Comparison</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={teamComparison}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                      <YAxis tick={{ fill: "#ccc" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderColor: "#374151",
                          borderRadius: "0.375rem",
                        }}
                        itemStyle={{ color: "#f3f4f6" }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "10px" }} />
                      <Bar
                        dataKey={homeTeamCode}
                        fill="#00C49F"
                        name={homeTeamCode}
                      />
                      <Bar
                        dataKey={awayTeamCode}
                        fill="#FFBB28"
                        name={awayTeamCode}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>

            {/* Scorecard Tab */}
            <TabsContent value="scorecard" className="mt-6">
              {matchDetail.innings &&
                matchDetail.innings.map((innings, index) => (
                  <Card
                    key={index}
                    className="p-6 bg-gray-900/70 backdrop-blur-sm mb-6 last:mb-0"
                  >
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-neon-green" />
                      {innings.team} - {innings.score} ({innings.overs} overs)
                    </h3>

                    {/* Batting table */}
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-800 text-left">
                            <th className="py-2 px-4 text-sm font-semibold text-gray-400">
                              Batter
                            </th>
                            <th className="py-2 px-4 text-sm font-semibold text-gray-400">
                              Dismissal
                            </th>
                            <th className="py-2 px-4 text-sm font-semibold text-gray-400 text-right">
                              R
                            </th>
                            <th className="py-2 px-4 text-sm font-semibold text-gray-400 text-right">
                              B
                            </th>
                            <th className="py-2 px-4 text-sm font-semibold text-gray-400 text-right">
                              4s
                            </th>
                            <th className="py-2 px-4 text-sm font-semibold text-gray-400 text-right">
                              6s
                            </th>
                            <th className="py-2 px-4 text-sm font-semibold text-gray-400 text-right">
                              SR
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                          {innings.batting.map((batter, i) => (
                            <tr
                              key={i}
                              className="hover:bg-gray-800/30 transition-colors"
                            >
                              <td className="py-2 px-4 font-medium">
                                {batter.batter}
                              </td>
                              <td className="py-2 px-4 text-gray-400 text-sm">
                                {batter.dismissal}
                              </td>
                              <td className="py-2 px-4 text-right font-bold">
                                {batter.runs}
                              </td>
                              <td className="py-2 px-4 text-right text-gray-300">
                                {batter.balls}
                              </td>
                              <td className="py-2 px-4 text-right text-gray-300">
                                {batter.fours}
                              </td>
                              <td className="py-2 px-4 text-right text-gray-300">
                                {batter.sixes}
                              </td>
                              <td className="py-2 px-4 text-right font-medium">
                                {batter.strike_rate}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-gray-800 font-semibold">
                            <td className="py-2 px-4">Extras</td>
                            <td
                              className="py-2 px-4 text-gray-400 text-sm"
                              colSpan={5}
                            >
                              {Object.entries(innings.extras || {}).map(
                                ([key, value], i, arr) => (
                                  <React.Fragment key={key}>
                                    {key !== "total" &&
                                      `${key
                                        .charAt(0)
                                        .toUpperCase()}: ${value}${
                                        i < arr.length - 1 ? ", " : ""
                                      }`}
                                  </React.Fragment>
                                )
                              )}
                            </td>
                            <td className="py-2 px-4 text-right">
                              {innings.extras?.total || 0}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Fall of wickets */}
                    {innings.fall_of_wickets &&
                      innings.fall_of_wickets.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-lg mb-2">
                            Fall of wickets
                          </h4>
                          <p className="text-gray-300">
                            {innings.fall_of_wickets.join(", ")}
                          </p>
                        </div>
                      )}

                    {/* Bowling table */}
                    <h4 className="font-semibold text-lg mb-2">Bowling</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-800 text-left">
                            <th className="py-2 px-4 text-sm font-semibold text-gray-400">
                              Bowler
                            </th>
                            <th className="py-2 px-4 text-sm font-semibold text-gray-400 text-right">
                              O
                            </th>
                            <th className="py-2 px-4 text-sm font-semibold text-gray-400 text-right">
                              M
                            </th>
                            <th className="py-2 px-4 text-sm font-semibold text-gray-400 text-right">
                              R
                            </th>
                            <th className="py-2 px-4 text-sm font-semibold text-gray-400 text-right">
                              W
                            </th>
                            <th className="py-2 px-4 text-sm font-semibold text-gray-400 text-right">
                              Econ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                          {innings.bowling.map((bowler, i) => (
                            <tr
                              key={i}
                              className="hover:bg-gray-800/30 transition-colors"
                            >
                              <td className="py-2 px-4 font-medium">
                                {bowler.bowler}
                              </td>
                              <td className="py-2 px-4 text-right text-gray-300">
                                {bowler.overs}
                              </td>
                              <td className="py-2 px-4 text-right text-gray-300">
                                {bowler.maidens}
                              </td>
                              <td className="py-2 px-4 text-right text-gray-300">
                                {bowler.runs}
                              </td>
                              <td className="py-2 px-4 text-right font-bold">
                                {bowler.wickets}
                              </td>
                              <td className="py-2 px-4 text-right font-medium">
                                {bowler.economy}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                ))}
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-6 mt-6">
              {/* Top batsmen chart */}
              <Card className="p-6 bg-gray-900/70 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4">
                  Top Batting Performances
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topBatsmen}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                      <YAxis tick={{ fill: "#ccc" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderColor: "#374151",
                          borderRadius: "0.375rem",
                        }}
                        itemStyle={{ color: "#f3f4f6" }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "10px" }} />
                      <Bar
                        dataKey="runs"
                        name="Runs"
                        fill={defaultBarColor}
                        radius={[4, 4, 0, 0]}
                        barSize={50}
                      >
                        {topBatsmen.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getTeamColor(entry.team)}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Top bowlers chart */}
              <Card className="p-6 bg-gray-900/70 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4">
                  Top Bowling Performances
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topBowlers}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                      <YAxis tick={{ fill: "#ccc" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderColor: "#374151",
                          borderRadius: "0.375rem",
                        }}
                        itemStyle={{ color: "#f3f4f6" }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "10px" }} />
                      <Bar
                        dataKey="wickets"
                        name="Wickets"
                        fill="#FF8042"
                        radius={[4, 4, 0, 0]}
                        barSize={50}
                      >
                        {topBowlers.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getTeamColor(entry.team)}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Partnership chart */}
              {partnerships.length > 0 && (
                <Card className="p-6 bg-gray-900/70 backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-4">Partnerships</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={partnerships}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="wicket" tick={{ fill: "#ccc" }} />
                        <YAxis tick={{ fill: "#ccc" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderColor: "#374151",
                            borderRadius: "0.375rem",
                          }}
                          itemStyle={{ color: "#f3f4f6" }}
                        />
                        <Legend wrapperStyle={{ paddingTop: "10px" }} />
                        <Bar
                          dataKey="runs"
                          name="Runs"
                          barSize={50}
                          radius={[4, 4, 0, 0]}
                        >
                          {partnerships.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={getTeamColor(entry.team)}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="comparison" className="mt-6 space-y-6">
              {/* Team statistics comparison card */}
              <Card className="p-6 bg-gray-900/70 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4">Team Statistics</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={teamComparison}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis type="number" tick={{ fill: "#ccc" }} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fill: "#ccc" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderColor: "#374151",
                          borderRadius: "0.375rem",
                        }}
                        itemStyle={{ color: "#f3f4f6" }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "10px" }} />
                      <Bar
                        dataKey={homeTeamCode}
                        fill="#00C49F"
                        name={homeTeamCode}
                        barSize={30}
                        radius={[0, 4, 4, 0]}
                      />
                      <Bar
                        dataKey={awayTeamCode}
                        fill="#FFBB28"
                        name={awayTeamCode}
                        barSize={30}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Boundary comparison pie charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Home team boundaries pie chart */}
                <Card className="p-6 bg-gray-900/70 backdrop-blur-sm">
                  <h3 className="text-lg font-bold mb-4">
                    {homeTeamCode} Boundaries
                  </h3>
                  <div className="h-64 flex items-center justify-center">
                    {homeFours > 0 || homeSixes > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "4s", value: homeFours },
                              { name: "6s", value: homeSixes },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell key="cell-0" fill="#00C49F" />
                            <Cell key="cell-1" fill="#FFBB28" />
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f2937",
                              borderColor: "#374151",
                              borderRadius: "0.375rem",
                            }}
                            itemStyle={{ color: "#f3f4f6" }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-gray-500">
                        No boundary data available
                      </div>
                    )}
                  </div>
                </Card>

                {/* Away team boundaries pie chart */}
                <Card className="p-6 bg-gray-900/70 backdrop-blur-sm">
                  <h3 className="text-lg font-bold mb-4">
                    {awayTeamCode} Boundaries
                  </h3>
                  <div className="h-64 flex items-center justify-center">
                    {awayFours > 0 || awaySixes > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "4s", value: awayFours },
                              { name: "6s", value: awaySixes },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell key="cell-0" fill="#00C49F" />
                            <Cell key="cell-1" fill="#FFBB28" />
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f2937",
                              borderColor: "#374151",
                              borderRadius: "0.375rem",
                            }}
                            itemStyle={{ color: "#f3f4f6" }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-gray-500">
                        No boundary data available
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default MatchDetails;
