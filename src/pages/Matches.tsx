import { useState, useEffect } from "react";
import { Calendar, Filter, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import MatchCard, { MatchData } from "@/components/cricket/MatchCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMatches } from "@/hooks/useCricketData";

const Matches = () => {
  const [activeTab, setActiveTab] = useState("All");
  const { matches, loading, error } = useMatches();
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    // Set the current month for display
    const now = new Date();
    setCurrentMonth(
      now.toLocaleString("default", { month: "long", year: "numeric" })
    );
  }, []);

  // Make sure matches is always an array
  const safeMatches: MatchData[] = Array.isArray(matches) ? matches : [];

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
        <Header title="Matches" />

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
              <Calendar className="text-neon-green" />
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
              <Loader2 className="h-8 w-8 text-neon-green animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">Error loading matches</p>
              <p className="text-muted-foreground text-sm mt-2">
                Check your API settings
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
                        <Calendar className="h-4 w-4 text-neon-green" />
                        {date}
                      </h3>
                      <div className="space-y-4">
                        {matches.map((match) => (
                          <MatchCard
                            key={match.id}
                            match={match}
                            showFantasyFeatures={true}
                          />
                        ))}
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
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800 backdrop-blur-sm">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-800/80 flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-xl font-medium mb-2">No matches found</p>
                  <p className="text-gray-400 max-w-md mx-auto">
                    {activeTab === "Live"
                      ? "There are no live matches at the moment. Check back later or explore upcoming matches."
                      : activeTab === "Upcoming"
                      ? "There are no upcoming matches scheduled. Check back later."
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
                        <button
                          key={match.id}
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
                        </button>
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
