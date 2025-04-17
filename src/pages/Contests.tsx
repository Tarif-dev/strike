import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Trophy,
  Users,
  Wallet,
  ArrowRight,
  Filter,
  Search,
  ChevronDown,
  Clock,
  Info,
  Zap,
  Shield,
  DollarSign,
  BarChart3,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Mock data for contests
const contestTypes = [
  {
    id: "mega",
    name: "Mega Contests",
    icon: <Trophy className="h-4 w-4 text-neon-green" />,
  },
  {
    id: "head-to-head",
    name: "Head-to-Head",
    icon: <Users className="h-4 w-4 text-blue-400" />,
  },
  {
    id: "practice",
    name: "Practice",
    icon: <BarChart3 className="h-4 w-4 text-amber-400" />,
  },
  {
    id: "private",
    name: "Private",
    icon: <Shield className="h-4 w-4 text-purple-400" />,
  },
  {
    id: "winner-takes-all",
    name: "Winner Takes All",
    icon: <Wallet className="h-4 w-4 text-green-400" />,
  },
];

const entrySortOptions = [
  { value: "low-to-high", label: "Entry: Low to High" },
  { value: "high-to-low", label: "Entry: High to Low" },
  { value: "prize-high", label: "Prize: High to Low" },
  { value: "spots-filling", label: "Filling Fast" },
];

// Mock contest data
const mockContests = [
  {
    id: "contest1",
    type: "mega",
    name: "IPL Championship League",
    totalPrize: "₹10 Crore",
    entryFee: 49,
    totalSpots: 2500000,
    filledSpots: 1248692,
    firstPrize: "₹1 Crore",
    winnerPercentage: 45,
    guaranteedPrize: true,
    multipleEntries: true,
    isPopular: true,
    prizeBreakdown: [
      { position: "1st", prize: "₹1 Crore" },
      { position: "2nd", prize: "₹50 Lakh" },
      { position: "3rd", prize: "₹25 Lakh" },
      { position: "4th-10th", prize: "₹10 Lakh" },
      { position: "11th-100th", prize: "₹1 Lakh" },
      { position: "101st-1000th", prize: "₹10,000" },
      { position: "1001st-10000th", prize: "₹1,000" },
      { position: "10001st-100000th", prize: "₹500" },
      { position: "100001st-500000th", prize: "₹100" },
    ],
  },
  {
    id: "contest2",
    type: "mega",
    name: "Big Cash League",
    totalPrize: "₹5 Crore",
    entryFee: 999,
    totalSpots: 500000,
    filledSpots: 352487,
    firstPrize: "₹50 Lakh",
    winnerPercentage: 30,
    guaranteedPrize: true,
    multipleEntries: true,
    isPopular: true,
    prizeBreakdown: [
      { position: "1st", prize: "₹50 Lakh" },
      { position: "2nd", prize: "₹25 Lakh" },
      { position: "3rd", prize: "₹15 Lakh" },
      { position: "4th-10th", prize: "₹5 Lakh" },
      { position: "11th-100th", prize: "₹50,000" },
      { position: "101st-1000th", prize: "₹5,000" },
      { position: "1001st-10000th", prize: "₹500" },
    ],
  },
  {
    id: "contest3",
    type: "mega",
    name: "Cricket Mania",
    totalPrize: "₹2 Crore",
    entryFee: 199,
    totalSpots: 1000000,
    filledSpots: 398547,
    firstPrize: "₹25 Lakh",
    winnerPercentage: 35,
    guaranteedPrize: true,
    multipleEntries: false,
    isPopular: false,
    prizeBreakdown: [
      { position: "1st", prize: "₹25 Lakh" },
      { position: "2nd", prize: "₹15 Lakh" },
      { position: "3rd", prize: "₹10 Lakh" },
      { position: "4th-10th", prize: "₹2 Lakh" },
      { position: "11th-100th", prize: "₹20,000" },
      { position: "101st-1000th", prize: "₹2,000" },
      { position: "1001st-10000th", prize: "₹200" },
    ],
  },
  {
    id: "contest4",
    type: "head-to-head",
    name: "1-on-1 Battle",
    totalPrize: "₹99",
    entryFee: 49,
    totalSpots: 2,
    filledSpots: 1,
    firstPrize: "₹99",
    winnerPercentage: 50,
    guaranteedPrize: true,
    multipleEntries: false,
    isPopular: false,
  },
  {
    id: "contest5",
    type: "head-to-head",
    name: "1-on-1 Battle",
    totalPrize: "₹199",
    entryFee: 99,
    totalSpots: 2,
    filledSpots: 0,
    firstPrize: "₹199",
    winnerPercentage: 50,
    guaranteedPrize: true,
    multipleEntries: false,
    isPopular: false,
  },
  {
    id: "contest6",
    type: "private",
    name: "Friends League",
    totalPrize: "₹1,000",
    entryFee: 100,
    totalSpots: 10,
    filledSpots: 5,
    firstPrize: "₹500",
    winnerPercentage: 50,
    guaranteedPrize: true,
    multipleEntries: false,
    isPopular: false,
    isPrivate: true,
    createdBy: "User123",
  },
  {
    id: "contest7",
    type: "winner-takes-all",
    name: "All or Nothing",
    totalPrize: "₹10,000",
    entryFee: 100,
    totalSpots: 100,
    filledSpots: 67,
    firstPrize: "₹10,000",
    winnerPercentage: 1,
    guaranteedPrize: true,
    multipleEntries: false,
    isPopular: false,
  },
  {
    id: "contest8",
    type: "practice",
    name: "Free Practice",
    totalPrize: "₹0",
    entryFee: 0,
    totalSpots: 5000,
    filledSpots: 2485,
    firstPrize: "-",
    winnerPercentage: 0,
    guaranteedPrize: false,
    multipleEntries: false,
    isPopular: false,
    isPractice: true,
  },
];

const Contests = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("low-to-high");
  const [activeContestType, setActiveContestType] = useState<string | null>(
    null
  );
  const [showPrizeBreakdown, setShowPrizeBreakdown] = useState<string | null>(
    null
  );
  const [showJoinContest, setShowJoinContest] = useState<string | null>(null);

  // Example match data (in a real app, this would come from API)
  const matchData = {
    id: matchId || "match123",
    teams: {
      home: { name: "Mumbai Indians", code: "MI", logo: "/mi-logo.png" },
      away: { name: "Chennai Super Kings", code: "CSK", logo: "/csk-logo.png" },
    },
    startTime: "2025-04-18T19:30:00",
    venue: "Wankhede Stadium, Mumbai",
    tournament: { name: "IPL 2025", shortName: "IPL" },
  };

  // Filter contests based on active filters
  const filteredContests = mockContests
    .filter((contest) => {
      // Filter by type
      if (selectedTab !== "all" && contest.type !== selectedTab) {
        return false;
      }

      // Filter by search query
      if (
        searchQuery &&
        !contest.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort based on selected option
      switch (selectedSort) {
        case "low-to-high":
          return a.entryFee - b.entryFee;
        case "high-to-low":
          return b.entryFee - a.entryFee;
        case "prize-high":
          return (
            parseFloat(b.totalPrize.replace(/[^\d.]/g, "")) -
            parseFloat(a.totalPrize.replace(/[^\d.]/g, ""))
          );
        case "spots-filling":
          return b.filledSpots / b.totalSpots - a.filledSpots / a.totalSpots;
        default:
          return 0;
      }
    });

  // Calculate time until match
  const matchDate = new Date(matchData.startTime);
  const now = new Date();
  const timeUntilMatch = matchDate.getTime() - now.getTime();
  const hoursUntilMatch = Math.floor(timeUntilMatch / (1000 * 60 * 60));
  let timeDisplay = "";

  if (hoursUntilMatch < 24) {
    timeDisplay = `${hoursUntilMatch}h left`;
  } else {
    const daysLeft = Math.floor(hoursUntilMatch / 24);
    timeDisplay = `${daysLeft}d left`;
  }

  return (
    <>
      <PageContainer>
        <Header
          title={`Contests: ${matchData.teams.home.code} vs ${matchData.teams.away.code}`}
          showBackButton
        />

        <div className="mt-4 space-y-6">
          {/* Match info card */}
          <Card className="bg-gray-900/60 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center mr-2">
                      <img
                        src={matchData.teams.home.logo}
                        alt={matchData.teams.home.name}
                        className="h-7 w-7"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <span className="font-medium">vs</span>
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center ml-2">
                      <img
                        src={matchData.teams.away.logo}
                        alt={matchData.teams.away.name}
                        className="h-7 w-7"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">
                      {matchData.tournament.name}
                    </div>
                    <div className="text-sm">{matchData.venue}</div>
                  </div>
                </div>
                <div className="text-xs bg-gray-800 py-1 px-3 rounded-full flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-neon-green" />
                  <span>{timeDisplay}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contest type selection */}
          <div className="flex overflow-x-auto hide-scrollbar py-2 gap-2">
            {contestTypes.map((type) => (
              <Button
                key={type.id}
                variant={activeContestType === type.id ? "default" : "outline"}
                className={`flex items-center whitespace-nowrap ${
                  activeContestType === type.id
                    ? "bg-neon-green text-gray-900"
                    : "bg-gray-900/60 border-gray-800 hover:border-gray-700"
                }`}
                onClick={() => {
                  setActiveContestType(
                    type.id === activeContestType ? null : type.id
                  );
                  setSelectedTab(
                    type.id === activeContestType ? "all" : type.id
                  );
                }}
              >
                {type.icon}
                <span className="ml-2">{type.name}</span>
              </Button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contests..."
                className="pl-9 bg-gray-900/60 border-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="appearance-none bg-gray-900/60 border border-gray-800 rounded-md px-4 py-2 pr-8 text-sm"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                {entrySortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
            </div>
          </div>

          {/* Tabs for contest types */}
          <Tabs
            defaultValue="all"
            value={selectedTab}
            onValueChange={setSelectedTab}
          >
            <TabsList className="grid grid-cols-5 mb-4 bg-gray-900">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-neon-green data-[state=active]:text-gray-900"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="mega"
                className="data-[state=active]:bg-neon-green data-[state=active]:text-gray-900"
              >
                Mega
              </TabsTrigger>
              <TabsTrigger
                value="head-to-head"
                className="data-[state=active]:bg-neon-green data-[state=active]:text-gray-900"
              >
                H2H
              </TabsTrigger>
              <TabsTrigger
                value="practice"
                className="data-[state=active]:bg-neon-green data-[state=active]:text-gray-900"
              >
                Practice
              </TabsTrigger>
              <TabsTrigger
                value="more"
                className="data-[state=active]:bg-neon-green data-[state=active]:text-gray-900"
              >
                More
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredContests.length > 0 ? (
                filteredContests.map((contest) => (
                  <ContestCard
                    key={contest.id}
                    contest={contest}
                    onShowPrizeBreakdown={() =>
                      setShowPrizeBreakdown(contest.id)
                    }
                    onJoinContest={() => setShowJoinContest(contest.id)}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
                  <p className="text-lg font-medium mb-2">No contests found</p>
                  <p className="text-gray-400">
                    Try changing your filters or search query
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Other tab contents with same pattern */}
            {contestTypes.map((type) => (
              <TabsContent key={type.id} value={type.id} className="space-y-4">
                {filteredContests.length > 0 ? (
                  filteredContests.map((contest) => (
                    <ContestCard
                      key={contest.id}
                      contest={contest}
                      onShowPrizeBreakdown={() =>
                        setShowPrizeBreakdown(contest.id)
                      }
                      onJoinContest={() => setShowJoinContest(contest.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
                    <p className="text-lg font-medium mb-2">
                      No {type.name} contests found
                    </p>
                    <p className="text-gray-400">
                      Try changing your filters or search query
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}

            <TabsContent value="more" className="space-y-4">
              {filteredContests.filter(
                (c) => !["mega", "head-to-head", "practice"].includes(c.type)
              ).length > 0 ? (
                filteredContests
                  .filter(
                    (c) =>
                      !["mega", "head-to-head", "practice"].includes(c.type)
                  )
                  .map((contest) => (
                    <ContestCard
                      key={contest.id}
                      contest={contest}
                      onShowPrizeBreakdown={() =>
                        setShowPrizeBreakdown(contest.id)
                      }
                      onJoinContest={() => setShowJoinContest(contest.id)}
                    />
                  ))
              ) : (
                <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
                  <p className="text-lg font-medium mb-2">
                    No additional contests found
                  </p>
                  <p className="text-gray-400">Try another contest category</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Create a private contest */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 mt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-lg">Create Your Own Contest</h3>
                <p className="text-gray-400 text-sm">
                  Invite friends to a private contest and compete together
                </p>
              </div>
              <Button className="bg-neon-green text-gray-900 hover:bg-neon-green/90">
                Create Private Contest <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Prize breakdown dialog */}
        <Dialog
          open={!!showPrizeBreakdown}
          onOpenChange={() => setShowPrizeBreakdown(null)}
        >
          <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Prize Breakdown</DialogTitle>
              <DialogDescription>
                Prize distribution for this contest
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {showPrizeBreakdown &&
                mockContests
                  .find((c) => c.id === showPrizeBreakdown)
                  ?.prizeBreakdown?.map((prize, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0"
                    >
                      <span className="font-medium">{prize.position}</span>
                      <span className="text-neon-green">{prize.prize}</span>
                    </div>
                  ))}

              {showPrizeBreakdown &&
                !mockContests.find((c) => c.id === showPrizeBreakdown)
                  ?.prizeBreakdown && (
                  <div className="py-4 text-center text-gray-400">
                    Winner takes the entire prize pool
                  </div>
                )}
            </div>

            <DialogFooter className="mt-4">
              <Button onClick={() => setShowPrizeBreakdown(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Join contest dialog */}
        <Dialog
          open={!!showJoinContest}
          onOpenChange={() => setShowJoinContest(null)}
        >
          <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Join Contest</DialogTitle>
              <DialogDescription>
                Select teams to join this contest
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <p className="text-sm text-gray-400">
                {showJoinContest &&
                mockContests.find((c) => c.id === showJoinContest)
                  ?.multipleEntries
                  ? "You can join this contest with multiple teams"
                  : "You can join this contest with one team"}
              </p>

              <div className="space-y-2">
                <div className="p-3 bg-gray-800/80 rounded-lg border border-gray-700 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      <span className="font-bold text-neon-green">T1</span>
                    </div>
                    <div>
                      <p className="font-medium">Team Strike</p>
                      <p className="text-xs text-gray-400">Created 2h ago</p>
                    </div>
                  </div>
                  <div className="h-5 w-5 rounded-full border border-neon-green flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-neon-green"></div>
                  </div>
                </div>

                <Link to="/teams/create" className="block">
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-800 hover:border-gray-700 flex items-center justify-center">
                    <span className="text-sm">+ Create New Team</span>
                  </div>
                </Link>
              </div>

              <Separator className="my-4" />

              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Amount to pay</span>
                  <span className="font-medium">
                    ₹
                    {(showJoinContest &&
                      mockContests.find((c) => c.id === showJoinContest)
                        ?.entryFee) ||
                      0}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Usable cash bonus
                  </span>
                  <span className="text-neon-green">₹0</span>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setShowJoinContest(null)}
              >
                Cancel
              </Button>
              <Button className="bg-neon-green text-gray-900 hover:bg-neon-green/90">
                Join Contest
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
      <Navbar />
    </>
  );
};

// Contest Card Component
interface ContestCardProps {
  contest: any;
  onShowPrizeBreakdown: () => void;
  onJoinContest: () => void;
}

const ContestCard: React.FC<ContestCardProps> = ({
  contest,
  onShowPrizeBreakdown,
  onJoinContest,
}) => {
  const filledPercentage = (contest.filledSpots / contest.totalSpots) * 100;
  const spotLeft = contest.totalSpots - contest.filledSpots;

  return (
    <Card className="bg-gray-900/60 border-gray-800 hover:border-gray-700 transition-all overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center">
            {contest.type === "mega" && (
              <Trophy className="h-4 w-4 text-neon-green mr-2" />
            )}
            {contest.type === "head-to-head" && (
              <Users className="h-4 w-4 text-blue-400 mr-2" />
            )}
            {contest.type === "practice" && (
              <BarChart3 className="h-4 w-4 text-amber-400 mr-2" />
            )}
            {contest.type === "private" && (
              <Shield className="h-4 w-4 text-purple-400 mr-2" />
            )}
            {contest.type === "winner-takes-all" && (
              <Wallet className="h-4 w-4 text-green-400 mr-2" />
            )}
            <h3 className="font-medium">{contest.name}</h3>
          </div>
          <div className="flex items-center">
            {contest.guaranteedPrize && (
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 mr-2">
                Guaranteed
              </Badge>
            )}
            {contest.isPopular && (
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Zap className="h-3 w-3 mr-1 fill-amber-400" /> Popular
              </Badge>
            )}
            {contest.isPractice && (
              <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Free
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-gray-400">Prize Pool</div>
              <div className="font-bold text-lg text-neon-green">
                {contest.totalPrize}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Entry</div>
              <div className="font-bold text-lg">
                {contest.entryFee > 0 ? `₹${contest.entryFee}` : "FREE"}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-400">
              {spotLeft > 0 ? `${spotLeft} spots left` : "Contest full"}
            </span>
            <span className="text-gray-400">{contest.totalSpots} spots</span>
          </div>

          <Progress
            value={filledPercentage}
            className={`h-1.5 mb-3 ${
              filledPercentage > 90 ? "bg-gray-800" : "bg-gray-800"
            }`}
          />

          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onShowPrizeBreakdown}
              className="text-sm flex items-center text-gray-400 hover:text-neon-green"
            >
              <Trophy className="h-3 w-3 mr-1" />
              {contest.firstPrize !== "-"
                ? `1st: ${contest.firstPrize}`
                : "Practice Contest"}
            </button>
            <button
              onClick={onShowPrizeBreakdown}
              className="text-sm flex items-center text-gray-400 hover:text-neon-green"
            >
              <Users className="h-3 w-3 mr-1" />
              {contest.winnerPercentage}% Winners
            </button>
            <button
              onClick={onShowPrizeBreakdown}
              className="text-sm flex items-center text-gray-400 hover:text-neon-green"
            >
              <Info className="h-3 w-3 mr-1" />
              Prize Breakup
            </button>
          </div>

          <Button
            className="w-full bg-neon-green text-gray-900 hover:bg-neon-green/90 font-medium"
            onClick={onJoinContest}
          >
            {contest.entryFee > 0 ? `Join ₹${contest.entryFee}` : "Join Free"}
          </Button>
        </div>

        {/* Footer - Only for specific contest types */}
        {contest.isPrivate && (
          <div className="px-4 py-2 bg-gray-800/50 text-xs">
            <span className="text-gray-400">
              Created by: {contest.createdBy}
            </span>
          </div>
        )}
        {contest.multipleEntries && (
          <div className="px-4 py-2 bg-gray-800/50 text-xs flex items-center">
            <Zap className="h-3 w-3 text-neon-green mr-1" />
            <span>Multiple entries allowed (up to 11 teams)</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Contests;
