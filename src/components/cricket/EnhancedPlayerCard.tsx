import React from 'react';
import { Badge } from '../ui/badge';
import { Trophy, User } from 'lucide-react';

// Enhanced PlayerCard component to show batting/bowling styles and 
// handle captain status more clearly

export interface PlayerCardProps {
  player: PlayerData;
  onSelect: (player: PlayerData) => void;
  onCaptainSelect?: (player: PlayerData) => void;
  onViceCaptainSelect?: (player: PlayerData) => void;
  isSelected: boolean;
  isCaptain: boolean;
  isViceCaptain: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export interface PlayerData {
  id: string;
  name: string;
  fullName?: string;
  team: string;
  teamLogo?: string;
  position: string;
  country?: string;
  countryFlag?: string;
  captain?: boolean; // Whether player is team captain
  wicketkeeper?: boolean; // Whether player is wicketkeeper
  image?: string;
  playerImageUrl?: string;
  stats?: {
    matches?: number;
    runs?: number;
    average?: number;
    wickets?: number;
    economy?: number;
    strikeRate?: number;
    battingStyle?: string;
    bowlingStyle?: string;
    role?: string;
  };
  points?: number;
  selected?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onSelect,
  onCaptainSelect,
  onViceCaptainSelect,
  isSelected,
  isCaptain,
  isViceCaptain,
  disabled = false,
  disabledReason,
}) => {
  // Helper to determine badge style based on player position
  const getBadgeVariant = (position: string) => {
    switch (position) {
      case 'Batsman':
        return 'bg-blue-500/20 text-blue-400';
      case 'Bowler':
        return 'bg-red-500/20 text-red-400';
      case 'All-rounder':
        return 'bg-amber-500/20 text-amber-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div 
      className={`
        relative p-3 rounded-lg transition-all
        ${isSelected ? 'bg-gray-800/90 border border-neon-green/40' : 'bg-gray-800/60 hover:bg-gray-800/80'}
        ${disabled ? 'opacity-50' : ''}
      `}
    >
      {/* Player Info */}
      <div className="flex items-start gap-3">
        {/* Player Image */}
        <div className="relative">
          {player.playerImageUrl || player.image ? (
            <img 
              src={player.playerImageUrl || player.image}
              alt={player.name}
              className="w-14 h-14 rounded-full object-cover"
              onError={(e) => { e.currentTarget.src = "/placeholder.svg" }}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          )}
          
          {/* Player badges */}
          <div className="absolute -bottom-1 -right-1 flex space-x-1">
            {player.captain && (
              <span className="bg-amber-400 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                C
              </span>
            )}
            {player.wicketkeeper && (
              <span className="bg-blue-400 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                WK
              </span>
            )}
          </div>
        </div>
        
        {/* Player Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white">{player.name}</h3>
              <div className="text-sm text-gray-400">{player.team}</div>
            </div>
            
            <div>
              <Badge className={getBadgeVariant(player.position)}>
                {player.position}
              </Badge>
            </div>
          </div>
          
          {/* Player Stats */}
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {player.stats?.battingStyle && (
              <div className="text-gray-300">
                <span className="text-gray-500">Batting: </span>
                {player.stats.battingStyle}
              </div>
            )}
            
            {player.stats?.bowlingStyle && player.stats.bowlingStyle !== 'N/A' && (
              <div className="text-gray-300">
                <span className="text-gray-500">Bowling: </span>
                {player.stats.bowlingStyle}
              </div>
            )}
            
            {player.stats?.role && (
              <div className="text-gray-300">
                <span className="text-gray-500">Role: </span>
                {player.stats.role}
              </div>
            )}
            
            {player.points && (
              <div className="text-neon-green font-medium">
                {(player.points / 100).toFixed(1)} Cr
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Selection Actions */}
      {isSelected && (onCaptainSelect || onViceCaptainSelect) && (
        <div className="flex justify-between mt-3 gap-2">
          {onCaptainSelect && (
            <button
              onClick={() => onCaptainSelect(player)}
              className={`
                flex-1 py-1 px-2 rounded text-xs font-medium
                ${isCaptain 
                  ? 'bg-neon-green text-black' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
              `}
            >
              <Trophy className="w-3 h-3 inline mr-1" />
              Captain
            </button>
          )}
          
          {onViceCaptainSelect && (
            <button
              onClick={() => onViceCaptainSelect(player)}
              className={`
                flex-1 py-1 px-2 rounded text-xs font-medium
                ${isViceCaptain 
                  ? 'bg-amber-400 text-black' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
              `}
            >
              <Trophy className="w-3 h-3 inline mr-1" />
              Vice Capt
            </button>
          )}
        </div>
      )}
      
      {/* Select Button */}
      <button
        onClick={() => !disabled && onSelect(player)}
        disabled={disabled}
        className={`
          mt-2 w-full py-1.5 rounded text-sm font-medium transition-colors
          ${isSelected 
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
            : 'bg-neon-green/20 text-neon-green hover:bg-neon-green/30'}
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isSelected ? 'Remove' : 'Select'}
      </button>
      
      {/* Disabled Reason */}
      {disabled && disabledReason && (
        <div className="mt-1 text-xs text-amber-400">
          {disabledReason}
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
