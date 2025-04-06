
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trophy } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PlayerCard from '@/components/cricket/PlayerCard';
import { teams, players } from '@/data/mockData';
import { useState } from 'react';
import { Tabs } from '@/components/ui/tab';

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Players");
  
  // Find team by ID
  const team = teams.find(t => t.id === id);
  
  // For the demo, we'll just take some random players from our mock data
  const teamPlayers = players.slice(0, 11);
  
  if (!team) {
    return (
      <PageContainer>
        <div className="text-center py-10">
          <h2 className="text-xl font-bold mb-2">Team Not Found</h2>
          <Link to="/" className="text-cricket-lime">Back to Home</Link>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer className="pb-6">
      <div className="flex justify-between items-center py-4">
        <Link to="/" className="flex items-center gap-1 text-cricket-lime">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        
        <Link 
          to={`/teams/edit/${team.id}`}
          className="flex items-center gap-1 px-3 py-1.5 bg-cricket-lime text-cricket-dark-green rounded-lg text-sm font-medium"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Team</span>
        </Link>
      </div>
      
      <div className="lime-card mb-6">
        <div>
          <h1 className="font-bold text-2xl">{team.name}</h1>
          <div className="flex items-center mt-2 justify-between">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">Rank #{team.rank}</span>
            </div>
            <span className="text-sm font-bold">{team.points} points</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="dark-card">
          <span className="text-xs text-muted-foreground">Captain</span>
          <div className="flex items-center mt-1 gap-2">
            {team.captainImage ? (
              <img src={team.captainImage} alt={team.captain} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-cricket-light-green rounded-full" />
            )}
            <span className="font-medium">{team.captain}</span>
          </div>
        </div>
        
        <div className="dark-card">
          <span className="text-xs text-muted-foreground">Vice Captain</span>
          <div className="flex items-center mt-1 gap-2">
            {team.viceCaptainImage ? (
              <img src={team.viceCaptainImage} alt={team.viceCaptain} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-cricket-light-green rounded-full" />
            )}
            <span className="font-medium">{team.viceCaptain}</span>
          </div>
        </div>
      </div>
      
      <Tabs
        tabs={["Players", "Performance"]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      <div className="mt-4 animate-fade-in">
        {activeTab === "Players" && (
          <div className="space-y-4">
            {teamPlayers.map(player => (
              <Link key={player.id} to={`/players/${player.id}`}>
                <PlayerCard player={player} compact={true} />
              </Link>
            ))}
          </div>
        )}
        
        {activeTab === "Performance" && (
          <div className="space-y-5">
            <div className="bg-cricket-medium-green rounded-xl p-4">
              <h3 className="font-semibold mb-3">Recent Performances</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div>
                    <span className="text-sm font-medium">IPL Match #24</span>
                    <p className="text-xs text-muted-foreground">vs Chennai Super Kings</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-cricket-lime">+153 pts</span>
                    <p className="text-xs text-muted-foreground">Apr 10, 2023</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div>
                    <span className="text-sm font-medium">IPL Match #18</span>
                    <p className="text-xs text-muted-foreground">vs Royal Challengers</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-cricket-lime">+205 pts</span>
                    <p className="text-xs text-muted-foreground">Apr 5, 2023</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium">IPL Match #12</span>
                    <p className="text-xs text-muted-foreground">vs Delhi Capitals</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-cricket-lime">+178 pts</span>
                    <p className="text-xs text-muted-foreground">Apr 1, 2023</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-cricket-medium-green rounded-xl p-4">
              <h3 className="font-semibold mb-3">Top Performers</h3>
              <div className="space-y-3">
                {teamPlayers.slice(0, 3).map(player => (
                  <div key={player.id} className="flex justify-between items-center pb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      {player.image ? (
                        <img src={player.image} alt={player.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 bg-cricket-light-green rounded-full" />
                      )}
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <span className="font-medium text-cricket-lime">+{Math.floor(Math.random() * 100) + 50} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default TeamDetail;
