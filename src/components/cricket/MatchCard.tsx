
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface MatchData {
  id: string;
  homeTeam: {
    name: string;
    shortName: string;
    logo: string;
  };
  awayTeam: {
    name: string;
    shortName: string;
    logo: string;
  };
  tournament: string;
  venue: string;
  date: string;
  time: string;
  status: 'upcoming' | 'live' | 'completed';
  result?: string;
  homeScore?: string;
  awayScore?: string;
}

interface MatchCardProps {
  match: MatchData;
}

export default function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';
  
  return (
    <Link to={`/matches/${match.id}`}>
      <div className="bg-cricket-medium-green rounded-xl overflow-hidden">
        <div className="bg-cricket-light-green px-4 py-2 flex justify-between items-center">
          <span className="text-sm font-medium">{match.tournament}</span>
          {isLive && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">LIVE</span>}
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-10 h-10" />
              <div>
                <p className="font-bold">{match.homeTeam.name}</p>
                {isCompleted && <p className="text-sm">{match.homeScore}</p>}
              </div>
            </div>
            
            <div className="text-center">
              <span className="text-xs bg-cricket-lime text-cricket-dark-green px-2 py-1 rounded-full">VS</span>
            </div>
            
            <div className="flex items-center gap-3 flex-row-reverse text-right">
              <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-10 h-10" />
              <div>
                <p className="font-bold">{match.awayTeam.name}</p>
                {isCompleted && <p className="text-sm">{match.awayScore}</p>}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{match.date}</span>
            </div>
            <span>{match.time}</span>
            <span>{match.venue}</span>
          </div>
          
          {isCompleted && (
            <div className="mt-2 text-center text-sm">
              <span className="text-cricket-lime">{match.result}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
