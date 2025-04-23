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
} from "lucide-react";
import Header from "@/components/layout/Header";
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
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data - In a real app, this would come from an API
const mockFantasyData = {
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
        <Header title="Profile" />

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

            <div className="mt-4 md:mt-0 md:ml-auto flex flex-col md:flex-row items-center gap-3">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardContent className="p-3 flex items-center">
                  <Wallet className="h-5 w-5 mr-2 text-neon-green" />
                  <div>
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="font-bold text-neon-green">
                      ₹{fantasyData.balance}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Link to="/wallet">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neon-green/50 text-neon-green hover:bg-neon-green/10"
                >
                  Add Money
                </Button>
              </Link>
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
                      ₹{fantasyData.contests.totalWinnings}
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
                  <Link to="/create-team">
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
                        <Link to={`/team/${team.id}`}>
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
                <Link to="/create-team">
                  <Button className="bg-neon-green text-gray-900 hover:bg-neon-green/90">
                    Create New Team
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fantasyData.teams.map((team) => (
                  <Card
                    key={team.id}
                    className="bg-gray-900/60 border-gray-800 hover:border-neon-green/20 transition-all"
                  >
                    <CardHeader className="pb-2 border-b border-gray-800">
                      <div className="flex justify-between items-center">
                        <CardTitle>{team.name}</CardTitle>
                        <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                          Rank #{team.rank}
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
                        <p className="font-medium">{team.points}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link to={`/team/${team.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View Team
                          </Button>
                        </Link>
                        <Link to={`/team/${team.id}/edit`} className="flex-1">
                          <Button className="w-full bg-neon-green text-gray-900 hover:bg-neon-green/90">
                            Edit Team
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                                ? `₹${result.winnings}`
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
              </Card>

              <div className="flex flex-col mt-8">
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
    </>
  );
};

export default Profile;
