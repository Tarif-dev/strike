import { TeamData } from "@/types/match";

/**
 * Result of the prize distribution calculation
 */
export interface EnhancedPrizeDistributionResult {
  /**
   * Array of prize distributions with wallet address and amount
   */
  distributions: Array<{
    wallet_address: string;
    prize_amount: number;
  }>;
  
  /**
   * Detailed explanation of the distribution for logging or display
   */
  explanation: string;
}

/**
 * Calculate prize distribution considering ties for a cricket fantasy app
 * 
 * KEY FEATURES:
 * - Distributes prize pool for ANY number of participants (not just a fixed number)
 * - Correctly handles TIES - participants with the same score share prizes equally
 * - Works by combining prize pools for tied positions and dividing equally
 * - Provides detailed explanation of the distribution process
 * - Returns wallet addresses and amounts for direct distribution
 * 
 * Example: If 4 people tie for 2nd place, the prizes for positions 2,3,4,5 are combined
 * and divided equally among the 4 participants
 * 
 * @param teams - Teams with points and wallet addresses
 * @param totalPrizePool - Total prize pool amount as a string
 * @returns Prize distribution with wallet addresses, amounts, and explanation
 */
export function calculateEnhancedPrizeDistribution(
  teams: TeamData[],
  totalPrizePool: string
): EnhancedPrizeDistributionResult {
  if (!teams || teams.length === 0) {
    return {
      distributions: [],
      explanation: "No teams to distribute prizes to."
    };
  }

  const prizePoolAmount = parseFloat(totalPrizePool);
  
  // Generate dynamic percentage allocation based on number of participants
  function generateDynamicPercentages(totalParticipants: number): Record<number, number> {
    const percentages: Record<number, number> = {};
    
    // Base model for prize distribution
    if (totalParticipants === 1) {
      // One participant gets everything
      percentages[1] = 100;
    } else if (totalParticipants === 2) {
      // Two participants: 70-30 split
      percentages[1] = 70;
      percentages[2] = 30;
    } else if (totalParticipants === 3) {
      // Three participants: 50-30-20 split
      percentages[1] = 50;
      percentages[2] = 30;
      percentages[3] = 20;
    } else {
      // For more than 3 participants, use a sliding scale
      
      // First place always gets a significant portion
      percentages[1] = 40;
      
      // Second place gets a bit less
      percentages[2] = 25;
      
      // Third place
      percentages[3] = 15;
      
      // Calculate remaining percentage to distribute
      let remainingPercentage = 20; // 100 - 40 - 25 - 15
      
      // Distribute remaining percentage to positions 4 through last
      if (totalParticipants > 3) {
        const remainingPositions = totalParticipants - 3;
           // For positions 4 through 10, give increasingly smaller percentages
      // 4th place should get much less than 3rd place, with a decreasing percentage
      if (totalParticipants > 3) {
        // Set a fixed percentage for 4th place
        percentages[4] = 10; // 10% for 4th place
        remainingPercentage -= 10;
        
        // Distribute remaining to positions 5 through 10 with diminishing returns
        const remainingPositionsAfterFourth = Math.max(0, totalParticipants - 4);
        
        if (remainingPositionsAfterFourth > 0) {
          for (let pos = 5; pos <= Math.min(10, totalParticipants); pos++) {
            // Diminishing percentage as positions increase
            const share = remainingPercentage / remainingPositionsAfterFourth * (1.5 - (pos - 5) * 0.25);
            percentages[pos] = Number(share.toFixed(1));
            remainingPercentage -= percentages[pos];
          }
        }
      }
        
        // For positions beyond 10, distribute evenly if any percentage remains
        if (totalParticipants > 10 && remainingPercentage > 0) {
          const positionsAfter10 = totalParticipants - 10;
          const sharePerPosition = remainingPercentage / positionsAfter10;
          
          for (let pos = 11; pos <= totalParticipants; pos++) {
            percentages[pos] = Number(sharePerPosition.toFixed(1));
          }
        }
      }
    }
    
    // Normalize to ensure it adds up to exactly 100%
    const totalAllocated = Object.values(percentages).reduce((sum, val) => sum + val, 0);
    if (Math.abs(totalAllocated - 100) > 0.1) {
      // Adjust the first place percentage to balance if needed
      percentages[1] = Number((percentages[1] + (100 - totalAllocated)).toFixed(1));
    }
    
    return percentages;
  }
  
  // Generate percentages based on total number of participants
  const positionPercentages = generateDynamicPercentages(teams.length);
  
  // Sort teams by points in descending order
  const sortedTeams = [...teams].sort((a, b) => 
    (b.total_points || 0) - (a.total_points || 0)
  );
  
  // Group teams by points to identify ties
  const pointsGroups: { [points: number]: TeamData[] } = {};
  sortedTeams.forEach(team => {
    const points = team.total_points || 0;
    if (!pointsGroups[points]) {
      pointsGroups[points] = [];
    }
    pointsGroups[points].push(team);
  });
  
  // Prepare for distribution calculation
  const distributions: Array<{ wallet_address: string; prize_amount: number }> = [];
  const explanationLines: string[] = [];
  explanationLines.push(`Total Prize Pool: ${prizePoolAmount.toFixed(2)} USDC`);
  explanationLines.push('Prize Distribution:');
  
  // Track the next position to assign
  let nextPosition = 1;
  
  // Iterate through point groups from highest to lowest
  const sortedPointGroups = Object.entries(pointsGroups)
    .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])); // Sort by points descending
  
  for (const [points, teamsInGroup] of sortedPointGroups) {
    const startPosition = nextPosition;
    const endPosition = nextPosition + teamsInGroup.length - 1;
    
    // Calculate the total percentage for this group
    let totalPercentageForGroup = 0;
    for (let pos = startPosition; pos <= endPosition; pos++) {
      totalPercentageForGroup += positionPercentages[pos] || 0;
    }
    
    // Calculate per-team percentage and prize
    const percentagePerTeam = totalPercentageForGroup / teamsInGroup.length;
    const prizePerTeam = (prizePoolAmount * percentagePerTeam / 100);
    
    // Group description for logging
    const positionText = teamsInGroup.length > 1 
      ? `Positions ${startPosition}-${endPosition} (tied)` 
      : `Position ${startPosition}`;
    
    explanationLines.push(
      `${positionText}: ${teamsInGroup.length} team(s) with ${points} points each receive ${percentagePerTeam.toFixed(2)}% (${prizePerTeam.toFixed(2)} USDC each)`
    );
    
    // Add detailed explanation of how the prize was calculated for tied positions
    if (teamsInGroup.length > 1) {
      const positionsList = Array.from({ length: teamsInGroup.length }, (_, i) => startPosition + i);
      const originalPercentages = positionsList.map(pos => `${positionPercentages[pos] || 0}% for position ${pos}`).join(', ');
      
      explanationLines.push(
        `  Tie handling: Combined prizes for positions ${startPosition}-${endPosition} (${originalPercentages}) and divided equally`
      );
    }
    
    // Distribute to each team in this group
    teamsInGroup.forEach(team => {
      // Check if the team object has a wallet_address property
      // @ts-expect-error - wallet_address might be added at runtime
      const walletAddress = team.wallet_address;
      
      // Only add if wallet address exists
      if (walletAddress) {
        distributions.push({
          wallet_address: walletAddress,
          prize_amount: prizePerTeam
        });
        
        explanationLines.push(
          `  - ${team.team_name}: ${prizePerTeam.toFixed(2)} USDC to wallet ${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 4)}`
        );
      } else {
        explanationLines.push(
          `  - ${team.team_name}: No wallet address provided, cannot distribute ${prizePerTeam.toFixed(2)} USDC`
        );
      }
    });
    
    // Update next position
    nextPosition += teamsInGroup.length;
  }
  
  // Add summary of allocated prizes
  const totalDistributed = distributions.reduce((sum, dist) => sum + dist.prize_amount, 0);
  explanationLines.push('');
  explanationLines.push(`Total Allocated: ${totalDistributed.toFixed(2)} USDC (${((totalDistributed / prizePoolAmount) * 100).toFixed(2)}% of prize pool)`);
  
  // Add any missing wallet address information
  // @ts-expect-error - wallet_address might be added at runtime
  const teamsWithoutWallets = sortedTeams.filter(team => !team.wallet_address).length;
  if (teamsWithoutWallets > 0) {
    explanationLines.push(`Note: ${teamsWithoutWallets} team(s) have no wallet address and cannot receive prizes`);
  }
  
  return {
    distributions,
    explanation: explanationLines.join('\n')
  };
}
