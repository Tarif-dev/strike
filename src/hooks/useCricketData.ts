
import { useState, useEffect } from 'react';
import { cricketApiService } from '@/services/cricketApi';

// Hook for fetching matches
export const useMatches = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const data = await cricketApiService.fetchMatches();
        setMatches(data);
        setError(null);
      } catch (err) {
        setError('Failed to load matches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return { matches, loading, error };
};

// Hook for fetching a single match
export const useMatch = (matchId: string) => {
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        const data = await cricketApiService.fetchMatchDetails(matchId);
        setMatch(data);
        setError(null);
      } catch (err) {
        setError('Failed to load match details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (matchId) {
      fetchMatch();
    }
  }, [matchId]);

  return { match, loading, error };
};

// Hook for fetching players
export const usePlayers = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const data = await cricketApiService.fetchPlayers();
        setPlayers(data);
        setError(null);
      } catch (err) {
        setError('Failed to load players');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return { players, loading, error };
};

// Hook for fetching a single player
export const usePlayer = (playerId: string) => {
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setLoading(true);
        const data = await cricketApiService.fetchPlayerDetails(playerId);
        setPlayer(data);
        setError(null);
      } catch (err) {
        setError('Failed to load player details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (playerId) {
      fetchPlayer();
    }
  }, [playerId]);

  return { player, loading, error };
};
