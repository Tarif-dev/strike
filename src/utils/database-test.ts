import { supabase } from "@/integrations/supabase/client";

/**
 * Utility function to test database connections and relationships
 */
export const testDatabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    const { data, error } = await supabase.from("teams").select("count(*)", { count: "exact" });
    
    if (error) {
      console.error("Error connecting to teams table:", error);
      return {
        success: false,
        error
      };
    }
    
    console.log("Successfully connected to database");
    return {
      success: true,
      data
    };
  } catch (err) {
    console.error("Exception testing database connection:", err);
    return {
      success: false,
      error: err
    };
  }
};

/**
 * Test specific match data access
 */
export const testMatchAccess = async (matchId: string) => {
  try {
    console.log(`Testing match data access for match ID: ${matchId}`);
    
    // Test if we can access match details
    const { data: matchData, error: matchError } = await supabase
      .from("matches")
      .select("*")
      .eq("match_id", matchId)
      .single();
    
    if (matchError) {
      console.error("Error accessing match data:", matchError);
      return {
        success: false,
        error: matchError
      };
    }
    
    // Test if we can access teams for this match
    const { data: teamsData, error: teamsError } = await supabase
      .from("teams")
      .select("*")
      .eq("match_id", matchId);
    
    if (teamsError) {
      console.error("Error accessing teams for match:", teamsError);
      return {
        success: false,
        error: teamsError
      };
    }
    
    return {
      success: true,
      matchData,
      teamsCount: teamsData?.length || 0
    };
  } catch (err) {
    console.error("Exception testing match access:", err);
    return {
      success: false,
      error: err
    };
  }
};
