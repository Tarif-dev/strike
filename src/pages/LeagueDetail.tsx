
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PlayerCard from '@/components/cricket/PlayerCard';
import { leagues, players } from '@/data/mockData';
import { useState } from 'react';
import { Tabs } from '@/components/ui/tab';
import { toast } from '@/hooks/use-toast';

const LeagueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Standings");
  const [isJoined, setIsJoined] = useState(false);
  
  // Find league by ID
  const league = leagues.find(l => l.id === id);
  
  // For the demo, we'll just take some random players from our mock data
  const topPlayers = players.slice(0, 5).map((player, i) => ({
    ...player,
    points: 800 - i * 50
  }));
  
  if (!league) {
    return (
      <PageContainer>
        <div className="text-center py-10">
          <h2 className="text-xl font-bold mb-2">League Not Found</h2>
          <Link to="/leagues" className="text-cricket-lime">Back to Leagues</Link>
        </div>
      </PageContainer>
    );
  }
  
  const handleJoinLeague = () => {
    setIsJoined(true);
    toast({
      title: "League Joined!",
      description: `You have successfully joined ${league.name}`,
      variant: "default"
    });
  };
  
  return (
    <PageContainer className="pb-6">
      <div className="flex justify-between items-center py-4">
        <Link to="/leagues" className="flex items-center gap-1 text-cricket-lime">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        
        <div className="flex items-center gap-1">
          <Users className="w-5 h-5" />
          <span>{league.participants}</span>
        </div>
      </div>
      
      <div className="h-36 bg-cricket-light-green rounded-xl flex items-center justify-center relative mb-4">
        <h1 className="font-bold text-2xl">{league.name}</h1>
        {league.prize && (
          <div className="absolute top-2 right-2 bg-cricket-lime text-cricket-dark-green px-3 py-1 rounded-full text-sm font-medium">
            {league.prize}
          </div>
        )}
      </div>
      
      <div className="bg-cricket-medium-green rounded-xl p-4 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Starts: {league.startDate}</span>
          <span>Ends: {league.endDate}</span>
        </div>
        
        {league.joined || isJoined ? (
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-xs text-muted-foreground">Your position</span>
              <p className="font-medium">#{league.position || "TBD"}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Points</span>
              <p className="font-medium">{league.userPoints || 0}</p>
            </div>
          </div>
        ) : (
          <button 
            className="w-full mt-2 py-2 bg-cricket-lime text-cricket-dark-green rounded-lg font-medium"
            onClick={handleJoinLeague}
          >
            Join League
          </button>
        )}
      </div>
      
      <Tabs
        tabs={["Standings", "Matches", "Prizes"]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      <div className="mt-4 animate-fade-in">
        {activeTab === "Standings" && (
          <div className="space-y-4">
            <h3 className="font-semibold">Top Players</h3>
            {topPlayers.map((player, i) => (
              <div key={player.id} className="bg-cricket-medium-green rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-cricket-lime text-cricket-dark-green rounded-full flex items-center justify-center font-medium">
                    {i + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    {player.image ? (
                      <img src={player.image} alt={player.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 bg-cricket-light-green rounded-full" />
                    )}
                    <div>
                      <span className="font-medium">{player.name}</span>
                      <p className="text-xs text-muted-foreground">Team Name</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-cricket-lime">{player.points}</span>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === "Matches" && (
          <div className="space-y-4">
            <div className="bg-cricket-medium-green rounded-xl p-4">
              <h3 className="font-semibold mb-3">Upcoming Matches</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div>
                    <span className="font-medium">MI vs CSK</span>
                    <p className="text-xs text-muted-foreground">Apr 10, 2023</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-cricket-lime">2x</span>
                    <span className="text-xs">points</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div>
                    <span className="font-medium">RCB vs DC</span>
                    <p className="text-xs text-muted-foreground">Apr 15, 2023</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-cricket-lime">1x</span>
                    <span className="text-xs">points</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">KKR vs SRH</span>
                    <p className="text-xs text-muted-foreground">Apr 20, 2023</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-cricket-lime">1.5x</span>
                    <span className="text-xs">points</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-cricket-medium-green rounded-xl p-4">
              <h3 className="font-semibold mb-3">Completed Matches</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div>
                    <span className="font-medium">DC vs SRH</span>
                    <p className="text-xs text-muted-foreground">Apr 5, 2023</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">+158</span>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div>
                    <span className="font-medium">CSK vs RCB</span>
                    <p className="text-xs text-muted-foreground">Apr 2, 2023</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">+175</span>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "Prizes" && (
          <div className="space-y-4">
            <div className="bg-cricket-medium-green rounded-xl p-4">
              <h3 className="font-semibold mb-3">Prize Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div>
                    <span className="font-medium">1st Place</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-cricket-lime">₹500,000</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div>
                    <span className="font-medium">2nd Place</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-cricket-lime">₹300,000</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div>
                    <span className="font-medium">3rd Place</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-cricket-lime">₹100,000</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">4th-10th Place</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-cricket-lime">₹10,000</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-cricket-medium-green rounded-xl p-4">
              <h3 className="font-semibold mb-3">Special Prizes</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div>
                    <span className="font-medium">Highest Points in a Match</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-cricket-lime">₹25,000</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div>
                    <span className="font-medium">Best Captain Selection</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-cricket-lime">₹15,000</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">Weekly Top Performer</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-cricket-lime">₹10,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default LeagueDetail;
