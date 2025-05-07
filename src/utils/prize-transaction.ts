/**
 * Utility functions for processing prize distribution transactions
 */
import { supabase } from "@/integrations/supabase/client";
import { PrizeDistributionResult } from "@/interfaces/prize-distribution";
import { TeamData } from "@/types/match";
import { toast } from "@/hooks/use-toast";

/**
 * Process the prize distribution for a match
 * Records transactions in the database and would integrate with blockchain in a production environment
 * 
 * @param matchId - The ID of the match
 * @param teams - The ranked teams list
 * @param distribution - The calculated prize distribution result
 * @returns Promise that resolves when distribution is complete
 */
export const processPrizeDistribution = async (
  matchId: string,
  teams: TeamData[],
  distribution: PrizeDistributionResult
): Promise<void> => {
  try {
    // Mark match as finalized in the database
    const { error: updateError } = await supabase
      .from("matches")
      .update({
        is_finalized: true
      })
      .eq("match_id", matchId);
    
    if (updateError) throw updateError;
    
    // Process transactions for each winner
    for (const team of teams) {
      const amount = distribution.amounts[team.id];
      
      if (amount && amount > 0) {
        // Log the transaction details (in a real app, this would initiate a blockchain transaction)
        console.log(`Processing prize payout: ${amount.toFixed(2)} USDC to team ${team.team_name} (${team.id})`);
        
        // Record this in the database
        const { error: prizeError } = await supabase
          .from("prize_distributions")
          .upsert({
            match_id: matchId,
            team_id: team.id,
            user_id: team.user_id,
            amount: amount,
            percentage: distribution.percentages[team.id],
            processed_at: new Date().toISOString()
          });
        
        if (prizeError) {
          console.error(`Error recording prize for team ${team.id}:`, prizeError);
          // Continue with other teams even if one fails
        }
      }
    }
  } catch (error) {
    console.error("Error in prize distribution transaction:", error);
    throw error; // Re-throw to let the calling function handle the error
  }
};
