/**
 * Interfaces for the match and player data
 */
import { MatchData } from "@/components/cricket/MatchCard";
import { Json } from "@/integrations/supabase/types";

// Extended MatchData with admin fields
export interface ExtendedMatchData extends MatchData {
  is_finalized?: boolean;
  is_active?: boolean;
  admin?: string;
  registration_end_time?: string;
}

// Player performance interface defining cricket statistics
export interface PlayerPerformance {
  runs?: number;
  balls?: number;
  fours?: number;
  sixes?: number;
  strike_rate?: number;
  wickets?: number;
  overs?: string | number;
  maidens?: number;
  economy?: number;
  catches?: number;
  stumpings?: number;
  run_outs?: number;
  runOutDirect?: number;
  runOutIndirect?: number;
  lbwBowledCount?: number;
}

// Player with points calculation
export interface PlayerWithPoints {
  id: string;
  name: string;
  fullName?: string;
  team: string;
  position: string;
  basePoints: number;
  performance: PlayerPerformance;
  calculatedPoints: number;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
}

// Team data interface
export interface TeamData {
  id: string;
  user_id: string;
  team_name: string;
  match_id: string;
  players: string[] | unknown[]; // Allow for different types of player data
  originalPlayers?: unknown[]; // Original player objects from the database
  captain_id: string;
  vice_captain_id: string;
  created_at: string;
  updated_at: string;
  total_points: number | null;
  match_details: Json;
  playerDetails?: PlayerWithPoints[];
  calculatedPoints?: number;
  rank?: number;
}

// Match details interface for storing player performances
export interface MatchDetailsData {
  match_id: string;
  player_performances: Record<string, PlayerPerformance>;
  updated_at: string;
}
