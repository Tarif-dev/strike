import React, { useState } from "react";
import {
  Search,
  Trophy,
  Users,
  Calendar,
  Filter,
  ChevronRight,
  Star,
  Plus,
  Star as StarIcon,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import { leagues } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Leagues = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter leagues based on search and active tab
  const filteredLeagues = leagues.filter((league) => {
    const matchesSearch = league.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (activeTab === "joined") return matchesSearch && league.joined;
    if (activeTab === "upcoming") return matchesSearch && !league.joined;
    return matchesSearch;
  });

  const myLeagues = leagues.filter((league) => league.joined);
  const upcomingLeagues = leagues.filter((league) => !league.joined);

  // League categories for featured section
  const featuredLeagues = [
    {
      id: "featured-1",
      title: "IPL Mega League",
      prize: "₹10,000,000",
      image:
        "https://img.freepik.com/premium-vector/cricket-championship-tournament-poster-design_1302-11533.jpg",
      participants: 50000,
      endDate: "May 30, 2023",
      isHot: true,
    },
    {
      id: "featured-2",
      title: "T20 World Cup Fantasy",
      prize: "₹5,000,000",
      image:
        "https://img.freepik.com/free-vector/abstract-cricket-tournament-sports-background_1017-19934.jpg",
      participants: 35000,
      endDate: "June 15, 2023",
    },
  ];

  return (
    <>
      <PageContainer>
        <div className="pb-16">
          {" "}
          {/* Add padding at the bottom for the navbar */}
          {/* Hero section with featured leagues */}
          <div className="relative overflow-hidden rounded-xl mb-6">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green/30 to-blue-600/30 rounded-xl blur-sm opacity-75"></div>

            <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl overflow-hidden">
              <div className="px-4 py-6">
                <h1 className="text-2xl font-bold mb-2 flex items-center">
                  <Trophy className="h-6 w-6 mr-2 text-neon-green" />
                  Fantasy Leagues
                </h1>
                <p className="text-gray-400 mb-4">
                  Join leagues and compete with players worldwide
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search leagues..."
                      className="pl-10 bg-gray-800/60 border-gray-700"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Featured leagues slider */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-400" />
                Featured Leagues
              </h2>
              <Button variant="ghost" size="sm" className="text-neon-green">
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredLeagues.map((league) => (
                <div
                  key={league.id}
                  className="relative overflow-hidden rounded-xl group cursor-pointer bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 hover:border-neon-green/50 transition-all"
                >
                  {league.isHot && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-red-500">HOT</Badge>
                    </div>
                  )}

                  <div className="absolute inset-0 opacity-30">
                    <img
                      src={league.image}
                      alt={league.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <h3 className="text-xl font-bold mb-2">{league.title}</h3>
                    <div className="flex items-center mb-4">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-300">
                        {league.participants.toLocaleString()} participants
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-400">
                          Ends on {league.endDate}
                        </span>
                        <span className="text-neon-green font-bold">
                          {league.prize}
                        </span>
                      </div>

                      <Button className="w-full bg-neon-green hover:bg-neon-green/90 text-gray-900">
                        Join League
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Tabs for leagues */}
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">All Leagues</TabsTrigger>
              <TabsTrigger value="joined">My Leagues</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 space-y-4">
              {filteredLeagues.length > 0 ? (
                filteredLeagues.map((league) => (
                  <LeagueCardModern key={league.id} league={league} />
                ))
              ) : (
                <div className="text-center py-10">
                  <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No leagues found</h3>
                  <p className="text-gray-400">Try a different search term</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="joined" className="mt-4 space-y-4">
              {myLeagues.length > 0 && searchQuery === "" ? (
                myLeagues.map((league) => (
                  <LeagueCardModern key={league.id} league={league} />
                ))
              ) : searchQuery !== "" &&
                filteredLeagues.some((l) => l.joined) ? (
                filteredLeagues
                  .filter((l) => l.joined)
                  .map((league) => (
                    <LeagueCardModern key={league.id} league={league} />
                  ))
              ) : (
                <div className="text-center py-10">
                  <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">
                    No joined leagues
                  </h3>
                  <p className="text-gray-400">Join a league to see it here</p>
                  <Button className="mt-4 bg-neon-green text-gray-900 hover:bg-neon-green/90">
                    Browse Leagues
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-4 space-y-4">
              {upcomingLeagues.length > 0 && searchQuery === "" ? (
                upcomingLeagues.map((league) => (
                  <LeagueCardModern key={league.id} league={league} />
                ))
              ) : searchQuery !== "" &&
                filteredLeagues.some((l) => !l.joined) ? (
                filteredLeagues
                  .filter((l) => !l.joined)
                  .map((league) => (
                    <LeagueCardModern key={league.id} league={league} />
                  ))
              ) : (
                <div className="text-center py-10">
                  <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">
                    No upcoming leagues found
                  </h3>
                  <p className="text-gray-400">
                    Check back later for new leagues
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          {/* League categories */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {["IPL", "World Cup", "T20", "Test Matches"].map(
                (category, idx) => (
                  <Link
                    key={idx}
                    to={`/leagues/category/${category
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    <div className="bg-gray-900/60 hover:bg-gray-800/80 transition-all border border-gray-800 rounded-xl p-4 text-center">
                      <div className="h-12 w-12 mx-auto mb-3 rounded-full bg-gray-800 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-neon-green" />
                      </div>
                      <h3 className="font-medium">{category}</h3>
                      <p className="text-xs text-gray-400 mt-1">Leagues</p>
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
          {/* Create your own league CTA */}
          <Card className="bg-gradient-to-r from-neon-green/10 to-blue-600/10 border border-neon-green/20 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold mb-2 flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-neon-green" />
                    Create Your Own League
                  </h3>
                  <p className="text-gray-300">
                    Invite friends and compete in private leagues
                  </p>
                </div>
                <Button className="bg-neon-green hover:bg-neon-green/90 text-gray-900">
                  Create League
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

// Modern league card component
const LeagueCardModern = ({ league }: { league: any }) => {
  const startDate = new Date(league.startDate);
  const endDate = new Date(league.endDate);
  const today = new Date();

  // Calculate percentage of league completed
  const totalDays =
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
  const daysElapsed =
    (today.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
  const percentComplete = Math.min(
    100,
    Math.max(0, (daysElapsed / totalDays) * 100)
  );

  // Random icon for league (in a real app, this would come from the league data)
  const leagueIcon = league.id.includes("2") ? (
    <Avatar className="h-10 w-10 border-2 border-yellow-500">
      <AvatarImage src="https://img.freepik.com/free-vector/cricket-championship-tournament-poster_1017-21513.jpg" />
      <AvatarFallback className="bg-yellow-600/20">WC</AvatarFallback>
    </Avatar>
  ) : (
    <Avatar className="h-10 w-10 border-2 border-neon-green">
      <AvatarImage src="https://img.freepik.com/free-vector/abstract-cricket-tournament-sports-background_1017-19934.jpg" />
      <AvatarFallback className="bg-neon-green/20">IPL</AvatarFallback>
    </Avatar>
  );

  const isActive = startDate <= today && today <= endDate;

  return (
    <Link to={`/leagues/${league.id}`}>
      <Card
        className={`transition-all hover:border-neon-green/50 ${
          league.joined
            ? "bg-gradient-to-r from-neon-green/5 to-transparent"
            : "bg-gray-900/60"
        } border-gray-800`}
      >
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Left section with icon/image */}
            <div className="p-4 flex items-center justify-center md:border-r border-gray-800 md:w-24">
              <div className="relative">
                {leagueIcon}
                {league.joined && (
                  <div className="absolute -top-1 -right-1 bg-neon-green rounded-full p-0.5">
                    <StarIcon className="h-3 w-3 text-gray-900" />
                  </div>
                )}
              </div>
            </div>

            {/* Middle section with league info */}
            <div className="p-4 flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-bold text-lg">{league.name}</h3>
                    {isActive && (
                      <Badge
                        variant="outline"
                        className="ml-2 bg-neon-green/10 text-neon-green border-neon-green/20"
                      >
                        Active
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center text-sm text-gray-400">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      <span>{league.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>
                        {league.startDate} - {league.endDate}
                      </span>
                    </div>
                  </div>
                </div>

                {league.prize && (
                  <div className="mt-2 md:mt-0 bg-gray-800/80 rounded-lg px-3 py-1.5">
                    <span className="text-xs text-gray-400">Prize Pool</span>
                    <p className="text-neon-green font-bold">{league.prize}</p>
                  </div>
                )}
              </div>

              {/* Progress bar for league timeline */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>
                    {isActive
                      ? "In Progress"
                      : startDate > today
                      ? "Starting Soon"
                      : "Completed"}
                  </span>
                  <span>{Math.round(percentComplete)}% Complete</span>
                </div>
                <Progress value={percentComplete} className="h-1.5" />
              </div>

              {/* Show user's position if they've joined this league */}
              {league.joined && league.position && (
                <div className="mt-4 pt-4 border-t border-gray-800/80 grid grid-cols-2">
                  <div>
                    <span className="text-xs text-gray-400">Your Position</span>
                    <p className="font-bold text-neon-green">
                      #{league.position}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Your Points</span>
                    <p className="font-bold">{league.userPoints}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right section with CTA button */}
            <div className="p-4 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-gray-800 md:w-32">
              {league.joined ? (
                <Button
                  variant="outline"
                  className="w-full md:w-auto flex items-center gap-1 border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                >
                  <span>View</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button className="w-full md:w-auto bg-neon-green text-gray-900 hover:bg-neon-green/90">
                  Join
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Leagues;
