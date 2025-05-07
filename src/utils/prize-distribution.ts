import { TeamData } from "@/types/match";
import { PrizeDistributionResult } from "@/interfaces/prize-distribution";

/**
 * Calculate prize distribution based on ranked teams and total prize pool
 * Handles different scenarios like:
 * - Single participant getting 100%
 * - Two participants with 70/30 split (or 50/50 if tied)
 * - Multiple participants with dynamic distribution
 * - Ties at any position in the leaderboard
 *
 * @param rankedTeams - Teams ranked by points in descending order
 * @param prizePool - Total prize pool amount
 * @returns Prize distribution mapping and formatted message
 */
export const calculatePrizeDistribution = (
  rankedTeams: TeamData[],
  prizePool: string
): PrizeDistributionResult => {
  const distributions: Record<string, string> = {};
  const percentages: Record<string, number> = {};
  const amounts: Record<string, number> = {};
  const prizePoolNum = Number(prizePool);
  
  // Group teams by points to handle ties
  const pointsGroups: { [points: number]: TeamData[] } = {};
  rankedTeams.forEach(team => {
    const points = team.total_points || 0;
    if (!pointsGroups[points]) {
      pointsGroups[points] = [];
    }
    pointsGroups[points].push(team);
  });
  
  // Sort points from highest to lowest
  const sortedPoints = Object.keys(pointsGroups)
    .map(Number)
    .sort((a, b) => b - a);
  
  if (rankedTeams.length === 0) {
    return { 
      distributions: {}, 
      message: "No teams to distribute prizes to.",
      percentages: {},
      amounts: {}
    };
  } else if (rankedTeams.length === 1) {
    // If only one participant, they get 100%
    const team = rankedTeams[0];
    distributions[team.id] = `${team.team_name}: 100% (${prizePool} USDC)`;
    percentages[team.id] = 100;
    amounts[team.id] = prizePoolNum;
  } else if (rankedTeams.length === 2) {
    // If two participants, 70-30 split, or 50-50 if tied
    if (rankedTeams[0].total_points === rankedTeams[1].total_points) {
      // If tie, split equally
      const prizeAmount = (prizePoolNum * 0.5);
      distributions[rankedTeams[0].id] = `${rankedTeams[0].team_name}: 50% (${prizeAmount.toFixed(2)} USDC)`;
      distributions[rankedTeams[1].id] = `${rankedTeams[1].team_name}: 50% (${prizeAmount.toFixed(2)} USDC)`;
      percentages[rankedTeams[0].id] = 50;
      percentages[rankedTeams[1].id] = 50;
      amounts[rankedTeams[0].id] = prizeAmount;
      amounts[rankedTeams[1].id] = prizeAmount;
    } else {
      // No tie, 70-30 split
      const firstPlaceAmount = (prizePoolNum * 0.7);
      const secondPlaceAmount = (prizePoolNum * 0.3);
      distributions[rankedTeams[0].id] = `${rankedTeams[0].team_name}: 70% (${firstPlaceAmount.toFixed(2)} USDC)`;
      distributions[rankedTeams[1].id] = `${rankedTeams[1].team_name}: 30% (${secondPlaceAmount.toFixed(2)} USDC)`;
      percentages[rankedTeams[0].id] = 70;
      percentages[rankedTeams[1].id] = 30;
      amounts[rankedTeams[0].id] = firstPlaceAmount;
      amounts[rankedTeams[1].id] = secondPlaceAmount;
    }
  } else {
    // For 3+ participants with possible ties
    let remainingPercentage = 100;
    let currentRank = 1;
    
    // Process each group of teams with the same points
    sortedPoints.forEach(points => {
      const teamsInGroup = pointsGroups[points];
      const teamsCount = teamsInGroup.length;
      
      let percentageForGroup = 0;
      
      if (currentRank === 1) {
        // First place or tied first place
        if (teamsCount === 1) {
          percentageForGroup = Math.min(50, remainingPercentage);
        } else {
          // Multiple teams tied for first - they share a larger portion
          percentageForGroup = Math.min(60, remainingPercentage);
        }
      } else if (currentRank === 2) {
        // Second place or tied second place
        percentageForGroup = Math.min(25, remainingPercentage);
      } else if (currentRank === 3) {
        // Third place or tied third place
        percentageForGroup = Math.min(15, remainingPercentage);
      } else if (currentRank <= 5) {
        // 4th and 5th places share a smaller portion
        percentageForGroup = Math.min(10, remainingPercentage);
      } else if (currentRank <= 10) {
        // 6th to 10th places share an even smaller portion
        percentageForGroup = Math.min(remainingPercentage, teamsCount * 1.5); // 1.5% per team up to 10th place
      } else {
        // Remaining places share what's left evenly
        percentageForGroup = remainingPercentage;
      }
      
      // Distribute the percentage among tied teams
      const percentagePerTeam = percentageForGroup / teamsCount;
      const prizePerTeam = (prizePoolNum * (percentagePerTeam / 100));
      
      teamsInGroup.forEach(team => {
        distributions[team.id] = `${team.team_name}: ${percentagePerTeam.toFixed(1)}% (${prizePerTeam.toFixed(2)} USDC)`;
        percentages[team.id] = parseFloat(percentagePerTeam.toFixed(1));
        amounts[team.id] = prizePerTeam;
      });
      
      remainingPercentage -= percentageForGroup;
      currentRank += teamsCount;
    });
  }
  
  // Generate message from distributions
  const message = Object.values(distributions).join('\n');
  
  return { distributions, message, percentages, amounts };
};

/**
 * Calculate the prize amount for a specific team based on its position
 * 
 * @param teamId - Team ID to calculate prize for
 * @param rankedTeams - Teams ranked by points
 * @param prizePool - Total prize pool
 * @returns The prize amount for the team in USDC
 */
export const calculateTeamPrize = (
  teamId: string,
  rankedTeams: TeamData[],
  prizePool: string
): string => {
  const { amounts } = calculatePrizeDistribution(rankedTeams, prizePool);
  return amounts[teamId]?.toFixed(2) || "0";
};
