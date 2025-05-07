import { PlayerPerformance } from '@/types/match';

// Define the scoring system
export const SCORING_RULES = {
  // Batting points
  RUN: 1,                         // 1 point per run
  BOUNDARY_BONUS: 1,              // 1 point for each boundary (4 runs)
  SIX_BONUS: 2,                   // 2 points for each six
  HALF_CENTURY_BONUS: 20,         // Bonus points for 50+ runs
  CENTURY_BONUS: 50,              // Bonus points for 100+ runs
  DUCK_PENALTY: -5,               // Points for a duck (0 runs)
  
  // Strike rate bonus/penalty (SR = runs/balls * 100)
  SR_BELOW_70_PENALTY: -6,        // Points for SR below 70
  SR_70_TO_80_PENALTY: -4,        // Points for SR between 70-80
  SR_80_TO_90_PENALTY: -2,        // Points for SR between 80-90
  SR_100_TO_120_BONUS: 2,         // Points for SR between 100-120
  SR_120_TO_140_BONUS: 4,         // Points for SR between 120-140
  SR_ABOVE_140_BONUS: 6,          // Points for SR above 140
  
  // Bowling points
  WICKET: 25,                     // Points per wicket
  LBW_BOWLED_BONUS: 8,            // Bonus points for LBW or bowled wickets
  MAIDEN_OVER: 12,                // Points per maiden over
  TWO_WICKET_HAUL: 10,            // Bonus points for 2 wickets
  THREE_WICKET_HAUL: 20,          // Bonus points for 3 wickets
  FOUR_WICKET_HAUL: 30,           // Bonus points for 4 wickets
  FIVE_WICKET_HAUL: 50,           // Bonus points for 5 wickets
  
  // Economy rate bonus/penalty (ER = runs/overs)
  ER_BELOW_5_BONUS: 6,            // +6 points for ER below 5
  ER_5_TO_6_BONUS: 4,             // +4 points for ER between 5-6
  ER_6_TO_7_BONUS: 2,             // +2 points for ER between 6-7
  ER_8_TO_9_PENALTY: -2,          // -2 points for ER between 8-9
  ER_9_TO_10_PENALTY: -4,         // -4 points for ER between 9-10
  ER_ABOVE_10_PENALTY: -6,        // -6 points for ER above 10
  
  // Fielding points
  CATCH: 8,                       // 8 points per catch
  STUMPING: 12,                   // 12 points per stumping
  RUN_OUT_DIRECT: 12,             // 12 points for direct run out
  RUN_OUT_INDIRECT: 6,            // 6 points for indirect run out
  
  // Captain and Vice-Captain multipliers
  CAPTAIN_MULTIPLIER: 2,          // Captain's points are doubled
  VICE_CAPTAIN_MULTIPLIER: 1.5    // Vice-captain's points are multiplied by 1.5
};

// Interface for the scorecard batsman data
interface BatsmanData {
  id: number;
  name: string;
  runs?: number;
  balls?: number;
  fours?: number;
  sixes?: number;
  strkRate?: string;
  outDec?: string;
  isCaptain?: boolean;
  isKeeper?: boolean;
}

// Interface for the scorecard bowler data
interface BowlerData {
  id: number;
  name: string;
  overs?: string;
  runs?: number;
  wickets?: number;
  economy?: string;
  maidens?: number;
}

// Interface for innings data
interface InningsData {
  batsman: BatsmanData[];
  bowler: BowlerData[];
}

// Interface for the complete scorecard
interface ScorecardData {
  scorecard: InningsData[];
}

/**
 * Calculate fantasy points for a player's batting performance
 */
function calculateBattingPoints(batsman: BatsmanData, rules: typeof SCORING_RULES): number {
  let points = 0;
  
  // Skip if player didn't bat (no runs or balls recorded)
  if (batsman.runs === undefined || batsman.balls === undefined) {
    return 0;
  }
  
  // Base points for runs
  points += (batsman.runs || 0) * rules.RUN;
  
  // Boundary bonus
  if (batsman.fours) {
    points += batsman.fours * rules.BOUNDARY_BONUS;
  }
  
  // Six bonus
  if (batsman.sixes) {
    points += batsman.sixes * rules.SIX_BONUS;
  }
  
  // Milestone bonuses
  if (batsman.runs >= 100) {
    points += rules.CENTURY_BONUS;
  } else if (batsman.runs >= 50) {
    points += rules.HALF_CENTURY_BONUS;
  }
  
  // Duck penalty (only if player was out for 0)
  if (batsman.runs === 0 && batsman.outDec && batsman.outDec !== "not out") {
    points += rules.DUCK_PENALTY;
  }
  
  // Strike rate bonus/penalty
  const strikeRate = batsman.balls > 0 ? (batsman.runs / batsman.balls) * 100 : 0;
  
  // Only apply strike rate points if player faced minimum 10 balls
  if (batsman.balls >= 10) {
    if (strikeRate >= 140) {
      points += rules.SR_ABOVE_140_BONUS;
    } else if (strikeRate >= 120) {
      points += rules.SR_120_TO_140_BONUS;
    } else if (strikeRate >= 100) {
      points += rules.SR_100_TO_120_BONUS;
    } else if (strikeRate < 70) {
      points += rules.SR_BELOW_70_PENALTY;
    } else if (strikeRate < 80) {
      points += rules.SR_70_TO_80_PENALTY;
    } else if (strikeRate < 90) {
      points += rules.SR_80_TO_90_PENALTY;
    }
  }
  
  return points;
}

/**
 * Calculate fantasy points for a player's bowling performance
 */
function calculateBowlingPoints(bowler: BowlerData, rules: typeof SCORING_RULES): number {
  let points = 0;
  
  // Skip if player didn't bowl
  if (!bowler.overs || bowler.overs === "0") {
    return 0;
  }
  
  // Base points for wickets
  const wickets = bowler.wickets || 0;
  points += wickets * rules.WICKET;
  
  // Maiden over bonus
  if (bowler.maidens) {
    points += bowler.maidens * rules.MAIDEN_OVER;
  }
  
  // Wicket haul bonuses (apply only the highest applicable bonus)
  if (wickets >= 5) {
    points += rules.FIVE_WICKET_HAUL;
  } else if (wickets >= 4) {
    points += rules.FOUR_WICKET_HAUL;
  } else if (wickets >= 3) {
    points += rules.THREE_WICKET_HAUL;
  } else if (wickets >= 2) {
    points += rules.TWO_WICKET_HAUL;
  }
  
  // Economy rate bonus/penalty
  // Only apply if bowler has bowled at least 2 overs
  const oversNum = parseFloat(bowler.overs);
  if (oversNum >= 2) {
    const economyRate = parseFloat(bowler.economy || "0");
    
    if (economyRate < 5) {
      points += rules.ER_BELOW_5_BONUS;
    } else if (economyRate < 6) {
      points += rules.ER_5_TO_6_BONUS;
    } else if (economyRate < 7) {
      points += rules.ER_6_TO_7_BONUS;
    } else if (economyRate > 10) {
      points += rules.ER_ABOVE_10_PENALTY;
    } else if (economyRate > 9) {
      points += rules.ER_9_TO_10_PENALTY;
    } else if (economyRate > 8) {
      points += rules.ER_8_TO_9_PENALTY;
    }
  }
  
  // LBW/Bowled bonus would require parsing the dismissal data from batsmen
  // Since that requires cross-referencing, we'll handle it separately
  
  return points;
}

/**
 * Count LBW and Bowled dismissals for a bowler based on batsmen dismissals
 */
function countLbwAndBowledDismissals(bowlerId: number, innings: InningsData[]): number {
  let count = 0;
  
  for (const inning of innings) {
    for (const batsman of inning.batsman) {
      if (batsman.outDec) {
        // Check if dismissal contains "b <bowlerName>" or "lbw b <bowlerName>"
        const dismissal = batsman.outDec.toLowerCase();
        if ((dismissal.includes("b ") || dismissal.includes("lbw b ")) && 
            dismissal.includes(bowlerId.toString())) {
          count++;
        }
      }
    }
  }
  
  return count;
}

/**
 * Calculate fielding points from outDec information
 */
function calculateFieldingPoints(
  playerId: number, 
  innings: InningsData[], 
  rules: typeof SCORING_RULES
): number {
  let points = 0;
  const playerName = findPlayerNameById(playerId, innings);
  
  if (!playerName) return 0;
  
  // Process each batsman's dismissal
  for (const inning of innings) {
    for (const batsman of inning.batsman) {
      if (!batsman.outDec) continue;
      
      const dismissal = batsman.outDec.toLowerCase();
      
      // Check for catches
      if (dismissal.includes("c ") && dismissal.includes(playerName.toLowerCase())) {
        points += rules.CATCH;
      }
      
      // Check for stumpings (usually for wicketkeepers)
      if (dismissal.includes("st ") && dismissal.includes(playerName.toLowerCase())) {
        points += rules.STUMPING;
      }
      
      // Check for run outs
      if (dismissal.includes("run out") && dismissal.includes(playerName.toLowerCase())) {
        // Determine if direct or indirect run out based on description
        // This is an approximation as the exact distinction may not be in the data
        if (dismissal.includes("direct") || !dismissal.includes("/")) {
          points += rules.RUN_OUT_DIRECT;
        } else {
          points += rules.RUN_OUT_INDIRECT;
        }
      }
    }
  }
  
  return points;
}

/**
 * Find a player's name by their ID across all innings
 */
function findPlayerNameById(playerId: number, innings: InningsData[]): string | null {
  for (const inning of innings) {
    // Check batsmen
    for (const batsman of inning.batsman) {
      if (batsman.id === playerId) {
        return batsman.name;
      }
    }
    
    // Check bowlers
    for (const bowler of inning.bowler) {
      if (bowler.id === playerId) {
        return bowler.name;
      }
    }
  }
  
  return null;
}

/**
 * Calculate total fantasy points for a player based on the scorecard
 */
export function calculatePlayerFantasyPoints(
  playerId: number,
  scorecard: ScorecardData,
  rules: typeof SCORING_RULES = SCORING_RULES
): number {
  let totalPoints = 0;
  const innings = scorecard.scorecard;
  
  // Process batting performance
  for (const inning of innings) {
    const batsman = inning.batsman.find(b => b.id === playerId);
    if (batsman) {
      totalPoints += calculateBattingPoints(batsman, rules);
    }
    
    // Process bowling performance
    const bowler = inning.bowler.find(b => b.id === playerId);
    if (bowler) {
      totalPoints += calculateBowlingPoints(bowler, rules);
      
      // Add LBW/Bowled bonus
      const lbwBowledCount = countLbwAndBowledDismissals(playerId, [inning]);
      totalPoints += lbwBowledCount * rules.LBW_BOWLED_BONUS;
    }
  }
  
  // Calculate fielding points
  totalPoints += calculateFieldingPoints(playerId, innings, rules);
  
  return totalPoints;
}

/**
 * Process scorecard and calculate points for a list of team players
 */
export function calculateTeamPoints(
  scorecard: ScorecardData,
  teamPlayers: { id: string }[],
  rules: typeof SCORING_RULES = SCORING_RULES
): { id: string; score: number }[] {
  return teamPlayers.map(player => {
    const playerId = parseInt(player.id, 10);
    const score = calculatePlayerFantasyPoints(playerId, scorecard, rules);
    
    return {
      id: player.id,
      score
    };
  });
}

/**
 * Calculate points for a player's performance using the provided scoring rules
 */
export function calcFantasyPoints(performance: PlayerPerformance, rules: typeof SCORING_RULES): number {
  let points = 0;
  
  // Batting points
  if (performance.runs !== undefined) {
    // Base run points
    points += performance.runs * rules.RUN;
    
    // Boundary bonuses
    if (performance.fours) {
      points += performance.fours * rules.BOUNDARY_BONUS;
    }
    
    if (performance.sixes) {
      points += performance.sixes * rules.SIX_BONUS;
    }
    
    // Milestone bonuses
    if (performance.runs >= 100) {
      points += rules.CENTURY_BONUS;
    } else if (performance.runs >= 50) {
      points += rules.HALF_CENTURY_BONUS;
    }
    
    // Duck penalty
    if (performance.runs === 0 && performance.balls && performance.balls > 0) {
      points += rules.DUCK_PENALTY;
    }
    
    // Strike rate bonuses/penalties
    if (performance.balls && performance.balls >= 10) {
      const strikeRate = (performance.runs / performance.balls) * 100;
      
      if (strikeRate >= 140) {
        points += rules.SR_ABOVE_140_BONUS;
      } else if (strikeRate >= 120) {
        points += rules.SR_120_TO_140_BONUS;
      } else if (strikeRate >= 100) {
        points += rules.SR_100_TO_120_BONUS;
      } else if (strikeRate < 70) {
        points += rules.SR_BELOW_70_PENALTY;
      } else if (strikeRate < 80) {
        points += rules.SR_70_TO_80_PENALTY;
      } else if (strikeRate < 90) {
        points += rules.SR_80_TO_90_PENALTY;
      }
    }
  }
  
  // Bowling points
  if (performance.wickets !== undefined) {
    // Base wicket points
    points += performance.wickets * rules.WICKET;
    
    // Wicket haul bonuses
    if (performance.wickets >= 5) {
      points += rules.FIVE_WICKET_HAUL;
    } else if (performance.wickets >= 4) {
      points += rules.FOUR_WICKET_HAUL;
    } else if (performance.wickets >= 3) {
      points += rules.THREE_WICKET_HAUL;
    } else if (performance.wickets >= 2) {
      points += rules.TWO_WICKET_HAUL;
    }
    
    // Maiden over bonus
    if (performance.maidens) {
      points += performance.maidens * rules.MAIDEN_OVER;
    }
    
    // Economy rate bonuses/penalties
    if (performance.overs && parseFloat(performance.overs) >= 2) {
      const economy = performance.economy ? parseFloat(performance.economy) : 
                     (performance.runs && performance.overs ? 
                      performance.runs / parseFloat(performance.overs) : 0);
      
      if (economy < 5) {
        points += rules.ER_BELOW_5_BONUS;
      } else if (economy < 6) {
        points += rules.ER_5_TO_6_BONUS;
      } else if (economy < 7) {
        points += rules.ER_6_TO_7_BONUS;
      } else if (economy > 10) {
        points += rules.ER_ABOVE_10_PENALTY;
      } else if (economy > 9) {
        points += rules.ER_9_TO_10_PENALTY;
      } else if (economy > 8) {
        points += rules.ER_8_TO_9_PENALTY;
      }
    }
    
    // LBW/Bowled bonus
    if (performance.lbwBowledCount) {
      points += performance.lbwBowledCount * rules.LBW_BOWLED_BONUS;
    }
  }
  
  // Fielding points
  if (performance.catches) {
    points += performance.catches * rules.CATCH;
  }
  
  if (performance.stumpings) {
    points += performance.stumpings * rules.STUMPING;
  }
  
  if (performance.runOutDirect) {
    points += performance.runOutDirect * rules.RUN_OUT_DIRECT;
  }
  
  if (performance.runOutIndirect) {
    points += performance.runOutIndirect * rules.RUN_OUT_INDIRECT;
  }
  
  return points;
}
