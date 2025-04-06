
import { Link } from 'react-router-dom';
import { User, Users } from 'lucide-react';

export interface TeamData {
  id: string;
  name: string;
  captain?: string;
  captainImage?: string;
  viceCaptain?: string;
  viceCaptainImage?: string;
  points?: number;
  rank?: number;
  totalPlayers: number;
}

interface TeamCardProps {
  team: TeamData;
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <Link to={`/teams/${team.id}`}>
      <div className="bg-cricket-medium-green rounded-xl overflow-hidden">
        <div className="lime-card p-4">
          <h3 className="font-bold text-lg">{team.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Users className="w-4 h-4" />
            <span className="text-xs">{team.totalPlayers} players</span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground">Captain</span>
              <div className="flex items-center mt-1 gap-2">
                {team.captainImage ? (
                  <img src={team.captainImage} alt={team.captain} className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="w-8 h-8 p-1 bg-cricket-light-green rounded-full" />
                )}
                <span className="font-medium">{team.captain}</span>
              </div>
            </div>
            
            <div>
              <span className="text-xs text-muted-foreground">Vice Captain</span>
              <div className="flex items-center mt-1 gap-2">
                {team.viceCaptainImage ? (
                  <img src={team.viceCaptainImage} alt={team.viceCaptain} className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="w-8 h-8 p-1 bg-cricket-light-green rounded-full" />
                )}
                <span className="font-medium">{team.viceCaptain}</span>
              </div>
            </div>
          </div>
          
          {team.points !== undefined && team.rank !== undefined && (
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
              <div>
                <span className="text-xs text-muted-foreground">Points</span>
                <p className="font-bold text-cricket-lime">{team.points}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Rank</span>
                <p className="font-medium">#{team.rank}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
