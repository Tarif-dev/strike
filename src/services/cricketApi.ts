import {
  players,
  matches,
  teamLogos,
  playerImages,
  countryFlags,
} from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

// RapidAPI configuration for Cricbuzz
const RAPIDAPI_BASE_URL = "https://cricbuzz-cricket2.p.rapidapi.com";
const RAPIDAPI_HOST = "cricbuzz-cricket2.p.rapidapi.com";
const RAPIDAPI_KEY = "d37917e331mshce264999a10b989p10b553jsn2453aa658d42";

// Types for API responses
// Keeping existing types for compatibility with mock data

// Helper to transform Cricbuzz API match data to our app format
const transformCricbuzzMatchData = (apiMatch: any) => {
  try {
    // Extract teams
    const homeTeam = apiMatch.team1 || {};
    const awayTeam = apiMatch.team2 || {};

    // Get team names
    const homeTeamName = homeTeam.name || homeTeam.teamName || "TBD";
    const awayTeamName = awayTeam.name || awayTeam.teamName || "TBD";
    const homeTeamCode =
      homeTeam.shortName ||
      homeTeam.teamSName ||
      homeTeamName.substring(0, 3).toUpperCase();
    const awayTeamCode =
      awayTeam.shortName ||
      awayTeam.teamSName ||
      awayTeamName.substring(0, 3).toUpperCase();

    // Determine match status
    let matchStatus: "upcoming" | "live" | "completed" = "upcoming";
    if (apiMatch.state === "In Progress" || apiMatch.status === "Live") {
      matchStatus = "live";
    } else if (
      apiMatch.state === "Complete" ||
      apiMatch.status === "Complete"
    ) {
      matchStatus = "completed";
    }

    // Format scores
    let homeScore, awayScore;

    // Try to extract scores from different possible formats
    if (apiMatch.scoreCard) {
      homeScore = apiMatch.scoreCard.teamScores?.[0]?.score
        ? `${apiMatch.scoreCard.teamScores[0].score}`
        : undefined;

      awayScore = apiMatch.scoreCard.teamScores?.[1]?.score
        ? `${apiMatch.scoreCard.teamScores[1].score}`
        : "Yet to bat";
    } else if (apiMatch.score) {
      homeScore = apiMatch.score.team1Score;
      awayScore = apiMatch.score.team2Score || "Yet to bat";
    }

    // Construct the match object with the EXACT structure expected by MatchCard
    return {
      id:
        apiMatch.matchId || apiMatch.id || String(apiMatch.matchInfo?.matchId),
      teams: {
        home: {
          name: homeTeamName,
          code: homeTeamCode,
          logo: teamLogos[homeTeamName.toLowerCase()] || "",
        },
        away: {
          name: awayTeamName,
          code: awayTeamCode,
          logo: teamLogos[awayTeamName.toLowerCase()] || "",
        },
      },
      tournament: {
        name:
          apiMatch.seriesName || apiMatch.seriesHash?.name || "Cricket Match",
        shortName: apiMatch.seriesShortName || "Match",
      },
      venue: apiMatch.venueInfo?.ground || apiMatch.venue || "TBD",
      startTime: (
        apiMatch.startTime ||
        apiMatch.matchInfo?.startDate ||
        new Date()
      ).toString(),
      status: matchStatus,
      result: apiMatch.statusText || apiMatch.status || "",
      scores: {
        home: homeScore,
        away: awayScore,
      },
      // Add fantasy data with reasonable defaults
      fantasy: {
        contestCount: Math.floor(Math.random() * 50) + 10,
        prizePool: `₹${Math.floor(Math.random() * 10) + 1} Lakh`,
        entryFees: [49, 99, 499, 999],
        teamsCreated: Math.floor(Math.random() * 100000) + 5000,
        percentageJoined: Math.floor(Math.random() * 70) + 20,
        isHotMatch: Math.random() > 0.7,
      },
    };
  } catch (error) {
    console.error("Error transforming match data:", error);
    // Return null instead of crashing
    return null;
  }
};

// Helper to transform Cricbuzz API player data to our app format
const transformCricbuzzPlayerData = (apiPlayer: any) => {
  try {
    // Map player position based on role
    let position = "Batsman";
    if (apiPlayer.role?.toLowerCase().includes("bowl")) {
      position = "Bowler";
    } else if (apiPlayer.role?.toLowerCase().includes("all")) {
      position = "All-rounder";
    }

    // Use existing player images or fallback to API provided ones
    const playerKey = Object.keys(playerImages).find((key) =>
      key
        .toLowerCase()
        .includes(apiPlayer.name?.toLowerCase().replace(/\s/g, ""))
    );
    const playerImage = playerKey
      ? playerImages[playerKey as keyof typeof playerImages]
      : apiPlayer.image || "";

    // Get country flag
    const countryKey = Object.keys(countryFlags).find(
      (key) => key.toLowerCase() === apiPlayer.country?.toLowerCase()
    );
    const countryFlag = countryKey
      ? countryFlags[countryKey as keyof typeof countryFlags]
      : "";

    return {
      id: apiPlayer.id || String(apiPlayer.playerId),
      name: apiPlayer.name,
      fullName: apiPlayer.fullName || apiPlayer.name,
      team: apiPlayer.teamName || "Team TBD",
      teamLogo: teamLogos.india, // Default, would need proper mapping
      position,
      image: playerImage,
      country: apiPlayer.country || "Unknown",
      countryFlag,
      stats: {
        matches: apiPlayer.battingStats?.matches || 0,
        runs: apiPlayer.battingStats?.runs || 0,
        wickets: apiPlayer.bowlingStats?.wickets || 0,
        average: apiPlayer.battingStats?.average || 0,
        strikeRate: apiPlayer.battingStats?.strikeRate || 0,
        economy: apiPlayer.bowlingStats?.economy || 0,
      },
      points: 0, // Calculate points if needed
    };
  } catch (error) {
    console.error("Error transforming player data:", error);
    return null;
  }
};

// API Services
export const cricketApiService = {
  // Fetch matches (live, recent, and upcoming)
  fetchMatches: async () => {
    try {
      // Get API key from localStorage or use default
      const apiKey = localStorage.getItem("cricket_api_key") || RAPIDAPI_KEY;

      // Log the API key being used (masked for security)
      console.log(
        `Using API key: ${apiKey.substring(0, 4)}...${apiKey.substring(
          apiKey.length - 4
        )}`
      );

      const options = {
        method: "GET",
        url: `${RAPIDAPI_BASE_URL}/matches/v1/recent`,
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": RAPIDAPI_HOST,
        },
      };

      // First validate if we have proper mock data to fall back to
      if (!Array.isArray(matches) || matches.length === 0) {
        console.error("Mock match data is invalid");
        return []; // Return empty array instead of invalid data
      }

      try {
        const response = await axios.request(options);

        if (response.status !== 200) {
          throw new Error(`Failed to fetch matches: Status ${response.status}`);
        }

        // Transform the data
        const matchesData = [];

        // Process type matches (international, league, etc.)
        if (response.data && response.data.typeMatches) {
          for (const typeMatch of response.data.typeMatches) {
            if (!typeMatch.seriesMatches) continue;

            for (const seriesMatch of typeMatch.seriesMatches) {
              if (
                seriesMatch.seriesAdWrapper &&
                seriesMatch.seriesAdWrapper.matches &&
                Array.isArray(seriesMatch.seriesAdWrapper.matches)
              ) {
                for (const match of seriesMatch.seriesAdWrapper.matches) {
                  const transformedMatch = transformCricbuzzMatchData(match);
                  if (transformedMatch) matchesData.push(transformedMatch);
                }
              }
            }
          }
        }

        console.log(`Transformed ${matchesData.length} matches from API`);

        // If we got valid data from API, return it, otherwise fall back to mock data
        return matchesData.length > 0 ? matchesData : matches;
      } catch (apiError) {
        console.error("API request error:", apiError);
        throw apiError; // Re-throw to be caught by outer catch
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast({
        title: "Error fetching matches",
        description: "Using mock data instead. Please check your API key.",
        variant: "destructive",
      });

      // Ensure we return valid mock data
      return Array.isArray(matches) ? matches : [];
    }
  },

  // Fetch match details
  fetchMatchDetails: async (matchId: string) => {
    try {
      // Get API key from localStorage or use default
      const apiKey = localStorage.getItem("cricket_api_key") || RAPIDAPI_KEY;

      const options = {
        method: "GET",
        url: `${RAPIDAPI_BASE_URL}/mcenter/v1/${matchId}/leanback`,
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": RAPIDAPI_HOST,
        },
      };

      const response = await axios.request(options);

      if (response.status !== 200) {
        throw new Error("Failed to fetch match details");
      }

      // Transform the match data
      const transformedMatch = transformCricbuzzMatchData({
        ...response.data.matchHeader,
        scoreCard: response.data.scoreCard,
        venue: response.data.venueInfo?.ground,
        seriesName: response.data.matchHeader?.seriesName,
      });

      return transformedMatch || matches.find((m) => m.id === matchId);
    } catch (error) {
      console.error("Error fetching match details:", error);
      toast({
        title: "Error fetching match details",
        description: "Using mock data instead. Please check your API key.",
        variant: "destructive",
      });

      // Fallback to mock data
      return matches.find((m) => m.id === matchId);
    }
  },

  // Fetch players
  fetchPlayers: async () => {
    try {
      // Get API key from localStorage or use default
      const apiKey = localStorage.getItem("cricket_api_key") || RAPIDAPI_KEY;

      // For now, use mock data as Cricbuzz API doesn't have a direct endpoint for all players
      // In a real implementation, you might need to fetch players from a specific match or team
      return players;
    } catch (error) {
      console.error("Error fetching players:", error);
      toast({
        title: "Error fetching players",
        description: "Using mock data instead. Please check your API key.",
        variant: "destructive",
      });

      // Fallback to mock data
      return players;
    }
  },

  // Fetch player details
  fetchPlayerDetails: async (playerId: string) => {
    try {
      // Get API key from localStorage or use default
      const apiKey = localStorage.getItem("cricket_api_key") || RAPIDAPI_KEY;

      const options = {
        method: "GET",
        url: `${RAPIDAPI_BASE_URL}/players/v1/${playerId}`,
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": RAPIDAPI_HOST,
        },
      };

      const response = await axios.request(options);

      if (response.status !== 200) {
        throw new Error("Failed to fetch player details");
      }

      // Transform player data
      const transformedPlayer = transformCricbuzzPlayerData(response.data);

      return transformedPlayer || players.find((p) => p.id === playerId);
    } catch (error) {
      console.error("Error fetching player details:", error);
      toast({
        title: "Error fetching player details",
        description: "Using mock data instead. Please check your API key.",
        variant: "destructive",
      });

      // Fallback to mock data
      return players.find((p) => p.id === playerId);
    }
  },

  // Set API key programmatically
  setApiKey: (newApiKey: string) => {
    localStorage.setItem("cricket_api_key", newApiKey);
    toast({
      title: "API Key Updated",
      description: "Your Cricket API key has been updated.",
    });
  },

  // Get the current API key
  getApiKey: () => {
    return localStorage.getItem("cricket_api_key") || RAPIDAPI_KEY;
  },
};
