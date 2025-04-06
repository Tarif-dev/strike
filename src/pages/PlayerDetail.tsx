import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Loader2 } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { useState } from 'react';
import { usePlayer } from '@/hooks/useCricketData';

const PlayerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isFollowing, setIsFollowing] = useState(false);
  const { player, loading, error } = usePlayer(id || "");
  
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  
  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-between items-center py-4">
          <Link to="/players" className="flex items-center gap-1 text-cricket-lime">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-cricket-lime animate-spin" />
        </div>
      </PageContainer>
    );
  }
  
  if (error || !player) {
    return (
      <PageContainer>
        <div className="flex justify-between items-center py-4">
          <Link to="/players" className="flex items-center gap-1 text-cricket-lime">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
        </div>
        <div className="text-center py-10">
          <h2 className="text-xl font-bold mb-2">Player Not Found</h2>
          <p className="text-muted-foreground mb-4">Unable to load player information</p>
          <Link to="/players" className="text-cricket-lime">Back to Players</Link>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer className="pb-6">
      <div className="flex justify-between items-center py-4">
        <Link to="/players" className="flex items-center gap-1 text-cricket-lime">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        
        <button 
          onClick={toggleFollow}
          className={`px-4 py-1 rounded-full text-sm ${
            isFollowing 
              ? "bg-cricket-lime text-cricket-dark-green" 
              : "bg-cricket-medium-green text-foreground"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>
      
      <div className="lime-card mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-cricket-dark-green">
            {player.image ? (
              <img 
                src={player.image} 
                alt={player.name} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=' + player.name.charAt(0);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">
                {player.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-2xl">{player.fullName || player.name}</h1>
              <img 
                src={player.countryFlag} 
                alt={player.country} 
                className="w-6 h-6 rounded-full" 
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            
            <div className="flex items-center mt-1 gap-2">
              <img 
                src={player.teamLogo} 
                alt={player.team} 
                className="w-5 h-5" 
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-sm">{player.team}</span>
            </div>
            
            <div className="flex items-center mt-2 gap-1">
              <Star className="w-4 h-4 fill-cricket-dark-green text-cricket-dark-green" />
              <span className="text-sm font-medium">{player.points} points</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="dark-card text-center">
          <span className="text-xs text-muted-foreground">Position</span>
          <p className="font-bold">{player.position}</p>
        </div>
        
        <div className="dark-card text-center">
          <span className="text-xs text-muted-foreground">Matches</span>
          <p className="font-bold">{player.stats.matches}</p>
        </div>
        
        <div className="dark-card text-center">
          <span className="text-xs text-muted-foreground">Country</span>
          <p className="font-bold">{player.country}</p>
        </div>
      </div>
      
      <h2 className="font-bold text-lg mb-4">Stats</h2>
      
      <div className="bg-cricket-medium-green rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 gap-6">
          {player.stats.runs !== undefined && (
            <div>
              <span className="text-xs text-muted-foreground">Runs</span>
              <p className="font-bold text-xl">{player.stats.runs}</p>
            </div>
          )}
          
          {player.stats.wickets !== undefined && (
            <div>
              <span className="text-xs text-muted-foreground">Wickets</span>
              <p className="font-bold text-xl">{player.stats.wickets}</p>
            </div>
          )}
          
          {player.stats.average !== undefined && (
            <div>
              <span className="text-xs text-muted-foreground">Average</span>
              <p className="font-bold text-xl">{player.stats.average}</p>
            </div>
          )}
          
          {player.stats.strikeRate !== undefined && (
            <div>
              <span className="text-xs text-muted-foreground">Strike Rate</span>
              <p className="font-bold text-xl">{player.stats.strikeRate}</p>
            </div>
          )}
          
          {player.stats.economy !== undefined && (
            <div>
              <span className="text-xs text-muted-foreground">Economy</span>
              <p className="font-bold text-xl">{player.stats.economy}</p>
            </div>
          )}
        </div>
      </div>
      
      <h2 className="font-bold text-lg mb-4">Recent Performances</h2>
      
      <div className="space-y-3">
        <div className="bg-cricket-medium-green rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm">vs {player.position === "Batsman" ? "CSK" : "RCB"}</span>
            <span className="text-xs text-muted-foreground">Apr 10, 2023</span>
          </div>
          {player.position === "Batsman" ? (
            <div className="text-lg font-medium">63 runs (42 balls)</div>
          ) : (
            <div className="text-lg font-medium">3/24 (4 overs)</div>
          )}
        </div>
        
        <div className="bg-cricket-medium-green rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm">vs {player.position === "Batsman" ? "KKR" : "DC"}</span>
            <span className="text-xs text-muted-foreground">Apr 5, 2023</span>
          </div>
          {player.position === "Batsman" ? (
            <div className="text-lg font-medium">42 runs (31 balls)</div>
          ) : (
            <div className="text-lg font-medium">2/35 (4 overs)</div>
          )}
        </div>
        
        <div className="bg-cricket-medium-green rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm">vs {player.position === "Batsman" ? "SRH" : "MI"}</span>
            <span className="text-xs text-muted-foreground">Apr 2, 2023</span>
          </div>
          {player.position === "Batsman" ? (
            <div className="text-lg font-medium">18 runs (15 balls)</div>
          ) : (
            <div className="text-lg font-medium">1/27 (4 overs)</div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default PlayerDetail;
