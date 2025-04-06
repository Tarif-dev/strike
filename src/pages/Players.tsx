
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';
import PlayerCard from '@/components/cricket/PlayerCard';
import { Tabs } from '@/components/ui/tab';
import { players } from '@/data/mockData';

const Players = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const batsmen = players.filter(p => p.position === "Batsman");
  const bowlers = players.filter(p => p.position === "Bowler");
  const allRounders = players.filter(p => p.position === "All-rounder");
  
  const getFilteredPlayers = () => {
    let filteredPlayers;
    
    switch (activeTab) {
      case "Batsmen":
        filteredPlayers = batsmen;
        break;
      case "Bowlers":
        filteredPlayers = bowlers;
        break;
      case "All-rounders":
        filteredPlayers = allRounders;
        break;
      default:
        filteredPlayers = players;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return filteredPlayers.filter(
        p => p.name.toLowerCase().includes(query) || 
             p.team.toLowerCase().includes(query) ||
             p.country.toLowerCase().includes(query)
      );
    }
    
    return filteredPlayers;
  };
  
  const filteredPlayers = getFilteredPlayers();
  
  return (
    <>
      <PageContainer>
        <Header title="Players" />
        
        <div className="space-y-6 mt-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <input 
              type="text" 
              placeholder="Search players..."
              className="w-full pl-10 pr-4 py-2.5 bg-cricket-medium-green text-foreground rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-cricket-lime"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs
            tabs={["All", "Batsmen", "Bowlers", "All-rounders"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          
          <div className="space-y-4 animate-fade-in">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map(player => (
                <Link key={player.id} to={`/players/${player.id}`}>
                  <PlayerCard player={player} compact={true} />
                </Link>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No players found</p>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
      
      <Navbar />
    </>
  );
};

export default Players;
