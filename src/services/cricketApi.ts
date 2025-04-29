import { players, leagues, teams } from "@/data/mockData";
import { matches } from "@/data/matchesData";
import { toast } from "@/hooks/use-toast";

// This file now only returns mock data, as we've removed all API integrations

// Mock API Services
export const cricketApiService = {
  // Fetch matches (all come from match data)
  fetchMatches: async () => {
    console.log("Using match data from matchesData.ts");
    // Return matches from matchesData.ts
    return matches;
  },

  // Fetch match details from match data
  fetchMatchDetails: async (matchId: string) => {
    console.log(`Fetching match details for ID: ${matchId}`);
    // Return the match from match data
    const match = matches.find((m) => m.id === matchId);
    if (!match) {
      console.warn(`Match with ID ${matchId} not found in match data`);
    }
    return match || matches[0]; // Fallback to first match if not found
  },

  // Fetch players from mock data
  fetchPlayers: async () => {
    console.log("Fetching mock player data");
    // Return players from mockData
    return players;
  },

  // Fetch player details from mock data
  fetchPlayerDetails: async (playerId: string) => {
    console.log(`Fetching mock player details for ID: ${playerId}`);

    // Try to find player in players array
    const player = players.find((p) => p.id === playerId);

    if (!player) {
      console.warn(`Player with ID ${playerId} not found in mock data`);
      // Return first player as fallback
      return players[0];
    }

    return player;
  },

  // Fetch team details from mock data
  fetchTeamDetails: async (teamId: string) => {
    console.log(`Fetching mock team details for ID: ${teamId}`);

    const team = teams.find((t) => t.id === teamId);
    if (!team) {
      console.warn(`Team with ID ${teamId} not found in mock data`);
    }

    return team || teams[0];
  },

  // Dummy methods to maintain API compatibility
  setApiKey: (newApiKey: string) => {
    toast({
      title: "Mock Mode Active",
      description: "The app is using mock data. API keys are not being used.",
    });
  },

  getApiKey: () => {
    // Return dummy key since we're not using APIs
    return "MOCK_DATA_ONLY";
  },
};
