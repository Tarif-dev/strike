
import { Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface LeagueData {
  id: string;
  name: string;
  image?: string;
  participants: number;
  prize?: string;
  startDate: string;
  endDate: string;
  joined?: boolean;
  position?: number;
  userPoints?: number;
}

interface LeagueCardProps {
  league: LeagueData;
}

export default function LeagueCard({ league }: LeagueCardProps) {
  return (
    <Link to={`/leagues/${league.id}`}>
      <div className="bg-cricket-medium-green rounded-xl overflow-hidden">
        <div className="h-24 bg-cricket-light-green flex items-center justify-center relative">
          {league.image ? (
            <img src={league.image} alt={league.name} className="w-full h-full object-cover" />
          ) : (
            <Trophy className="w-12 h-12 text-cricket-lime" />
          )}
          {league.prize && (
            <div className="absolute top-2 right-2 bg-cricket-lime text-cricket-dark-green px-3 py-1 rounded-full text-xs font-medium">
              {league.prize}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{league.name}</h3>
          
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{league.participants} participants</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>Starts: {league.startDate}</p>
            <p>Ends: {league.endDate}</p>
          </div>
          
          {league.joined && league.position && league.userPoints !== undefined && (
            <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
              <div>
                <span className="text-xs text-muted-foreground">Your position</span>
                <p className="font-medium">#{league.position}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Points</span>
                <p className="font-medium">{league.userPoints}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
