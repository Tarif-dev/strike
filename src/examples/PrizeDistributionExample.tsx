// Example showing how to use the prize distribution utilities
import React, { useState, useEffect } from 'react';
import { calculatePrizeDistribution, calculateTeamPrize } from '@/utils/prize-distribution';
import { processPrizeDistribution } from '@/utils/prize-transaction';
import { TeamData } from '@/types/match';
import { PrizeDistributionDisplay } from '@/components/cricket/PrizeDistributionDisplay';
import { SimplePrizePoolDisplay } from '@/components/cricket/SimplePrizePoolDisplay';
import { usePrizePool } from '@/utils/prize-pool';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PrizeDistributionExampleProps {
  matchId: string;
  teams: TeamData[];
}

export const PrizeDistributionExample: React.FC<PrizeDistributionExampleProps> = ({
  matchId,
  teams
}) => {
  const [processing, setProcessing] = useState(false);
  const [distribution, setDistribution] = useState<any>(null);
  const wallet = useWallet();
  const { connection } = useConnection();
  
  // Use our prize pool hook to get the current prize pool
  const { 
    prizePool, 
    loading: prizePoolLoading,
    error: prizePoolError,
    refetch: refetchPrizePool
  } = usePrizePool(matchId, connection, wallet);
  
  // Calculate distribution whenever teams or prize pool changes
  useEffect(() => {
    if (teams.length > 0 && prizePool) {
      // Rank teams by total points
      const rankedTeams = [...teams].sort((a, b) => {
        return (b.total_points || 0) - (a.total_points || 0);
      });
      
      // Calculate prize distribution
      const result = calculatePrizeDistribution(rankedTeams, prizePool);
      setDistribution(result);
    }
  }, [teams, prizePool]);
  
  // Handle prize distribution
  const handleDistributePrizes = async () => {
    if (!matchId || !prizePool || teams.length === 0) {
      toast({
        variant: "destructive",
        title: "Cannot Distribute Prizes",
        description: "Missing required data: match ID, prize pool, or teams",
      });
      return;
    }
    
    try {
      setProcessing(true);
      
      // Rank teams by total points
      const rankedTeams = [...teams].sort((a, b) => {
        return (b.total_points || 0) - (a.total_points || 0);
      });
      
      // Calculate distribution
      const distribution = calculatePrizeDistribution(rankedTeams, prizePool);
      
      // Process the transactions
      await processPrizeDistribution(matchId, rankedTeams, distribution);
      
      // Update UI
      setDistribution(distribution);
      
      toast({
        title: "Prizes Distributed",
        description: "Prize distribution has been processed successfully",
      });
    } catch (error) {
      console.error("Error distributing prizes:", error);
      toast({
        variant: "destructive",
        title: "Distribution Failed",
        description: error instanceof Error ? error.message : "Failed to distribute prizes",
      });
    } finally {
      setProcessing(false);
    }
  };
  
  // Find a specific team's prize
  const getTeamPrize = (teamId: string) => {
    if (!prizePool || !teams.length) return "0";
    
    const rankedTeams = [...teams].sort((a, b) => {
      return (b.total_points || 0) - (a.total_points || 0);
    });
    
    return calculateTeamPrize(teamId, rankedTeams, prizePool);
  };
  
  return (
    <div className="space-y-6">
      {/* Display the prize pool */}
      <SimplePrizePoolDisplay 
        prizePool={prizePool}
        loading={prizePoolLoading}
        error={prizePoolError}
      />
      
      {/* Display prize distribution if available */}
      {distribution && (
        <PrizeDistributionDisplay 
          distributions={distribution.distributions}
          percentages={distribution.percentages}
          amounts={distribution.amounts}
        />
      )}
      
      {/* Action button for distributing prizes */}
      <button 
        onClick={handleDistributePrizes}
        disabled={processing || !prizePool || teams.length === 0}
        className="px-4 py-2 bg-emerald-500 text-white rounded-md disabled:opacity-50"
      >
        {processing ? "Processing..." : "Distribute Prizes"}
      </button>
    </div>
  );
};
