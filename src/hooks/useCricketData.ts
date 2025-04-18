import { useQuery } from "@tanstack/react-query";
import { cricketApiService } from "@/services/cricketApi";

// Hook for fetching matches
export const useMatches = () => {
  const {
    data: matches = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      try {
        return await cricketApiService.fetchMatches();
      } catch (err) {
        console.error("Error in useMatches hook:", err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 1, // Only retry once to avoid hammering failed API calls
  });

  return {
    matches: Array.isArray(matches) ? matches : [], // Ensure we always have an array
    loading,
    error: error ? "Failed to load matches" : null,
  };
};

// Hook for fetching a single match
export const useMatch = (matchId: string) => {
  const {
    data: match = null,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => cricketApiService.fetchMatchDetails(matchId),
    staleTime: 60 * 1000, // 1 minute
    enabled: !!matchId,
  });

  return {
    match,
    loading,
    error: error ? "Failed to load match details" : null,
  };
};

// Hook for fetching players
export const usePlayers = () => {
  const {
    data: players = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["players"],
    queryFn: cricketApiService.fetchPlayers,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    players,
    loading,
    error: error ? "Failed to load players" : null,
  };
};

// Hook for fetching a single player
export const usePlayer = (playerId: string) => {
  const {
    data: player = null,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["player", playerId],
    queryFn: () => cricketApiService.fetchPlayerDetails(playerId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!playerId,
  });

  return {
    player,
    loading,
    error: error ? "Failed to load player details" : null,
  };
};
