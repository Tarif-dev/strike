
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';
import MatchCard from '@/components/cricket/MatchCard';
import { Tabs } from '@/components/ui/tab';
import { matches } from '@/data/mockData';

const Matches = () => {
  const [activeTab, setActiveTab] = useState("All");
  
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
        
        <div className="space-y-6 mt-4">
          <Tabs
            tabs={["All", "Live", "Upcoming", "Completed"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          
          <div className="space-y-4 animate-fade-in">
            {filteredMatches.length > 0 ? (
              filteredMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No matches available</p>
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
