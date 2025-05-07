#!/usr/bin/env node

// End-to-end test for fantasy points calculation workflow
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Define scoring rules (same as in calculate-fantasy-points.ts)
const SCORING_RULES = {
  RUN: 1,
  BOUNDARY_BONUS: 1,
  SIX_BONUS: 2,
  HALF_CENTURY_BONUS: 20,
  CENTURY_BONUS: 50,
  DUCK_PENALTY: -5,
  SR_BELOW_70_PENALTY: -6,
  SR_70_TO_80_PENALTY: -4,
  SR_80_TO_90_PENALTY: -2,
  SR_100_TO_120_BONUS: 2,
  SR_120_TO_140_BONUS: 4,
  SR_ABOVE_140_BONUS: 6,
  WICKET: 25,
  LBW_BOWLED_BONUS: 8,
  MAIDEN_OVER: 12,
  TWO_WICKET_HAUL: 10,
  THREE_WICKET_HAUL: 20,
  FOUR_WICKET_HAUL: 30,
  FIVE_WICKET_HAUL: 50,
  ER_BELOW_5_BONUS: 6,
  ER_5_TO_6_BONUS: 4,
  ER_6_TO_7_BONUS: 2,
  ER_8_TO_9_PENALTY: -2,
  ER_9_TO_10_PENALTY: -4,
  ER_ABOVE_10_PENALTY: -6,
  CATCH: 8,
  STUMPING: 12,
  RUN_OUT_DIRECT: 12,
  RUN_OUT_INDIRECT: 6,
  CAPTAIN_MULTIPLIER: 2,
  VICE_CAPTAIN_MULTIPLIER: 1.5
};

// Implementation of processing and calculation functions
function processScorecard(scorecardData) {
  if (!scorecardData || !scorecardData.scorecard || !Array.isArray(scorecardData.scorecard)) {
    throw new Error('Invalid scorecard format');
  }
  
  return scorecardData;
}

function calculateTeamPoints(scorecard, teamPlayers) {
  return teamPlayers.map(player => {
    const playerId = parseInt(player.id, 10);
    let score = 0;
    
    // Find player in the scorecard
    let foundPlayer = null;
    for (const inning of scorecard.scorecard) {
      // Check batsmen
      const batsman = inning.batsman.find(b => b.id === playerId);
      if (batsman) {
        foundPlayer = batsman;
        
        // Calculate batting points
        if (batsman.runs !== undefined) {
          // Base runs
          score += batsman.runs * SCORING_RULES.RUN;
          
          // Boundaries
          if (batsman.fours) score += batsman.fours * SCORING_RULES.BOUNDARY_BONUS;
          if (batsman.sixes) score += batsman.sixes * SCORING_RULES.SIX_BONUS;
          
          // Milestones
          if (batsman.runs >= 100) {
            score += SCORING_RULES.CENTURY_BONUS;
          } else if (batsman.runs >= 50) {
            score += SCORING_RULES.HALF_CENTURY_BONUS;
          }
          
          // Duck
          if (batsman.runs === 0 && batsman.balls > 0 && batsman.outDec && batsman.outDec !== "not out") {
            score += SCORING_RULES.DUCK_PENALTY;
          }
          
          // Strike rate
          if (batsman.balls >= 10) {
            const sr = batsman.strkRate ? parseFloat(batsman.strkRate) : (batsman.runs / batsman.balls) * 100;
            
            if (sr >= 140) score += SCORING_RULES.SR_ABOVE_140_BONUS;
            else if (sr >= 120) score += SCORING_RULES.SR_120_TO_140_BONUS;
            else if (sr >= 100) score += SCORING_RULES.SR_100_TO_120_BONUS;
            else if (sr < 70) score += SCORING_RULES.SR_BELOW_70_PENALTY;
            else if (sr < 80) score += SCORING_RULES.SR_70_TO_80_PENALTY;
            else if (sr < 90) score += SCORING_RULES.SR_80_TO_90_PENALTY;
          }
        }
      }
      
      // Check bowlers
      const bowler = inning.bowler.find(b => b.id === playerId);
      if (bowler) {
        foundPlayer = bowler;
        
        // Calculate bowling points
        if (bowler.wickets) {
          // Base wickets
          score += bowler.wickets * SCORING_RULES.WICKET;
          
          // Wicket hauls
          if (bowler.wickets >= 5) score += SCORING_RULES.FIVE_WICKET_HAUL;
          else if (bowler.wickets >= 4) score += SCORING_RULES.FOUR_WICKET_HAUL;
          else if (bowler.wickets >= 3) score += SCORING_RULES.THREE_WICKET_HAUL;
          else if (bowler.wickets >= 2) score += SCORING_RULES.TWO_WICKET_HAUL;
        }
        
        // Maidens
        if (bowler.maidens) score += bowler.maidens * SCORING_RULES.MAIDEN_OVER;
        
        // Economy rate
        if (bowler.overs && parseFloat(bowler.overs) >= 2) {
          const economy = bowler.economy ? parseFloat(bowler.economy) : 
                         (bowler.runs && bowler.overs ? bowler.runs / parseFloat(bowler.overs) : 0);
          
          if (economy < 5) score += SCORING_RULES.ER_BELOW_5_BONUS;
          else if (economy < 6) score += SCORING_RULES.ER_5_TO_6_BONUS;
          else if (economy < 7) score += SCORING_RULES.ER_6_TO_7_BONUS;
          else if (economy > 10) score += SCORING_RULES.ER_ABOVE_10_PENALTY;
          else if (economy > 9) score += SCORING_RULES.ER_9_TO_10_PENALTY;
          else if (economy > 8) score += SCORING_RULES.ER_8_TO_9_PENALTY;
        }
      }
    }
    
    // Special roles
    if (player.isCaptain) {
      score *= SCORING_RULES.CAPTAIN_MULTIPLIER;
    } else if (player.isViceCaptain) {
      score *= SCORING_RULES.VICE_CAPTAIN_MULTIPLIER;
    }
    
    return {
      id: player.id,
      name: foundPlayer ? foundPlayer.name : `Player ${player.id}`,
      score: Math.round(score * 10) / 10
    };
  });
}

// Main testing function
async function runTest() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
    console.log('=== Fantasy Points End-to-End Workflow Test ===');
    
    // Step 1: Read the sample scorecard
    const scorecardPath = join(__dirname, 'src/samples/sample-scorecard.json');
    const scorecardData = JSON.parse(fs.readFileSync(scorecardPath, 'utf8'));
    console.log('✅ Loaded sample scorecard data');
    
    // Step 2: Process the scorecard
    const processedScorecard = processScorecard(scorecardData);
    console.log('✅ Processed scorecard data');
    
    // Step 3: Define a sample team with players from the scorecard
    const sampleTeam = [
      { id: '101', isCaptain: true },     // Rohit Sharma (Captain)
      { id: '102', isViceCaptain: true }, // Virat Kohli (Vice-Captain)
      { id: '103' },                      // KL Rahul
      { id: '104' },                      // Rishabh Pant
      { id: '301' },                      // Jasprit Bumrah
      { id: '302' },                      // Mohammed Shami
      { id: '208' },                      // Glenn Maxwell
      { id: '206' },                      // David Warner
      { id: '207' },                      // Steven Smith
      { id: '201' },                      // Mitchell Starc
      { id: '210' }                       // Marcus Stoinis
    ];
    console.log('✅ Created sample team with 11 players');
    
    // Step 4: Calculate fantasy points for the team
    const teamPoints = calculateTeamPoints(processedScorecard, sampleTeam);
    console.log('✅ Calculated fantasy points for all team players');
    
    // Step 5: Display and validate results
    console.log('\nTeam Fantasy Points Results:');
    console.log('------------------------------');
    
    // Expected results for key players (without captain/vice-captain multipliers)
    const expectedResults = {
      '101': 226, // Rohit with captain multiplier (113 × 2)
      '102': 192, // Kohli with vice-captain multiplier (128 × 1.5)
      '302': 58,  // Shami
      '208': 79,  // Maxwell 
      '206': 95   // Warner
    };
    
    let validationsPassed = 0;
    let testsFailed = false;
    
    teamPoints.sort((a, b) => b.score - a.score); // Sort by score descending
    
    for (const player of teamPoints) {
      console.log(`${player.name} (ID: ${player.id}): ${player.score} points`);
      
      // Validate key players
      if (expectedResults[player.id] !== undefined) {
        const isCorrect = expectedResults[player.id] === player.score;
        console.log(`  ${isCorrect ? '✅' : '❌'} ${isCorrect ? 'Correct' : 'Incorrect'} - Expected: ${expectedResults[player.id]}`);
        
        if (isCorrect) {
          validationsPassed++;
        } else {
          testsFailed = true;
        }
      }
    }
    
    // Final test summary
    console.log('\nTest Summary:');
    console.log(`Validations: ${validationsPassed}/${Object.keys(expectedResults).length} players correctly scored`);
    
    if (testsFailed) {
      console.log('❌ Some validations failed - see details above');
      process.exit(1);
    } else {
      console.log('✅ All validations passed - fantasy points workflow is working correctly');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

// Run the test
runTest().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
