
import { useState } from "react";
import { Calendar, Filter } from "lucide-react";
import { matches } from "@/data/mockData";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import MatchCard from "@/components/cricket/MatchCard";
import { Tabs } from "@/components/ui/tab";

const Matches = () => {
  const [activeTab, setActiveTab] = useState("All");

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
              <span>April 2025</span>
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
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default Matches;
