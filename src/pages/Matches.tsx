
import { useState, useEffect } from "react";
import { Calendar, Filter, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import MatchCard from "@/components/cricket/MatchCard";
import { Tabs } from "@/components/ui/tab";
import { useMatches } from "@/hooks/useCricketData";

const Matches = () => {
  const [activeTab, setActiveTab] = useState("All");
  const { matches, loading, error } = useMatches();
  const [currentMonth, setCurrentMonth] = useState("");
  
  useEffect(() => {
    // Set the current month for display
    const now = new Date();
    setCurrentMonth(now.toLocaleString('default', { month: 'long', year: 'numeric' }));
  }, []);
  
  // Filter matches by status ensuring the status matches the expected type
  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');
  const completedMatches = matches.filter(m => m.status === 'completed');
  
  const getFilteredMatches = () => {
    switch (activeTab) {
      case "Live":
        return liveMatches;
      case "Upcoming":
        return upcomingMatches;
      case "Completed":
        return completedMatches;
      default:
        return matches;
    }
  };

  const filteredMatches = getFilteredMatches();

  return (
    <>
      <PageContainer>
        <Header title="Matches" />

        <div className="mt-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="text-cricket-lime" />
              <span>{currentMonth}</span>
            </div>
            <button className="flex items-center gap-1 text-sm">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          <Tabs
            tabs={["All", "Live", "Upcoming", "Completed"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-cricket-lime animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">Error loading matches</p>
              <p className="text-muted-foreground text-sm mt-2">Check your API settings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMatches.length > 0 ? (
                filteredMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No matches found</p>
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
