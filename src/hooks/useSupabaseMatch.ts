import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MatchData } from "@/components/cricket/MatchCard";

/**
 * Type definition for match data from Supabase database
 */
interface SupabaseMatchData {
  match_id: string;
  admin: string;
  is_active: boolean;
  is_finalized: boolean;
  registration_end_time: string;
  match_details: {
    id?: string;
    shortId?: string;
    date?: string;
    status?: string;
    registrationEndTime?: string;
    startTime?: string;
    teams?: {
      home: {
        name: string;
        code: string;
        logo: string;
      };
      away: {
        name: string;
        code: string;
        logo: string;
      };
    };
    tournament?: {
      name: string;
      shortName: string;
    };
    venue?: string;
    result?: string | null;
    scores?: {
      home: string | null;
      away: string | null;
    };
    fantasy?: {
      contestCount: number;
      prizePool: string;
      entryFees: number[];
      teamsCreated: number;
      percentageJoined: number;
      isHotMatch: boolean;
    };
  };
  total_deposited?: number;
  bump?: number;
  token_bump?: number;
}

// Default values to use when data is missing
const DEFAULT_TEAM = { name: "TBD", code: "TBD", logo: "/team_logos/tbd.jpeg" };
const DEFAULT_TOURNAMENT = {
  name: "Cricket Fantasy League",
  shortName: "CFL",
};

/**
 * Custom hook to fetch a single match from Supabase by ID
 * @param matchId - The ID of the match to fetch
 * @returns Object containing match data, loading state, and any errors
 */
export const useSupabaseMatch = (matchId: string | null) => {
  const [match, setMatch] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't attempt to fetch if matchId is not provided
    if (!matchId) {
      setLoading(false);
      return;
    }

    const fetchMatch = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the specific match from Supabase
        const { data, error } = await supabase
          .from("matches")
          .select("*")
          .eq("match_id", matchId)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Match not found");
        }

        // Cast the data to our known type
        const matchData = data as SupabaseMatchData;

        // Parse match_details - ensure it's an object
        const matchDetails =
          typeof matchData.match_details === "object" &&
          matchData.match_details !== null
            ? matchData.match_details
            : {};

        // Determine match status based on dates and is_finalized flag
        const now = new Date();

        // Handle startTime safely, fall back to registration_end_time
        const startTime =
          matchDetails.startTime || matchData.registration_end_time;

        const matchDate = new Date(startTime);
        const matchEndEstimate = new Date(matchDate);
        matchEndEstimate.setHours(matchEndEstimate.getHours() + 4); // Estimate match duration as 4 hours

        let status: "upcoming" | "live" | "completed" = "upcoming";

        if (matchData.is_finalized) {
          status = "completed";
        } else if (now >= matchDate && now <= matchEndEstimate) {
          status = "live";
        } else if (now > matchEndEstimate) {
          status = "completed";
        }

        // Transform the data to match the MatchData interface
        const transformedMatch: MatchData = {
          id: matchData.match_id,
          teams: {
            home: matchDetails.teams?.home ?? DEFAULT_TEAM,
            away: matchDetails.teams?.away ?? DEFAULT_TEAM,
          },
          tournament: matchDetails.tournament ?? DEFAULT_TOURNAMENT,
          venue: matchDetails.venue ?? "TBD",
          startTime: startTime,
          status: status,
          result: matchDetails.result ?? null,
          scores: matchDetails.scores ?? { home: null, away: null },
          fantasy: matchDetails.fantasy ?? {
            contestCount: 30,
            prizePool: "5,000 USDC",
            entryFees: [49, 99, 499, 999],
            teamsCreated: 0,
            percentageJoined: 0,
            isHotMatch: matchData.is_active,
          },
        };

        setMatch(transformedMatch);
      } catch (err) {
        console.error("Error fetching match:", err);
        // Handle error appropriately based on type
        const errorMsg =
          err instanceof Error ? err.message : "Failed to fetch match";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();

    // Set up real-time subscription for this specific match
    const subscription = supabase
      .channel(`match_${matchId}_changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
          filter: `match_id=eq.${matchId}`,
        },
        () => fetchMatch()
      )
      .subscribe();

    // Clean up subscription when component unmounts or matchId changes
    return () => {
      subscription.unsubscribe();
    };
  }, [matchId]); // Only re-run when matchId changes

  return { match, loading, error };
};
