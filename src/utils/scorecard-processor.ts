import { SCORING_RULES } from './calculate-fantasy-points';
import { processScorecardForTeam } from './process-scorecard';

// Types for the API response
interface BatsmanData {
  id: number;
  name: string;
  balls?: number;
  runs?: number;
  fours?: number;
  sixes?: number;
  strkRate?: string;
  outDec?: string;
  isCaptain?: boolean;
  isKeeper?: boolean;
}

interface BowlerData {
  id: number;
  name: string;
  overs?: string;
  maidens?: number;
  wickets?: number;
  runs?: number;
  economy?: string;
}

interface InningsData {
  batsman: BatsmanData[];
  bowler: BowlerData[];
}

interface ScorecardData {
  scorecard: InningsData[];
  status?: string;
  isMatchComplete?: boolean;
}

// Type for player performance data
export interface PlayerPerformance {
  runs?: number;
  balls?: number;
  fours?: number;
  sixes?: number;
  strike_rate?: number;
  
  wickets?: number;
  overs?: string;
  maidens?: number;
  economy?: number;
  
  catches?: number;
  stumpings?: number;
  runOutDirect?: number;
  runOutIndirect?: number;
  lbwBowledCount?: number;
}

// Type for a team player
interface TeamPlayer {
  id: string;
  name: string;
  position: string;
  team: string;
  points: number;
  country: string;
}

/**
 * Convert a cricket scorecard API response to player performance data
 */
export function convertScorecardToPerformanceData(scorecard: ScorecardData): Record<string, PlayerPerformance> {
  if (!scorecard || !scorecard.scorecard || !Array.isArray(scorecard.scorecard)) {
    console.error("Invalid scorecard data");
    return {};
  }
  
  const performanceData: Record<string, PlayerPerformance> = {};
  
  // Process all innings
  for (const innings of scorecard.scorecard) {
    // Process batsmen
    for (const batsman of innings.batsman) {
      const playerId = batsman.id.toString();
      
      // Initialize player if not exists
      if (!performanceData[playerId]) {
        performanceData[playerId] = {};
      }
      
      // Add batting performance
      performanceData[playerId].runs = batsman.runs;
      performanceData[playerId].balls = batsman.balls;
      performanceData[playerId].fours = batsman.fours;
      performanceData[playerId].sixes = batsman.sixes;
      
      // Calculate strike rate if available
      if (batsman.balls && batsman.runs && batsman.balls > 0) {
        performanceData[playerId].strike_rate = (batsman.runs / batsman.balls) * 100;
      } else if (batsman.strkRate) {
        performanceData[playerId].strike_rate = parseFloat(batsman.strkRate);
      }
    }
    
    // Process bowlers
    for (const bowler of innings.bowler) {
      const playerId = bowler.id.toString();
      
      // Initialize player if not exists
      if (!performanceData[playerId]) {
        performanceData[playerId] = {};
      }
      
      // Add bowling performance
      performanceData[playerId].wickets = bowler.wickets;
      performanceData[playerId].overs = bowler.overs;
      performanceData[playerId].maidens = bowler.maidens;
      performanceData[playerId].runs = bowler.runs;
      
      // Parse economy if available
      if (bowler.economy) {
        performanceData[playerId].economy = parseFloat(bowler.economy);
      } else if (bowler.runs && bowler.overs) {
        const overs = parseFloat(bowler.overs);
        performanceData[playerId].economy = overs > 0 ? bowler.runs / overs : 0;
      }
      
      // Count LBW/Bowled dismissals
      let lbwBowledCount = 0;
      for (const batsman of innings.batsman) {
        if (batsman.outDec) {
          const dismissal = batsman.outDec.toLowerCase();
          // Look for "b BowlerName" or "lbw b BowlerName"
          if ((dismissal.includes("b ") || dismissal.includes("lbw b ")) && 
              dismissal.includes(bowler.name.toLowerCase())) {
            lbwBowledCount++;
          }
        }
      }
      performanceData[playerId].lbwBowledCount = lbwBowledCount;
    }
    
    // Process fielding performances
    for (const batsman of innings.batsman) {
      if (!batsman.outDec) continue;
      
      const dismissal = batsman.outDec.toLowerCase();
      
      // Process catches (c Fielder b Bowler)
      if (dismissal.includes("c ")) {
        // Extract fielder name
        const match = dismissal.match(/c\s+([^b]+)\s+b/i);
        if (match && match[1]) {
          const fielderName = match[1].trim();
          
          // Find fielder ID by matching name
          const fielderId = findPlayerIdByName(fielderName, scorecard);
          if (fielderId) {
            // Add catch to fielder's performance
            if (!performanceData[fielderId]) {
              performanceData[fielderId] = {};
            }
            performanceData[fielderId].catches = (performanceData[fielderId].catches || 0) + 1;
          }
        }
      }
      
      // Process stumpings (st Keeper b Bowler)
      if (dismissal.includes("st ")) {
        // Extract keeper name
        const match = dismissal.match(/st\s+([^b]+)\s+b/i);
        if (match && match[1]) {
          const keeperName = match[1].trim();
          
          // Find keeper ID by matching name
          const keeperId = findPlayerIdByName(keeperName, scorecard);
          if (keeperId) {
            // Add stumping to keeper's performance
            if (!performanceData[keeperId]) {
              performanceData[keeperId] = {};
            }
            performanceData[keeperId].stumpings = (performanceData[keeperId].stumpings || 0) + 1;
          }
        }
      }
      
      // Process run outs (run out Fielder) or (run out Fielder/Fielder2)
      if (dismissal.includes("run out")) {
        // Extract fielder name(s)
        const match = dismissal.match(/run out\s+\(?([^/)]+)(?:\/([^/)]+))?\)?/i);
        if (match) {
          // First fielder (direct run out or first in combined)
          if (match[1]) {
            const fielderName = match[1].trim();
            const fielderId = findPlayerIdByName(fielderName, scorecard);
            
            if (fielderId) {
              if (!performanceData[fielderId]) {
                performanceData[fielderId] = {};
              }
              
              // If there's only one fielder, it's a direct run out
              if (!match[2]) {
                performanceData[fielderId].runOutDirect = (performanceData[fielderId].runOutDirect || 0) + 1;
              } else {
                performanceData[fielderId].runOutIndirect = (performanceData[fielderId].runOutIndirect || 0) + 1;
              }
            }
          }
          
          // Second fielder (indirect run out)
          if (match[2]) {
            const fielder2Name = match[2].trim();
            const fielder2Id = findPlayerIdByName(fielder2Name, scorecard);
            
            if (fielder2Id) {
              if (!performanceData[fielder2Id]) {
                performanceData[fielder2Id] = {};
              }
              performanceData[fielder2Id].runOutIndirect = (performanceData[fielder2Id].runOutIndirect || 0) + 1;
            }
          }
        }
      }
    }
  }
  
  return performanceData;
}

/**
 * Find a player's ID by matching their name in the scorecard
 */
function findPlayerIdByName(name: string, scorecard: ScorecardData): string | null {
  name = name.toLowerCase().trim();
  
  for (const innings of scorecard.scorecard) {
    // Check batsmen
    for (const batsman of innings.batsman) {
      if (batsman.name.toLowerCase().includes(name) || 
          (batsman.nickName && batsman.nickName.toLowerCase().includes(name))) {
        return batsman.id.toString();
      }
    }
    
    // Check bowlers
    for (const bowler of innings.bowler) {
      if (bowler.name.toLowerCase().includes(name) || 
          (bowler.nickName && bowler.nickName.toLowerCase().includes(name))) {
        return bowler.id.toString();
      }
    }
  }
  
  return null;
}

/**
 * Calculate fantasy points for all team players from the provided scorecard
 */
export function calculateTeamPointsFromScorecard(
  scorecard: ScorecardData,
  teamPlayers: TeamPlayer[]
): { id: string; score: number; name: string }[] {
  if (!scorecard || !scorecard.scorecard || !Array.isArray(scorecard.scorecard)) {
    console.error("Invalid scorecard data");
    return [];
  }
  
  try {
    // Convert scorecard to player performance data first
    const performanceData = convertScorecardToPerformanceData(scorecard);
    
    // Calculate points for each player
    return teamPlayers.map(player => {
      const playerId = player.id;
      const performance = performanceData[playerId] || {};
      
      // Calculate points using the scoring rules
      let points = 0;
      
      // Batting points
      if (performance.runs !== undefined) {
        // Base run points
        points += performance.runs * SCORING_RULES.RUN;
        
        // Boundary bonuses
        if (performance.fours) {
          points += performance.fours * SCORING_RULES.BOUNDARY_BONUS;
        }
        
        if (performance.sixes) {
          points += performance.sixes * SCORING_RULES.SIX_BONUS;
        }
        
        // Milestone bonuses
        if (performance.runs >= 100) {
          points += SCORING_RULES.CENTURY_BONUS;
        } else if (performance.runs >= 50) {
          points += SCORING_RULES.HALF_CENTURY_BONUS;
        }
        
        // Duck penalty
        if (performance.runs === 0 && performance.balls && performance.balls > 0) {
          points += SCORING_RULES.DUCK_PENALTY;
        }
        
        // Strike rate bonuses/penalties
        if (performance.balls && performance.balls >= 10) {
          const strikeRate = (performance.runs / performance.balls) * 100;
          
          if (strikeRate >= 140) {
            points += SCORING_RULES.SR_ABOVE_140_BONUS;
          } else if (strikeRate >= 120) {
            points += SCORING_RULES.SR_120_TO_140_BONUS;
          } else if (strikeRate >= 100) {
            points += SCORING_RULES.SR_100_TO_120_BONUS;
          } else if (strikeRate < 70) {
            points += SCORING_RULES.SR_BELOW_70_PENALTY;
          } else if (strikeRate < 80) {
            points += SCORING_RULES.SR_70_TO_80_PENALTY;
          } else if (strikeRate < 90) {
            points += SCORING_RULES.SR_80_TO_90_PENALTY;
          }
        }
      }
      
      // Bowling points
      if (performance.wickets !== undefined) {
        // Base wicket points
        points += performance.wickets * SCORING_RULES.WICKET;
        
        // Wicket haul bonuses
        if (performance.wickets >= 5) {
          points += SCORING_RULES.FIVE_WICKET_HAUL;
        } else if (performance.wickets >= 4) {
          points += SCORING_RULES.FOUR_WICKET_HAUL;
        } else if (performance.wickets >= 3) {
          points += SCORING_RULES.THREE_WICKET_HAUL;
        } else if (performance.wickets >= 2) {
          points += SCORING_RULES.TWO_WICKET_HAUL;
        }
        
        // Maiden over bonus
        if (performance.maidens) {
          points += performance.maidens * SCORING_RULES.MAIDEN_OVER;
        }
        
        // Economy rate bonuses/penalties
        if (performance.overs && parseFloat(performance.overs) >= 2) {
          const economy = performance.economy || 0;
          
          if (economy < 5) {
            points += SCORING_RULES.ER_BELOW_5_BONUS;
          } else if (economy < 6) {
            points += SCORING_RULES.ER_5_TO_6_BONUS;
          } else if (economy < 7) {
            points += SCORING_RULES.ER_6_TO_7_BONUS;
          } else if (economy > 10) {
            points += SCORING_RULES.ER_ABOVE_10_PENALTY;
          } else if (economy > 9) {
            points += SCORING_RULES.ER_9_TO_10_PENALTY;
          } else if (economy > 8) {
            points += SCORING_RULES.ER_8_TO_9_PENALTY;
          }
        }
        
        // LBW/Bowled bonus
        if (performance.lbwBowledCount) {
          points += performance.lbwBowledCount * SCORING_RULES.LBW_BOWLED_BONUS;
        }
      }
      
      // Fielding points
      if (performance.catches) {
        points += performance.catches * SCORING_RULES.CATCH;
      }
      
      if (performance.stumpings) {
        points += performance.stumpings * SCORING_RULES.STUMPING;
      }
      
      if (performance.runOutDirect) {
        points += performance.runOutDirect * SCORING_RULES.RUN_OUT_DIRECT;
      }
      
      if (performance.runOutIndirect) {
        points += performance.runOutIndirect * SCORING_RULES.RUN_OUT_INDIRECT;
      }
      
      return {
        id: player.id,
        name: player.name,
        score: Math.round(points * 10) / 10 // Round to 1 decimal place
      };
    });
  } catch (error) {
    console.error("Error calculating team points from scorecard:", error);
    return [];
  }
}
