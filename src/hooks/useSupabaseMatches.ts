import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MatchData } from "@/components/cricket/MatchCard";

export const useSupabaseMatches = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);

        // Fetch matches from Supabase
        const { data, error } = await supabase
          .from("matches")
          .select("*")
          .order("registration_end_time", { ascending: false });

        if (error) {
          throw error;
        }

        // Transform the data to match the MatchData interface
        const transformedMatches: MatchData[] = data.map((match: any) => {
          // Parse match_details JSON if it exists
          const matchDetails = match.match_details || {};

          // Determine match status based on dates and is_finalized flag
          const now = new Date();
          const startTime =
            matchDetails.startTime || match.registration_end_time;
          const matchDate = new Date(startTime);
          const matchEndEstimate = new Date(matchDate);
          matchEndEstimate.setHours(matchEndEstimate.getHours() + 4); // Estimate match duration as 4 hours

          let status: "upcoming" | "live" | "completed" = "upcoming";

          if (match.is_finalized) {
            status = "completed";
          } else if (now >= matchDate && now <= matchEndEstimate) {
            status = "live";
          } else if (now > matchEndEstimate) {
            status = "completed";
          }

          return {
            id: match.match_id,
            teams: matchDetails.teams || {
              home: { name: "TBD", code: "TBD", logo: "/team_logos/tbd.jpeg" },
              away: { name: "TBD", code: "TBD", logo: "/team_logos/tbd.jpeg" },
            },
            tournament: matchDetails.tournament || {
              name: "Cricket Fantasy League",
              shortName: "CFL",
            },
            venue: matchDetails.venue || "TBD",
            startTime: startTime,
            status: status,
            result: matchDetails.result || null,
            scores: matchDetails.scores || { home: null, away: null },
            fantasy: matchDetails.fantasy || {
              contestCount: 30,
              prizePool: "5,000 USDC",
              entryFees: [49, 99, 499, 999],
              teamsCreated: 0,
              percentageJoined: 0,
              isHotMatch: match.is_active,
            },
          };
        });

        setMatches(transformedMatches);
      } catch (error: any) {
        console.error("Error fetching matches:", error);
        setError(error.message || "Failed to fetch matches");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

    // Set up real-time subscription to matches table
    const subscription = supabase
      .channel("matches_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        () => fetchMatches()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { matches, loading, error };
};
