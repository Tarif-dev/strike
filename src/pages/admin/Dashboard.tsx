import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  Users,
  CalendarDays,
  BarChart3,
  Settings,
  Plus,
  Activity,
  Trophy,
  DollarSign,
  Clock,
  AlertCircle,
  PieChart,
  Database,
  PlayCircle,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PageContainer from "@/components/layout/PageContainer";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeMatches: 12,
    pendingMatches: 4,
    completedMatches: 8,
    totalTeams: 243,
    avgTeamsPerMatch: 20.3,
    usersOnline: 178,
  });

  // Upcoming matches data
  const upcomingMatches = [
    {
      id: 1,
      team1: "CSK",
      team2: "MI",
      date: "May 15, 2025",
      time: "7:30 PM",
      status: "active",
    },
    {
      id: 2,
      team1: "RCB",
      team2: "KKR",
      date: "May 12, 2025",
      time: "7:30 PM",
      status: "active",
    },
    {
      id: 3,
      team1: "DC",
      team2: "SRH",
      date: "May 10, 2025",
      time: "3:30 PM",
      status: "completed",
    },
  ];

  // Recent activity mock data
  const recentActivity = [
    {
      id: 1,
      action: "Match Updated",
      detail: "CSK vs MI game details changed",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "New Contest Created",
      detail: "Mega contest for RCB vs KKR",
      time: "5 hours ago",
    },
    {
      id: 3,
      action: "Player Status Updated",
      detail: "Virat Kohli marked as available",
      time: "1 day ago",
    },
  ];

  return (
    <PageContainer>
      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              | Manage your cricket fantasy platform
            </p>
          </div>

          {/* Refined Primary Actions */}
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Button
              variant="default"
              className="bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90 font-bold border-2 border-white shadow-md"
              onClick={() => navigate("/admin/create-match")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Match
            </Button>
            <Button
              variant="outline"
              className="border-2 border-cricket-lime text-cricket-lime hover:bg-cricket-dark-green/10 font-semibold"
              onClick={() => navigate("/admin/initialize-matches")}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Initialize Matches
            </Button>
          </div>
        </div>

        {/* Quick Actions Section - Refined styling */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-cricket-lime" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              className="bg-cricket-dark-green text-white hover:bg-cricket-dark-green/90 h-auto py-6 flex flex-col items-center justify-center shadow-md border-b-4 border-cricket-lime"
              onClick={() => navigate("/admin/manage-matches")}
            >
              <Settings className="h-7 w-7 mb-2" />
              <span>Match Management</span>
            </Button>
            <Button
              className="bg-cricket-dark-green text-white hover:bg-cricket-dark-green/90 h-auto py-6 flex flex-col items-center justify-center shadow-md border-b-4 border-cricket-medium-green"
              onClick={() => navigate("/players")}
            >
              <Users className="h-7 w-7 mb-2" />
              <span>Manage Players</span>
            </Button>
            <Button
              className="bg-cricket-dark-green text-white hover:bg-cricket-dark-green/90 h-auto py-6 flex flex-col items-center justify-center shadow-md border-b-4 border-cricket-medium-green"
              onClick={() => navigate("/admin/analytics")}
            >
              <BarChart3 className="h-7 w-7 mb-2" />
              <span>View Analytics</span>
            </Button>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-cricket-dark-green to-cricket-medium-green border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    Active Matches
                  </p>
                  <h3 className="text-3xl font-bold mt-1">
                    {stats.activeMatches}
                  </h3>
                </div>
                <div className="bg-cricket-lime/20 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-cricket-lime" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={75} className="h-1 bg-cricket-dark-green" />
                <p className="text-xs mt-2 text-gray-300">
                  <span className="text-cricket-lime">+12%</span> from last week
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cricket-dark-green to-cricket-medium-green border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    Total Teams
                  </p>
                  <h3 className="text-3xl font-bold mt-1">
                    {stats.totalTeams}
                  </h3>
                </div>
                <div className="bg-cricket-lime/20 p-3 rounded-full">
                  <Users className="h-6 w-6 text-cricket-lime" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={85} className="h-1 bg-cricket-dark-green" />
                <p className="text-xs mt-2 text-gray-300">
                  <span className="text-cricket-lime">+8%</span> from last week
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cricket-dark-green to-cricket-medium-green border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    Avg. Teams/Match
                  </p>
                  <h3 className="text-3xl font-bold mt-1">
                    {stats.avgTeamsPerMatch}
                  </h3>
                </div>
                <div className="bg-cricket-lime/20 p-3 rounded-full">
                  <PieChart className="h-6 w-6 text-cricket-lime" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={65} className="h-1 bg-cricket-dark-green" />
                <p className="text-xs mt-2 text-gray-300">
                  <span className="text-cricket-lime">+5%</span> from last week
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cricket-dark-green to-cricket-medium-green border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    Users Online
                  </p>
                  <h3 className="text-3xl font-bold mt-1">
                    {stats.usersOnline}
                  </h3>
                </div>
                <div className="bg-cricket-lime/20 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-cricket-lime" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={90} className="h-1 bg-cricket-dark-green" />
                <p className="text-xs mt-2 text-gray-300">
                  <span className="text-cricket-lime">+15%</span> from last week
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area with Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Match Management */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="upcoming" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-cricket-lime" />
                  Match Management
                </h2>
                <TabsList className="bg-cricket-dark-green/30">
                  <TabsTrigger
                    value="upcoming"
                    className="data-[state=active]:bg-cricket-lime data-[state=active]:text-cricket-dark-green"
                  >
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:bg-cricket-lime data-[state=active]:text-cricket-dark-green"
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="data-[state=active]:bg-cricket-lime data-[state=active]:text-cricket-dark-green"
                  >
                    Completed
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="upcoming" className="mt-0">
                <Card className="bg-cricket-medium-green/60 border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {upcomingMatches.map((match) => (
                        <div
                          key={match.id}
                          className="flex items-center justify-between p-4 bg-cricket-dark-green/40 rounded-lg hover:bg-cricket-dark-green/60 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex flex-col items-center justify-center w-14 h-14 bg-cricket-dark-green rounded-md shadow-inner">
                              <span className="font-bold">{match.team1}</span>
                              <span className="text-xs">vs</span>
                              <span className="font-bold">{match.team2}</span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {match.team1} vs {match.team2}
                              </p>
                              <div className="flex items-center text-sm text-gray-300 mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>
                                  {match.date}, {match.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                match.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                match.status === "active"
                                  ? "bg-green-500/80"
                                  : "bg-gray-500/80"
                              }
                            >
                              {match.status === "active"
                                ? "Active"
                                : "Completed"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-cricket-lime hover:text-white hover:bg-cricket-lime/20"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-center mt-6">
                        <Button
                          className="bg-cricket-dark-green hover:bg-cricket-dark-green/90 transition-all hover:shadow-md"
                          onClick={() => navigate("/admin/manage-matches")}
                        >
                          View All Matches
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="active" className="mt-0">
                <Card className="bg-cricket-medium-green/60 border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="min-h-[260px] flex flex-col items-center justify-center">
                      <div className="flex flex-col items-center justify-center text-center">
                        <DatabaseIcon className="h-12 w-12 text-cricket-lime opacity-50 mb-3" />
                        <h3 className="text-lg font-medium mb-1">
                          Active Matches
                        </h3>
                        <p className="text-muted-foreground max-w-sm">
                          Currently {stats.activeMatches} matches in progress.
                          Click below to manage them.
                        </p>
                        <Button
                          className="mt-6 bg-cricket-dark-green hover:bg-cricket-dark-green/90 transition-all hover:shadow-md"
                          onClick={() => navigate("/admin/manage-matches")}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Manage Active Matches
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                <Card className="bg-cricket-medium-green/60 border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="min-h-[260px] flex flex-col items-center justify-center">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Trophy className="h-12 w-12 text-cricket-lime opacity-50 mb-3" />
                        <h3 className="text-lg font-medium mb-1">
                          Completed Matches
                        </h3>
                        <p className="text-muted-foreground max-w-sm">
                          {stats.completedMatches} matches have been completed.
                          View results and analytics.
                        </p>
                        <Button
                          className="mt-6 bg-cricket-dark-green hover:bg-cricket-dark-green/90 transition-all hover:shadow-md"
                          onClick={() => navigate("/admin/manage-matches")}
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Match Results
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Activity & Alerts */}
          <div>
            <Card className="bg-cricket-medium-green/60 border-none shadow-md hover:shadow-lg transition-shadow mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-cricket-lime" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest admin actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-2 hover:bg-cricket-dark-green/20 rounded-md transition-colors"
                    >
                      <div className="bg-cricket-lime/20 p-1.5 rounded-full">
                        <Clock className="h-4 w-4 text-cricket-lime" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.detail}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-cricket-lime hover:bg-cricket-dark-green/20"
                >
                  View All Activity
                </Button>
              </CardFooter>
            </Card>

            {/* Status & Alerts Card */}
            <Card className="bg-cricket-medium-green/60 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-cricket-lime" />
                  System Status
                </CardTitle>
                <CardDescription>Platform health and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">API Connection</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-500/20 text-green-300 border-green-500/50"
                    >
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Database</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-500/20 text-green-300 border-green-500/50"
                    >
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">Fantasy Points System</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
                    >
                      Warning
                    </Badge>
                  </div>

                  <Separator className="my-2 bg-cricket-dark-green/50" />

                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-300">
                          Fantasy Points Calculation Alert
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Some points may need manual verification for RCB vs
                          KKR match.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

// Helper component for the database icon
const DatabaseIcon = Database;

export default AdminDashboard;
