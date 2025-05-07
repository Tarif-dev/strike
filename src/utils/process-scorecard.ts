import { SCORING_RULES, calculatePlayerFantasyPoints } from './calculate-fantasy-points';

interface PlayerData {
  id: string;
  name: string;
  team: string;
  position: string;
  points: number;
  country: string;
}

interface BatsmanData {
  id: number;
  name: string;
  nickName?: string;
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
  nickName?: string;
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
}

interface PointsDetail {
  value: string | number;
  points: number;
}

interface PerformanceBreakdown {
  batting: {
    points: number;
    details: Record<string, PointsDetail>;
    summary?: string;
  };
  bowling: {
    points: number;
    details: Record<string, PointsDetail>;
    summary?: string;
  };
  fielding: {
    points: number;
    details: Record<string, PointsDetail>;
    summary?: string;
  };
  total: number;
  error?: string;
}

/**
 * Process scorecard and calculate fantasy points for each player in a team
 * 
 * @param scorecard The match scorecard data
 * @param teamPlayers Array of player data from the user's team
 * @returns Array of objects with player ID and calculated score
 */
export function processScorecard(
  scorecard: ScorecardData,
  teamPlayers: PlayerData[]
): { id: string; score: number; name: string; breakdown: any }[] {
  // Validate inputs
  if (!scorecard || !scorecard.scorecard || !Array.isArray(scorecard.scorecard)) {
    console.error("Invalid scorecard data format");
    return [];
  }
  
  if (!teamPlayers || !Array.isArray(teamPlayers) || teamPlayers.length === 0) {
    console.error("Invalid team players data");
    return [];
  }
  
  // Track which players were found in the scorecard
  const playerIdsFound = new Set<string>();
  
  const results = teamPlayers.map(player => {
    // Ensure player ID is valid
    if (!player.id) {
      console.warn(`Player missing ID: ${player.name || 'Unknown player'}`);
      return {
        id: player.id || '0',
        name: player.name || 'Unknown player',
        score: 0,
        breakdown: {
          batting: { points: 0, details: {} },
          bowling: { points: 0, details: {} },
          fielding: { points: 0, details: {} },
          total: 0,
          error: "Invalid player ID"
        }
      };
    }
    
    const playerId = parseInt(player.id, 10);
    
    // Check if player ID is valid number
    if (isNaN(playerId)) {
      console.warn(`Invalid player ID format: ${player.id} for ${player.name || 'Unknown player'}`);
      return {
        id: player.id,
        name: player.name || 'Unknown player',
        score: 0,
        breakdown: {
          batting: { points: 0, details: {} },
          bowling: { points: 0, details: {} },
          fielding: { points: 0, details: {} },
          total: 0,
          error: "Invalid player ID format"
        }
      };
    }
    
    // Calculate player's fantasy points
    try {
      const score = calculatePlayerFantasyPoints(playerId, scorecard);
      
      // Create performance breakdown for UI display
      const breakdown = generatePerformanceBreakdown(playerId, scorecard);
      
      // Check if player was found in the scorecard
      const playerFound = scorecard.scorecard.some(innings => {
        return innings.batsman.some(b => b.id === playerId) || 
               innings.bowler.some(b => b.id === playerId);
      });
      
      if (playerFound) {
        playerIdsFound.add(player.id);
      }
      
      return {
        id: player.id,
        name: player.name,
        score: Math.round(score * 10) / 10, // Round to 1 decimal place
        breakdown,
        notFound: !playerFound
      };
    } catch (error) {
      console.error(`Error calculating points for player ${player.name} (ID: ${player.id}):`, error);
      return {
        id: player.id,
        name: player.name || 'Unknown player',
        score: 0,
        breakdown: {
          batting: { points: 0, details: {} },
          bowling: { points: 0, details: {} },
          fielding: { points: 0, details: {} },
          total: 0,
          error: `Error calculating points: ${error.message}`
        }
      };
    }
  });
  
  // Log statistics about player matching
  console.log(`Processed ${teamPlayers.length} team players, found ${playerIdsFound.size} in the scorecard`);
  if (playerIdsFound.size < teamPlayers.length) {
    console.warn(`${teamPlayers.length - playerIdsFound.size} players were not found in the scorecard`);
  }
  
  return results;
}

/**
 * Generate a detailed breakdown of a player's performance and points
 */
function generatePerformanceBreakdown(playerId: number, scorecard: ScorecardData) {
  const breakdown: {
    batting: { points: number; details: Record<string, any>; summary?: string; };
    bowling: { points: number; details: Record<string, any>; summary?: string; };
    fielding: { points: number; details: Record<string, any>; summary?: string; };
    total: number;
    error?: string;
  } = {
    batting: { points: 0, details: {} },
    bowling: { points: 0, details: {} },
    fielding: { points: 0, details: {} },
    total: 0
  };
  
  const innings = scorecard.scorecard;
  
  // Find player in batting
  let batsmanFound = false;
  for (const inning of innings) {
    const batsman = inning.batsman.find(b => b.id === playerId);
    if (batsman) {
      batsmanFound = true;
      
      // Calculate batting points
      let battingPoints = 0;
      const details: Record<string, any> = {};
      
      // Base runs
      if (batsman.runs !== undefined) {
        details.runs = {
          value: batsman.runs,
          points: batsman.runs * SCORING_RULES.RUN
        };
        battingPoints += details.runs.points;
      }
      
      // Boundaries
      if (batsman.fours) {
        details.boundaries = {
          value: batsman.fours,
          points: batsman.fours * SCORING_RULES.BOUNDARY_BONUS
        };
        battingPoints += details.boundaries.points;
      }
      
      // Sixes
      if (batsman.sixes) {
        details.sixes = {
          value: batsman.sixes,
          points: batsman.sixes * SCORING_RULES.SIX_BONUS
        };
        battingPoints += details.sixes.points;
      }
      
      // Milestone bonuses
      if (batsman.runs && batsman.runs >= 100) {
        details.milestone = {
          value: "Century",
          points: SCORING_RULES.CENTURY_BONUS
        };
        battingPoints += details.milestone.points;
      } else if (batsman.runs && batsman.runs >= 50) {
        details.milestone = {
          value: "Half Century",
          points: SCORING_RULES.HALF_CENTURY_BONUS
        };
        battingPoints += details.milestone.points;
      }
      
      // Duck penalty
      if (batsman.runs === 0 && batsman.outDec && batsman.outDec !== "not out") {
        details.duck = {
          value: "Duck",
          points: SCORING_RULES.DUCK_PENALTY
        };
        battingPoints += details.duck.points;
      }
      
      // Strike rate bonus/penalty
      if (batsman.balls && batsman.balls >= 10 && batsman.runs !== undefined) {
        const strikeRate = (batsman.runs / batsman.balls) * 100;
        let srPoints = 0;
        let srCategory = "";
        
        if (strikeRate >= 140) {
          srPoints = SCORING_RULES.SR_ABOVE_140_BONUS;
          srCategory = "140+";
        } else if (strikeRate >= 120) {
          srPoints = SCORING_RULES.SR_120_TO_140_BONUS;
          srCategory = "120-140";
        } else if (strikeRate >= 100) {
          srPoints = SCORING_RULES.SR_100_TO_120_BONUS;
          srCategory = "100-120";
        } else if (strikeRate < 70) {
          srPoints = SCORING_RULES.SR_BELOW_70_PENALTY;
          srCategory = "Below 70";
        } else if (strikeRate < 80) {
          srPoints = SCORING_RULES.SR_70_TO_80_PENALTY;
          srCategory = "70-80";
        } else if (strikeRate < 90) {
          srPoints = SCORING_RULES.SR_80_TO_90_PENALTY;
          srCategory = "80-90";
        }
        
        if (srPoints !== 0) {
          details.strikeRate = {
            value: `${Math.round(strikeRate * 100) / 100} (${srCategory})`,
            points: srPoints
          };
          battingPoints += srPoints;
        }
      }
      
      breakdown.batting.points = battingPoints;
      breakdown.batting.details = details;
      breakdown.batting.summary = `${batsman.runs || 0} runs off ${batsman.balls || 0} balls`;
      breakdown.total += battingPoints;
    }
  }
  
  // Find player in bowling
  let bowlerFound = false;
  for (const inning of innings) {
    const bowler = inning.bowler.find(b => b.id === playerId);
    if (bowler) {
      bowlerFound = true;
      
      // Calculate bowling points
      let bowlingPoints = 0;
      const details: Record<string, any> = {};
      
      // Wickets
      if (bowler.wickets) {
        details.wickets = {
          value: bowler.wickets,
          points: bowler.wickets * SCORING_RULES.WICKET
        };
        bowlingPoints += details.wickets.points;
      }
      
      // Maidens
      if (bowler.maidens) {
        details.maidens = {
          value: bowler.maidens,
          points: bowler.maidens * SCORING_RULES.MAIDEN_OVER
        };
        bowlingPoints += details.maidens.points;
      }
      
      // Wicket haul bonuses
      if (bowler.wickets && bowler.wickets >= 5) {
        details.wicketHaul = {
          value: "5-wicket haul",
          points: SCORING_RULES.FIVE_WICKET_HAUL
        };
        bowlingPoints += details.wicketHaul.points;
      } else if (bowler.wickets && bowler.wickets >= 4) {
        details.wicketHaul = {
          value: "4-wicket haul",
          points: SCORING_RULES.FOUR_WICKET_HAUL
        };
        bowlingPoints += details.wicketHaul.points;
      } else if (bowler.wickets && bowler.wickets >= 3) {
        details.wicketHaul = {
          value: "3-wicket haul",
          points: SCORING_RULES.THREE_WICKET_HAUL
        };
        bowlingPoints += details.wicketHaul.points;
      } else if (bowler.wickets && bowler.wickets >= 2) {
        details.wicketHaul = {
          value: "2-wicket haul",
          points: SCORING_RULES.TWO_WICKET_HAUL
        };
        bowlingPoints += details.wicketHaul.points;
      }
      
      // Economy rate bonus/penalty
      if (bowler.overs && parseFloat(bowler.overs) >= 2) {
        const economy = bowler.economy ? parseFloat(bowler.economy) : 0;
        let erPoints = 0;
        let erCategory = "";
        
        if (economy < 5) {
          erPoints = SCORING_RULES.ER_BELOW_5_BONUS;
          erCategory = "Below 5";
        } else if (economy < 6) {
          erPoints = SCORING_RULES.ER_5_TO_6_BONUS;
          erCategory = "5-6";
        } else if (economy < 7) {
          erPoints = SCORING_RULES.ER_6_TO_7_BONUS;
          erCategory = "6-7";
        } else if (economy > 10) {
          erPoints = SCORING_RULES.ER_ABOVE_10_PENALTY;
          erCategory = "Above 10";
        } else if (economy > 9) {
          erPoints = SCORING_RULES.ER_9_TO_10_PENALTY;
          erCategory = "9-10";
        } else if (economy > 8) {
          erPoints = SCORING_RULES.ER_8_TO_9_PENALTY;
          erCategory = "8-9";
        }
        
        if (erPoints !== 0) {
          details.economy = {
            value: `${economy} (${erCategory})`,
            points: erPoints
          };
          bowlingPoints += erPoints;
        }
      }
      
      // Count LBW/Bowled dismissals (approximate)
      let lbwBowledCount = 0;
      for (const batter of inning.batsman) {
        if (batter.outDec) {
          const dismissal = batter.outDec.toLowerCase();
          // Check if the dismissal is by this bowler and is lbw or bowled
          if ((dismissal.includes("lbw b ") || dismissal === "b " + bowler.name.toLowerCase()) && 
              dismissal.includes(bowler.name.toLowerCase())) {
            lbwBowledCount++;
          }
        }
      }
      
      if (lbwBowledCount > 0) {
        details.lbwBowled = {
          value: lbwBowledCount,
          points: lbwBowledCount * SCORING_RULES.LBW_BOWLED_BONUS
        };
        bowlingPoints += details.lbwBowled.points;
      }
      
      breakdown.bowling.points = bowlingPoints;
      breakdown.bowling.details = details;
      breakdown.bowling.summary = `${bowler.wickets || 0}/${bowler.runs || 0} in ${bowler.overs || 0} overs`;
      breakdown.total += bowlingPoints;
    }
  }
  
  // Calculate fielding points
  let fieldingPoints = 0;
  const fieldingDetails: Record<string, any> = {};
  
  // Find player name first
  let playerName = "";
  for (const inning of innings) {
    for (const player of [...inning.batsman, ...inning.bowler]) {
      if (player.id === playerId) {
        playerName = player.name;
        break;
      }
    }
    if (playerName) break;
  }
  
  if (playerName) {
    // Count catches, stumpings, and run outs
    let catches = 0;
    let stumpings = 0;
    let runOutDirect = 0;
    let runOutIndirect = 0;
    
    for (const inning of innings) {
      for (const batsman of inning.batsman) {
        if (batsman.outDec) {
          const dismissal = batsman.outDec.toLowerCase();
          
          // Check for catches (c PlayerName b BowlerName)
          if (dismissal.includes("c ") && dismissal.includes(playerName.toLowerCase())) {
            catches++;
          }
          
          // Check for stumpings (st PlayerName b BowlerName)
          if (dismissal.includes("st ") && dismissal.includes(playerName.toLowerCase())) {
            stumpings++;
          }
          
          // Check for run outs (run out PlayerName)
          if (dismissal.includes("run out") && dismissal.includes(playerName.toLowerCase())) {
            // Simplistic distinction between direct/indirect - this could be improved with better data
            if (!dismissal.includes("/")) {
              runOutDirect++;
            } else {
              runOutIndirect++;
            }
          }
        }
      }
    }
    
    // Add fielding points to breakdown
    if (catches > 0) {
      fieldingDetails.catches = {
        value: catches,
        points: catches * SCORING_RULES.CATCH
      };
      fieldingPoints += fieldingDetails.catches.points;
    }
    
    if (stumpings > 0) {
      fieldingDetails.stumpings = {
        value: stumpings,
        points: stumpings * SCORING_RULES.STUMPING
      };
      fieldingPoints += fieldingDetails.stumpings.points;
    }
    
    if (runOutDirect > 0) {
      fieldingDetails.runOutDirect = {
        value: runOutDirect,
        points: runOutDirect * SCORING_RULES.RUN_OUT_DIRECT
      };
      fieldingPoints += fieldingDetails.runOutDirect.points;
    }
    
    if (runOutIndirect > 0) {
      fieldingDetails.runOutIndirect = {
        value: runOutIndirect,
        points: runOutIndirect * SCORING_RULES.RUN_OUT_INDIRECT
      };
      fieldingPoints += fieldingDetails.runOutIndirect.points;
    }
  }
  
  breakdown.fielding.points = fieldingPoints;
  breakdown.fielding.details = fieldingDetails;
  if (fieldingPoints > 0) {
    const fieldingSummary = [];
    if (fieldingDetails.catches) fieldingSummary.push(`${fieldingDetails.catches.value} catches`);
    if (fieldingDetails.stumpings) fieldingSummary.push(`${fieldingDetails.stumpings.value} stumpings`);
    if (fieldingDetails.runOutDirect) fieldingSummary.push(`${fieldingDetails.runOutDirect.value} direct run outs`);
    if (fieldingDetails.runOutIndirect) fieldingSummary.push(`${fieldingDetails.runOutIndirect.value} indirect run outs`);
    breakdown.fielding.summary = fieldingSummary.join(", ");
  }
  breakdown.total += fieldingPoints;
  
  return breakdown;
}

/**
 * Function to process player performance from scorecard for display
 * @param scorecard The cricket match scorecard
 */
export function processScorecardForTeam(
  scorecard: any, 
  teamPlayers: PlayerData[]
): { id: string; score: number }[] {
  if (!scorecard || !scorecard.scorecard || !Array.isArray(scorecard.scorecard)) {
    console.error("Invalid scorecard data");
    return [];
  }
  
  try {
    return processScorecard(scorecard, teamPlayers);
  } catch (error) {
    console.error("Error processing scorecard:", error);
    return [];
  }
}
