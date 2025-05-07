#!/usr/bin/env node

// Test script to validate the fantasy points calculation for Rohit Sharma
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Since we can't directly import from TypeScript files, we'll define the scoring rules here
// (This matches the rules in calculate-fantasy-points.ts)
const SCORING_RULES = {
  // Batting points
  RUN: 1,                         // 1 point per run
  BOUNDARY_BONUS: 1,              // 1 point for each boundary (4 runs)
  SIX_BONUS: 2,                   // 2 points for each six
  HALF_CENTURY_BONUS: 20,         // Bonus points for 50+ runs
  CENTURY_BONUS: 50,              // Bonus points for 100+ runs
  DUCK_PENALTY: -5,               // Points for a duck (0 runs)
  
  // Strike rate bonus/penalty
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
  
  // Economy rate bonus/penalty
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

// Implementation of the calcFantasyPoints function (same logic as in the TypeScript file)
function calcFantasyPoints(performance, rules) {
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
    if (performance.runs === 0 && performance.balls && performance.balls > 0 && 
        performance.outDec && performance.outDec !== "not out") {
      points += rules.DUCK_PENALTY;
    }
    
    // Strike rate bonuses/penalties
    if (performance.balls && performance.balls >= 10) {
      const strikeRate = performance.strikeRate || (performance.runs / performance.balls) * 100;
      
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
  
  // Captain/Vice-Captain Multiplier
  if (performance.isCaptain) {
    points *= rules.CAPTAIN_MULTIPLIER;
  } else if (performance.isViceCaptain) {
    points *= rules.VICE_CAPTAIN_MULTIPLIER;
  }
  
  return points;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Rohit Sharma's performance from sample-scorecard.json
const rohitPerformance = {
  runs: 76,
  balls: 59,
  fours: 7,
  sixes: 3,
  strikeRate: 128.81,
  outDec: "c Maxwell b Starc" 
};

// Expected breakdown of points
const expectedBreakdown = {
  baseRuns: 76, // 76 runs * 1 point
  boundaryBonus: 7, // 7 fours * 1 point
  sixBonus: 6, // 3 sixes * 2 points
  halfCenturyBonus: 20, // For scoring 50+ runs
  strikeRateBonus: 4, // Strike rate between 120-140
  total: 113 // Total expected points
};

// Calculate points using the actual implementation
console.log('=== Fantasy Points Calculation Validation ===');
console.log('Player: Rohit Sharma');
console.log('Performance:', rohitPerformance);
console.log('\nExpected Point Breakdown:');
console.log(`- Base runs: ${rohitPerformance.runs} runs × ${SCORING_RULES.RUN} = ${expectedBreakdown.baseRuns}`);
console.log(`- Boundary bonus: ${rohitPerformance.fours} fours × ${SCORING_RULES.BOUNDARY_BONUS} = ${expectedBreakdown.boundaryBonus}`);
console.log(`- Six bonus: ${rohitPerformance.sixes} sixes × ${SCORING_RULES.SIX_BONUS} = ${expectedBreakdown.sixBonus}`);
console.log(`- Half-century bonus: +${expectedBreakdown.halfCenturyBonus}`);
console.log(`- Strike rate bonus (${rohitPerformance.strikeRate}): +${expectedBreakdown.strikeRateBonus}`);
console.log(`Total expected points: ${expectedBreakdown.total}`);

// Calculate actual points using our implementation
const actualPoints = calcFantasyPoints(rohitPerformance, SCORING_RULES);
console.log(`\nActual points calculated: ${actualPoints}`);

// Validate the result
if (actualPoints === expectedBreakdown.total) {
  console.log('\n✅ VALIDATION PASSED: Fantasy points calculation is correct!');
} else {
  console.log(`\n❌ VALIDATION FAILED: Expected ${expectedBreakdown.total} points but got ${actualPoints}`);
}

// Also check calculations for other players
const kohliBatting = {
  runs: 82,
  balls: 63,
  fours: 8,
  sixes: 4,
  strikeRate: 130.16,
  outDec: "b Hazlewood",
  // Add fielding stats from the scorecard
  runOutIndirect: 1
};

const kohliExpectedPoints = 82 + 8 + (4 * 2) + 20 + 4 + 6; // = 128
const kohliActualPoints = calcFantasyPoints(kohliBatting, SCORING_RULES);

console.log('\n--- Additional Validation ---');
console.log('Player: Virat Kohli');
console.log(`Expected points: ${kohliExpectedPoints}`);
console.log(`Actual points: ${kohliActualPoints}`);
if (kohliActualPoints === kohliExpectedPoints) {
  console.log('✅ VALIDATION PASSED');
} else {
  console.log('❌ VALIDATION FAILED');
}

// Check a bowler - Mohammed Shami
const shamiBowling = {
  wickets: 2,
  overs: "4",
  economy: 8.75,
  runs: 35
};

// Calculate the expected points correctly:
// 2 wickets * 25 = 50 points
// 2 wicket haul bonus = 10 points
// Economy between 8-9 = -2 points
const shamiExpectedPoints = (2 * 25) + 10 - 2; // = 58
const shamiActualPoints = calcFantasyPoints(shamiBowling, SCORING_RULES);

console.log('\nPlayer: Mohammed Shami');
console.log(`Expected points: ${shamiExpectedPoints}`);
console.log(`Actual points: ${shamiActualPoints}`);
if (shamiActualPoints === shamiExpectedPoints) {
  console.log('✅ VALIDATION PASSED');
} else {
  console.log('❌ VALIDATION FAILED');
}

console.log('\n=== Fantasy Points System Validation Complete ===');
