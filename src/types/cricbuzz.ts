// Cricbuzz API response types

export interface CricbuzzResponse {
  matchInfo: MatchInfo;
  venueInfo: VenueInfo;
  broadcastInfo: BroadcastInfo[];
}

export interface MatchInfo {
  matchId: number;
  matchDescription: string;
  matchFormat: string;
  matchType: string;
  complete: boolean;
  domestic: boolean;
  matchStartTimestamp: number;
  matchCompleteTimestamp: number;
  dayNight: boolean;
  year: number;
  state: string;
  team1: Team;
  team2: Team;
  series: Series;
  venue: Venue;
  status: string;
  shortStatus: string;
  matchImageId: number;
}

export interface Team {
  id: number;
  name: string;
  playerDetails: PlayerDetail[];
  shortName: string;
}

export interface PlayerDetail {
  id: number;
  name: string;
  fullName: string;
  nickName: string;
  captain: boolean;
  role: string;
  keeper: boolean;
  substitute: boolean;
  teamId: number;
  battingStyle?: string;
  bowlingStyle?: string;
  teamName: string;
  faceImageId: number;
  playingXIChange: string;
  isSupportStaff?: boolean;
}

export interface Series {
  id: number;
  name: string;
  seriesType: string;
  startDate: number;
  endDate: number;
  seriesFolder: string;
  odiSeriesResult: string;
  t20SeriesResult: string;
  testSeriesResult: string;
  tournament: boolean;
}

export interface Venue {
  id: number;
  name: string;
  city: string;
  country: string;
  timezone: string;
  latitude: string;
  longitude: string;
}

export interface VenueInfo {
  established: number;
  capacity: string;
  knownAs: string | null;
  ends: string;
  city: string;
  country: string;
  timezone: string;
  homeTeam: string;
  floodlights: boolean;
  curator: string;
  profile: string;
  imageUrl: string;
  ground: string;
  groundLength: number;
  groundWidth: number;
  otherSports: string | null;
}

export interface BroadcastInfo {
  country: string;
  broadcaster: Broadcaster[];
}

export interface Broadcaster {
  broadcastType: string;
  value: string;
}

// Helper types for fantasy team creation
export interface FantasyPlayer {
  id: number;
  name: string;
  fullName: string;
  role: string;
  isKeeper: boolean;
  isCaptain: boolean;
  teamId: number;
  teamName: string;
  teamShortName: string;
  battingStyle?: string;
  bowlingStyle?: string;
  points: number;
  imageId: number;
  selected: boolean;
}

// Role mapping for filtering
export enum PlayerRole {
  WICKET_KEEPER = "WK",
  BATSMAN = "BAT",
  ALL_ROUNDER = "AR",
  BOWLER = "BOWL"
}

// Player selection for fantasy team
export interface SelectedPlayer extends FantasyPlayer {
  isCaptain: boolean;
  isViceCaptain: boolean;
}
