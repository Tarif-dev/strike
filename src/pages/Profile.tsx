import React, { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import {
  Settings,
  LogOut,
  ChevronRight,
  Key,
  Trophy,
  Wallet,
  Users,
  BarChart3,
  History,
  Award,
  Star,
  Zap,
  Plus,
  Lock,
  Bell,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define types for our teams
type DatabaseTeam = Database["public"]["Tables"]["teams"]["Row"];

// Define interface that works with both database teams and mock fantasy data
interface TeamWithDetails extends Omit<DatabaseTeam, "id"> {
  id: string | number;
  name?: string;
  points?: number;
  rank?: number;
  nextMatch?: string;
  contestName?: string;
}

// Define types for mock data
interface FantasyData {
  balance: number;
  totalPoints: number;
  rank: number;
  contests: {
    upcoming: number;
    live: number;
    completed: number;
    totalWinnings: number;
  };
  teams: {
    id: string | number;
    name: string;
    points: number;
    rank: number;
    nextMatch: string;
    contestName: string;
  }[];
  recentResults: {
    contestId: number;
    contestName: string;
    teamName: string;
    rank: number;
    points: number;
    winnings: number;
    date: string;
  }[];
  achievements: {
    id: number;
    name: string;
    description: string;
    achieved: boolean;
    date?: string;
    progress?: number;
  }[];
  favoriteTeams: string[];
  favoritePlayers: string[];
}

// Mock data - In a real app, this would come from an API
const mockFantasyData: FantasyData = {
  balance: 5000,
  totalPoints: 7845,
  rank: 1245,
  contests: {
    upcoming: 3,
    live: 1,
    completed: 12,
    totalWinnings: 3500,
  },
  teams: [
    {
      id: 1,
      name: "Super Strikers",
      points: 234,
      rank: 56,
      nextMatch: "CSK vs RCB",
      contestName: "IPL Mega Contest",
    },
    {
      id: 2,
      name: "Royal Challengers",
      points: 198,
      rank: 123,
      nextMatch: "MI vs KKR",
      contestName: "T20 World Cup Special",
    },
    {
      id: 3,
      name: "Thunder Bolts",
      points: 345,
      rank: 12,
      nextMatch: "IND vs AUS",
      contestName: "India Tour of Australia",
    },
  ],
  recentResults: [
    {
      contestId: 1,
      contestName: "IPL Daily",
      teamName: "Super Strikers",
      rank: 23,
      points: 387,
      winnings: 500,
      date: "2025-04-15",
    },
    {
      contestId: 2,
      contestName: "T20 Special",
      teamName: "Royal Challengers",
      rank: 156,
      points: 276,
      winnings: 0,
      date: "2025-04-10",
    },
    {
      contestId: 3,
      contestName: "Test Match Glory",
      teamName: "Thunder Bolts",
      rank: 5,
      points: 490,
      winnings: 1000,
      date: "2025-04-05",
    },
  ],
  achievements: [
    {
      id: 1,
      name: "Contest Winner",
      description: "Won a fantasy contest",
      achieved: true,
      date: "2025-03-20",
    },
    {
      id: 2,
      name: "Top 100",
      description: "Ranked in top 100 players",
      achieved: true,
      date: "2025-03-15",
    },
    {
      id: 3,
      name: "Perfect XI",
      description: "Selected the perfect team",
      achieved: false,
      progress: 80,
    },
    {
      id: 4,
      name: "Cricket Guru",
      description: "Participated in 50 contests",
      achieved: false,
      progress: 30,
    },
  ],
  favoriteTeams: [
    "India",
    "Royal Challengers Bangalore",
    "Chennai Super Kings",
  ],
  favoritePlayers: ["Virat Kohli", "MS Dhoni", "Jasprit Bumrah"],
};

const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("Dashboard");
  const [fantasyData, setFantasyData] = useState(mockFantasyData);

  // Add state for teams
  const [teams, setTeams] = useState<TeamWithDetails[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [teamsError, setTeamsError] = useState<string | null>(null);

  // Add state for admin status
  const [isAdmin, setIsAdmin] = useState(false);

  // Add state for Play button
  const [activePlayTeamId, setActivePlayTeamId] = useState<
    string | number | null
  >(null);
  const [showPlayDialog, setShowPlayDialog] = useState(false);
  // Fetch teams when user loads
  useEffect(() => {
    if (user) {
      fetchUserTeams();
      checkAdminStatus();
    }
  }, [user]);

  // Check if the user is an admin
  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(Boolean(profileData?.is_admin));
      }
    } catch (err) {
      console.error("Unexpected error checking admin status:", err);
      setIsAdmin(false);
    }
  };

  // Fetch user's teams from Supabase
  const fetchUserTeams = async () => {
    if (!user) return;

    setIsLoadingTeams(true);
    setTeamsError(null);

    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("user_id", user.id) // Explicitly filter teams by the current user's ID
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching teams:", error);
        setTeamsError("Failed to load teams. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load your teams",
          variant: "destructive",
        });
      } else {
        // Add additional details to each team
        const teamsWithDetails = data.map((team) => {
          const matchDetails = team.match_details as any;
          return {
            ...team,
            // Use team_name for display
            name: team.team_name,
            // Format match display name from match_details if available
            nextMatch:
              matchDetails?.matchName ||
              (matchDetails?.teams
                ? `${matchDetails.teams.home?.name || "TBD"} vs ${
                    matchDetails.teams.away?.name || "TBD"
                  }`
                : "Unknown Match"),
            // Use match tournament name or default to "Fantasy Contest"
            contestName: matchDetails?.tournament?.name || "Fantasy Contest",
            // Default rank and points if not available
            rank: Math.floor(Math.random() * 200) + 1, // Mock rank for now
            points: team.total_points || 0,
          };
        });

        setTeams(teamsWithDetails);

        // Also update the teams in fantasyData for dashboard display
        // Convert to the format expected by fantasyData
        const compatibleTeams = teamsWithDetails.map((team) => ({
          id: team.id,
          name: team.team_name || team.name || "Unnamed Team",
          points: team.points || Number(team.total_points) || 0,
          rank: team.rank || 100,
          nextMatch: team.nextMatch || "No upcoming match",
          contestName: team.contestName || "Fantasy Contest",
        }));

        setFantasyData((prev) => ({
          ...prev,
          teams: compatibleTeams,
        }));
      }
    } catch (err) {
      console.error("Unexpected error fetching teams:", err);
      setTeamsError("An unexpected error occurred. Please try again later.");
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTeams(false);
    }
  };

  // If not authenticated, redirect to the landing page
  if (!loading && !user) {
    return <Navigate to="/" replace />;
  }

  // Function to get initials from name or email
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get display name or email
  const displayName = user?.user_metadata?.full_name || user?.email || "User";
  const initials = getInitials(displayName);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse text-neon-green text-xl">
            Loading profile...
          </div>
        </div>
      </PageContainer>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true }); // Redirect to landing page after logout
  };

  return (
    <>
      <PageContainer>
        <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl p-6 mt-2 mb-6">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green/30 to-blue-600/30 rounded-xl blur-sm opacity-75"></div>

          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 ring-2 ring-neon-green/50 ring-offset-2 ring-offset-gray-950">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="text-2xl bg-neon-green text-gray-950 font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <p className="text-gray-400">{user?.email}</p>

              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                <Badge
                  variant="outline"
                  className="bg-neon-green/10 text-neon-green border-neon-green/20"
                >
                  Level 12
                </Badge>
                {fantasyData.rank <= 100 && (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/20">
                    Top 100
                  </Badge>
                )}
                {fantasyData.achievements.some((a) => a.achieved) && (
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/20">
                    <Trophy className="h-3 w-3 mr-1" /> Achievement Unlocked
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="Dashboard"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="Dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="My Teams">My Teams</TabsTrigger>
            <TabsTrigger value="History">History</TabsTrigger>
            <TabsTrigger value="Achievements">Achievements</TabsTrigger>
            <TabsTrigger value="Account">Account</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6 space-y-6">
          {activeTab === "Dashboard" && (
            <div className="space-y-6">
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-900/60 border-gray-800 hover:border-neon-green/50 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-neon-green" />
                      Total Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      {fantasyData.totalPoints}
                    </div>
                    <p className="text-sm text-gray-400">
                      Current Rank: #{fantasyData.rank}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/60 border-gray-800 hover:border-neon-green/50 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-neon-green" />
                      Active Contests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      {fantasyData.contests.live}
                    </div>
                    <p className="text-sm text-gray-400">
                      {fantasyData.contests.upcoming} upcoming
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/60 border-gray-800 hover:border-neon-green/50 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Award className="h-5 w-5 mr-2 text-neon-green" />
                      Winnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      <img
                        src="/solana.png"
                        alt="USDC"
                        className="w-4 h-4 mr-1 inline-block"
                      />
                      {fantasyData.contests.totalWinnings} USDC
                    </div>
                    <p className="text-sm text-gray-400">
                      {fantasyData.contests.completed} contests played
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick actions */}
              <Card className="bg-gradient-to-r from-gray-900 to-gray-950 border-gray-800">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/contests">
                    <Button className="w-full bg-neon-green text-gray-900 hover:bg-neon-green/90">
                      <Trophy className="h-4 w-4 mr-2" />
                      Join Contest
                    </Button>
                  </Link>
                  <Link to="/teams/create">
                    <Button
                      variant="outline"
                      className="w-full border-neon-green/50 text-neon-green hover:bg-neon-green/10"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Create Team
                    </Button>
                  </Link>
                  <Link to="/matches">
                    <Button variant="outline" className="w-full">
                      <Zap className="h-4 w-4 mr-2" />
                      Live Matches
                    </Button>
                  </Link>
                  <Link to="/wallet">
                    <Button variant="outline" className="w-full">
                      <Wallet className="h-4 w-4 mr-2" />
                      Wallet
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Upcoming matches with your teams */}
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader>
                  <CardTitle>Your Teams in Action</CardTitle>
                  <CardDescription>
                    Upcoming matches where you have teams
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fantasyData.teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all"
                    >
                      <div>
                        <p className="font-medium">{team.name}</p>
                        <p className="text-sm text-gray-400">
                          {team.nextMatch}
                        </p>
                        <p className="text-xs text-neon-green">
                          {team.contestName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          Rank: <span className="font-bold">#{team.rank}</span>
                        </p>
                        <p className="text-sm">
                          Points:{" "}
                          <span className="font-bold">{team.points}</span>
                        </p>
                        <Link to={`/teams/${team.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 text-neon-green"
                          >
                            View Team
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "My Teams" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Your Fantasy Teams</h2>
                <Link to="/teams/create">
                  <Button className="bg-neon-green text-gray-900 hover:bg-neon-green/90">
                    Create New Team
                  </Button>
                </Link>
              </div>

              {isLoadingTeams ? (
                <div className="flex justify-center items-center py-12">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-10 w-10 text-neon-green animate-spin mb-4" />
                    <p className="text-gray-400">Loading your teams...</p>
                  </div>
                </div>
              ) : teamsError ? (
                <div className="bg-gray-900/60 border border-red-800/30 rounded-lg p-6 text-center">
                  <p className="text-red-400 mb-2">{teamsError}</p>
                  <Button
                    variant="outline"
                    onClick={fetchUserTeams}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              ) : teams.length === 0 ? (
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-10 text-center">
                  <div className="h-16 w-16 bg-gray-800/80 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    No Teams Created Yet
                  </h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    You haven&apos;t created any fantasy teams yet. Create a
                    team to participate in contests and win prizes!
                  </p>
                  <Link to="/teams/create">
                    <Button className="bg-neon-green text-gray-900 hover:bg-neon-green/90">
                      <Plus className="h-4 w-4 mr-2" /> Create Your First Team
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams.map((team) => (
                    <Card
                      key={team.id}
                      className="bg-gray-900/60 border-gray-800 hover:border-neon-green/20 transition-all"
                    >
                      <CardHeader className="pb-2 border-b border-gray-800">
                        <div className="flex justify-between items-center">
                          <CardTitle>{team.team_name || team.name}</CardTitle>
                          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                            Rank #{team.rank || "—"}
                          </Badge>
                        </div>
                        <CardDescription>{team.nextMatch}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm text-gray-400">Contest</p>
                          <p className="font-medium">{team.contestName}</p>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm text-gray-400">Points</p>
                          <p className="font-medium">
                            {team.points || team.total_points || 0}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm text-gray-400">Created</p>
                          <p className="text-sm">
                            {new Date(team.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Link to={`/teams/${team.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              View Team
                            </Button>
                          </Link>
                          <Link
                            to={`/teams/${team.id}/edit`}
                            className="flex-1"
                          >
                            <Button className="w-full bg-neon-green text-gray-900 hover:bg-neon-green/90">
                              Edit Team
                            </Button>
                          </Link>
                        </div>
                        <Button
                          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                          onClick={() => {
                            setActivePlayTeamId(team.id);
                            setShowPlayDialog(true);
                          }}
                        >
                          Play Contest
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "History" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Contest History</h2>

              <div className="space-y-4">
                {fantasyData.recentResults.map((result, index) => (
                  <Card key={index} className="bg-gray-900/60 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <p className="font-semibold text-lg">
                            {result.contestName}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(result.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm mt-1">
                            Team:{" "}
                            <span className="font-medium">
                              {result.teamName}
                            </span>
                          </p>
                        </div>

                        <div className="mt-3 md:mt-0 flex flex-col items-start md:items-end">
                          <div className="flex items-center">
                            <p className="text-sm text-gray-400 mr-2">Rank:</p>
                            <Badge
                              className={
                                result.rank <= 100
                                  ? "bg-neon-green/20 text-neon-green"
                                  : "bg-gray-700/50 text-gray-300"
                              }
                            >
                              #{result.rank}
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1">
                            <p className="text-sm text-gray-400 mr-2">
                              Points:
                            </p>
                            <span className="font-semibold">
                              {result.points}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <p className="text-sm text-gray-400 mr-2">
                              Winnings:
                            </p>
                            <span
                              className={`font-semibold ${
                                result.winnings > 0
                                  ? "text-neon-green"
                                  : "text-gray-400"
                              }`}
                            >
                              {result.winnings > 0
                                ? `${result.winnings} USDC`
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link to={`/contests/${result.contestId}`}>
                          <Button variant="outline" size="sm">
                            View Contest Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-4">
                <Link to="/history">
                  <Button variant="outline">View Complete History</Button>
                </Link>
              </div>
            </div>
          )}

          {activeTab === "Achievements" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Your Achievements</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fantasyData.achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`border ${
                      achievement.achieved
                        ? "border-neon-green/30 bg-neon-green/5"
                        : "border-gray-800 bg-gray-900/60"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        {achievement.achieved ? (
                          <div className="h-10 w-10 rounded-full bg-neon-green/20 flex items-center justify-center mr-3">
                            <Trophy className="h-5 w-5 text-neon-green" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                            <Lock className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{achievement.name}</p>
                          <p className="text-sm text-gray-400">
                            {achievement.description}
                          </p>
                        </div>
                      </div>

                      {achievement.achieved ? (
                        <div className="mt-2 text-sm text-neon-green">
                          Achieved on{" "}
                          {new Date(achievement.date).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <Progress
                            value={achievement.progress}
                            className="h-2 bg-gray-800"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Account" && (
            <div className="space-y-6">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400">Full Name</label>
                    <p>{user?.user_metadata?.full_name || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Email</label>
                    <p>{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Username</label>
                    <p>{user?.user_metadata?.username || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">
                      Member Since
                    </label>
                    <p>
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader>
                  <CardTitle>Cricket Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400">
                      Favorite Teams
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {fantasyData.favoriteTeams.map((team, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gray-800"
                        >
                          {team}
                        </Badge>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-neon-green"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">
                      Favorite Players
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {fantasyData.favoritePlayers.map((player, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gray-800"
                        >
                          {player}
                        </Badge>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-neon-green"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link
                    to="/auth/reset-password"
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-800/50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-gray-400" />
                      <span>Change Password</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                  <Link
                    to="/notifications"
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-800/50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <span>Notification Settings</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                  <Link
                    to="/api-settings"
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-800/50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gray-400" />
                      <span>API Settings</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                </CardContent>
              </Card>{" "}
              <div className="flex flex-col mt-8">
                {" "}
                {isAdmin && (
                  <Button
                    variant="outline"
                    className="bg-transparent border-blue-500 text-blue-500 hover:bg-blue-500/10 mb-3"
                    onClick={() => navigate("/admin")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="bg-transparent border-red-500 text-red-500 hover:bg-red-500/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
      <Navbar />

      {/* Play Contest Dialog */}
      <Dialog open={showPlayDialog} onOpenChange={setShowPlayDialog}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl">Play Contest</DialogTitle>
            <DialogDescription>
              Pool 10.00 USDC to participate in this contest and win rewards.
            </DialogDescription>
          </DialogHeader>

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
              <span className="text-gray-400">Prize Pool:</span>
              <span className="text-neon-green font-bold">10,000 USDC</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlayDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
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
    </>
  );
};

export default Profile;
