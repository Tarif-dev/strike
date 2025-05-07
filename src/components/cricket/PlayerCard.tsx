import { cn } from "@/lib/utils";
import InitialsAvatar from "@/components/common/InitialsAvatar";

export interface PlayerData {
  id: string;
  name: string;
  fullName?: string;
  team: string;
  teamLogo: string;
  position: string;
  image?: string;
  country: string;
  countryFlag: string;
  captain?: boolean;
  wicketkeeper?: boolean;
  playerImageUrl?: string;
  stats: {
    matches?: number;
    runs?: number;
    wickets?: number;
    average?: number;
    strikeRate?: number;
    economy?: number;
    role?: string;
    battingStyle?: string;
    bowlingStyle?: string;
  };
  points?: number;
  selected?: boolean;
}

interface PlayerCardProps {
  player: PlayerData;
  compact?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export default function PlayerCard({
  player,
  compact = false,
  onClick,
  selected = false,
}: PlayerCardProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "bg-cricket-medium-green rounded-xl p-3 flex items-center gap-3 transition-all",
          onClick && "cursor-pointer hover:bg-secondary",
          selected && "border-2 border-cricket-lime"
        )}
        onClick={onClick}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden bg-accent/20">
          {player.image ? (
            <img
              src={player.image}
              alt={player.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <InitialsAvatar name={player.name} size="sm" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{player.name}</h3>
            <img
              src={player.countryFlag}
              alt={player.country}
              className="country-flag"
            />
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <img src={player.teamLogo} alt={player.team} className="w-4 h-4" />
            <span>{player.position}</span>
          </div>
        </div>
        {player.points !== undefined && (
          <div className="stat-badge ml-auto">{player.points}</div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-cricket-medium-green rounded-xl overflow-hidden",
        onClick && "cursor-pointer hover:bg-secondary transition-colors",
        selected && "border-2 border-cricket-lime"
      )}
      onClick={onClick}
    >
      <div className="lime-card flex items-center justify-between p-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{player.name}</h3>
            <img
              src={player.countryFlag}
              alt={player.country}
              className="country-flag"
            />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <img src={player.teamLogo} alt={player.team} className="w-5 h-5" />
            <span className="text-sm">{player.team}</span>
          </div>
        </div>
        {player.points !== undefined && (
          <div className="flex flex-col items-center">
            <span className="text-xs">Points</span>
            <span className="text-2xl font-bold">{player.points}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between mb-3">
          <div>
            <span className="text-xs text-muted-foreground">Position</span>
            <p className="font-medium">{player.position}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Matches</span>
            <p className="font-medium">{player.stats.matches}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {player.stats.runs !== undefined && (
            <div>
              <span className="text-xs text-muted-foreground">Runs</span>
              <p className="font-medium">{player.stats.runs}</p>
            </div>
          )}
          {player.stats.wickets !== undefined && (
            <div>
              <span className="text-xs text-muted-foreground">Wickets</span>
              <p className="font-medium">{player.stats.wickets}</p>
            </div>
          )}
          {player.stats.average !== undefined && (
            <div>
              <span className="text-xs text-muted-foreground">Avg</span>
              <p className="font-medium">{player.stats.average}</p>
            </div>
          )}
          {player.stats.strikeRate !== undefined && (
            <div>
              <span className="text-xs text-muted-foreground">SR</span>
              <p className="font-medium">{player.stats.strikeRate}</p>
            </div>
          )}
          {player.stats.economy !== undefined && (
            <div>
              <span className="text-xs text-muted-foreground">Eco</span>
              <p className="font-medium">{player.stats.economy}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
