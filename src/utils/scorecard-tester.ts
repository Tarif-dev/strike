// This utility file helps test the fantasy points calculation by processing sample scorecard data

import { SCORING_RULES, calculatePlayerFantasyPoints } from './calculate-fantasy-points';
import { convertScorecardToPerformanceData } from './scorecard-processor';
import fs from 'fs';
import path from 'path';

/**
 * Process a sample scorecard file and output the fantasy points
 * 
 * @param filePath Path to the JSON file containing sample scorecard data
 */
export function testScorecardProcessing(filePath: string) {
  try {
    // Read the sample scorecard file
    const scorecardData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log('Processing scorecard data...');
    
    // Convert the scorecard to player performance data
    const performanceData = convertScorecardToPerformanceData(scorecardData);
    
    console.log(`Found data for ${Object.keys(performanceData).length} players`);
    
    // Log detailed performance breakdown for each player
    for (const [playerId, performance] of Object.entries(performanceData)) {
      console.log(`\n========== Player ID: ${playerId} ==========`);
      
      // Format batting stats
      if (performance.runs !== undefined) {
        console.log(`Batting: ${performance.runs} runs from ${performance.balls} balls`);
        console.log(`Boundaries: ${performance.fours || 0} fours, ${performance.sixes || 0} sixes`);
        if (performance.strike_rate) {
          console.log(`Strike Rate: ${performance.strike_rate.toFixed(2)}`);
        }
      }
      
      // Format bowling stats
      if (performance.wickets !== undefined) {
        console.log(`Bowling: ${performance.wickets} wickets for ${performance.runs || 0} runs in ${performance.overs || 0} overs`);
        if (performance.maidens) {
          console.log(`Maidens: ${performance.maidens}`);
        }
        if (performance.economy) {
          console.log(`Economy: ${performance.economy.toFixed(2)}`);
        }
        if (performance.lbwBowledCount) {
          console.log(`LBW/Bowled: ${performance.lbwBowledCount}`);
        }
      }
      
      // Format fielding stats
      const fieldingStats = [];
      if (performance.catches) fieldingStats.push(`${performance.catches} catches`);
      if (performance.stumpings) fieldingStats.push(`${performance.stumpings} stumpings`);
      if (performance.runOutDirect) fieldingStats.push(`${performance.runOutDirect} direct run outs`);
      if (performance.runOutIndirect) fieldingStats.push(`${performance.runOutIndirect} indirect run outs`);
      
      if (fieldingStats.length > 0) {
        console.log(`Fielding: ${fieldingStats.join(', ')}`);
      }
      
      // Calculate fantasy points for this player
      const points = calculateFantasyPoints(performance);
      console.log(`Fantasy Points: ${points.toFixed(1)}`);
    }
    
    console.log('\nTest completed successfully!');
    return performanceData;
  } catch (error) {
    console.error('Error processing scorecard:', error);
    throw error;
  }
}

/**
 * Calculate fantasy points based on player performance
 */
function calculateFantasyPoints(performance: any): number {
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
  
  return points;
}

// Run the test if this file is executed directly (for testing purposes)
if (require.main === module) {
  const sampleScorecard = process.argv[2] || path.join(__dirname, '../samples/sample-scorecard.json');
  testScorecardProcessing(sampleScorecard);
}
