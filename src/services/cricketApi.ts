
import { players, matches, teamLogos, playerImages, countryFlags } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

// API configuration
const API_BASE_URL = "https://api.cricapi.com/v1";
// We'll use this key as a fallback when the actual API key is not available
// In a production app, you'd use environment variables or secrets
const API_KEY = "YOUR_CRICKET_API_KEY"; 

// Types for API responses
export interface LiveMatch {
  id: string;
  name: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo: {
    name: string;
    shortname: string;
    img: string;
  }[];
  score: {
    r: number;
    w: number;
    o: number;
    inning: string;
  }[];
}

export interface PlayerInfo {
  id: string;
  name: string;
  country: string;
  role: string;
  battingStyle: string;
  bowlingStyle: string;
  image: string;
  stats?: {
    batting: {
      matches: number;
      runs: number;
      average: number;
      strikeRate: number;
    };
    bowling: {
      matches: number;
      wickets: number;
      economy: number;
      average: number;
    };
  };
}

// Helper to transform API match data to our app format
const transformMatchData = (apiMatch: LiveMatch) => {
  // Use existing team logos or fallback to API provided ones
  const getTeamLogo = (teamName: string) => {
    const teamKey = Object.keys(teamLogos).find(key => 
      key.toLowerCase().includes(teamName.toLowerCase())
    );
    return teamKey ? teamLogos[teamKey as keyof typeof teamLogos] : 
      (apiMatch.teamInfo?.find(t => t.name === teamName)?.img || "");
  };

  // Determine match status
  let matchStatus: "upcoming" | "live" | "completed" = "upcoming";
  if (apiMatch.status.toLowerCase().includes("started") || 
      apiMatch.status.toLowerCase().includes("live")) {
    matchStatus = "live";
  } else if (apiMatch.status.toLowerCase().includes("complete") ||
            apiMatch.status.toLowerCase().includes("finished")) {
    matchStatus = "completed";
  }

  // Format scores
  const homeScore = apiMatch.score?.length > 0 ? 
    `${apiMatch.score[0].r}/${apiMatch.score[0].w} (${apiMatch.score[0].o})` : undefined;
  
  const awayScore = apiMatch.score?.length > 1 ? 
    `${apiMatch.score[1].r}/${apiMatch.score[1].w} (${apiMatch.score[1].o})` : "Yet to bat";

  return {
    id: apiMatch.id,
    homeTeam: {
      name: apiMatch.teams[0],
      shortName: apiMatch.teamInfo?.find(t => t.name === apiMatch.teams[0])?.shortname || 
                apiMatch.teams[0].substring(0, 3).toUpperCase(),
      logo: getTeamLogo(apiMatch.teams[0])
    },
    awayTeam: {
      name: apiMatch.teams[1],
      shortName: apiMatch.teamInfo?.find(t => t.name === apiMatch.teams[1])?.shortname || 
                apiMatch.teams[1].substring(0, 3).toUpperCase(),
      logo: getTeamLogo(apiMatch.teams[1])
    },
    tournament: apiMatch.name.split(",")[0] || "Cricket Match",
    venue: apiMatch.venue,
    date: new Date(apiMatch.dateTimeGMT).toLocaleDateString(),
    time: new Date(apiMatch.dateTimeGMT).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: matchStatus,
    homeScore,
    awayScore,
    result: apiMatch.status
  };
};

// Helper to transform API player data to our app format
const transformPlayerData = (apiPlayer: PlayerInfo) => {
  // Map player position based on role
  let position = "Batsman";
  if (apiPlayer.role?.toLowerCase().includes("bowl")) {
    position = "Bowler";
  } else if (apiPlayer.role?.toLowerCase().includes("all")) {
    position = "All-rounder";
  }

  // Use existing player images or fallback to API provided ones
  const playerKey = Object.keys(playerImages).find(key => 
    key.toLowerCase().includes(apiPlayer.name.toLowerCase().replace(/\s/g, ""))
  );
  const playerImage = playerKey ? playerImages[playerKey as keyof typeof playerImages] : apiPlayer.image;

  // Get country flag
  const countryKey = Object.keys(countryFlags).find(key => 
    key.toLowerCase() === apiPlayer.country.toLowerCase()
  );
  const countryFlag = countryKey ? countryFlags[countryKey as keyof typeof countryFlags] : "";

  // Calculate points (just a sample algorithm)
  const calculatePoints = () => {
    let points = 0;
    const stats = apiPlayer.stats;
    if (stats) {
      if (stats.batting) {
        points += stats.batting.runs / 10;
        points += stats.batting.average * 2;
      }
      if (stats.bowling) {
        points += stats.bowling.wickets * 20;
        points += (10 - stats.bowling.economy) * 5;
      }
    }
    return Math.round(points);
  };

  return {
    id: apiPlayer.id,
    name: apiPlayer.name,
    fullName: apiPlayer.name,
    team: "Team TBD", // This would need to be fetched from another endpoint
    teamLogo: teamLogos.india, // Default, would need proper mapping
    position,
    image: playerImage,
    country: apiPlayer.country,
    countryFlag,
    stats: {
      matches: apiPlayer.stats?.batting?.matches || 0,
      runs: apiPlayer.stats?.batting?.runs || 0,
      wickets: apiPlayer.stats?.bowling?.wickets || 0,
      average: apiPlayer.stats?.batting?.average || 0,
      strikeRate: apiPlayer.stats?.batting?.strikeRate || 0,
      economy: apiPlayer.stats?.bowling?.economy || 0
    },
    points: calculatePoints()
  };
};

// API Services
export const cricketApiService = {
  // Fetch live matches
  fetchMatches: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/matches?apikey=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }
      
      const data = await response.json();
      
      if (data.status !== "success") {
        throw new Error(data.message || 'API error');
      }
      
      // Transform the data to match our app's format
      return data.data.map(transformMatchData);
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast({
        title: "Error fetching matches",
        description: "Using mock data instead. Please check your API key.",
        variant: "destructive"
      });
      
      // Fallback to mock data
      return matches;
    }
  },
  
  // Fetch match details
  fetchMatchDetails: async (matchId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/match_info?id=${matchId}&apikey=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch match details');
      }
      
      const data = await response.json();
      
      if (data.status !== "success") {
        throw new Error(data.message || 'API error');
      }
      
      // Return transformed data
      return transformMatchData(data.data);
    } catch (error) {
      console.error("Error fetching match details:", error);
      toast({
        title: "Error fetching match details",
        description: "Using mock data instead. Please check your API key.",
        variant: "destructive"
      });
      
      // Fallback to mock data
      return matches.find(m => m.id === matchId);
    }
  },
  
  // Fetch players
  fetchPlayers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/players?apikey=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }
      
      const data = await response.json();
      
      if (data.status !== "success") {
        throw new Error(data.message || 'API error');
      }
      
      // Transform the data to match our app's format
      return data.data.map(transformPlayerData);
    } catch (error) {
      console.error("Error fetching players:", error);
      toast({
        title: "Error fetching players",
        description: "Using mock data instead. Please check your API key.",
        variant: "destructive"
      });
      
      // Fallback to mock data
      return players;
    }
  },
  
  // Fetch player details
  fetchPlayerDetails: async (playerId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/players_info?id=${playerId}&apikey=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch player details');
      }
      
      const data = await response.json();
      
      if (data.status !== "success") {
        throw new Error(data.message || 'API error');
      }
      
      // Return transformed data
      return transformPlayerData(data.data);
    } catch (error) {
      console.error("Error fetching player details:", error);
      toast({
        title: "Error fetching player details",
        description: "Using mock data instead. Please check your API key.",
        variant: "destructive"
      });
      
      // Fallback to mock data
      return players.find(p => p.id === playerId);
    }
  },
  
  // Set API key programmatically
  setApiKey: (newApiKey: string) => {
    localStorage.setItem('cricket_api_key', newApiKey);
    toast({
      title: "API Key Updated",
      description: "Your Cricket API key has been updated."
    });
  },
  
  // Get the current API key
  getApiKey: () => {
    return localStorage.getItem('cricket_api_key') || API_KEY;
  }
};
