#!/usr/bin/env node

// Full fantasy points calculator test script
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Output capture array
const output = [];
function log(...args) {
  const message = args.join(' ');
  output.push(message);
  // Also try console.log for debugging
  console.log(message);
}

// Define the scoring rules
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the scorecard file path
const scorecardPath = join(__dirname, 'src/samples/sample-scorecard.json');

log(`Reading scorecard from: ${scorecardPath}`);

try {
  // Read the file
  const fileContent = fs.readFileSync(scorecardPath, 'utf8');
  
  // Parse JSON
  const data = JSON.parse(fileContent);
  const innings = data.scorecard;
  
  // Print some stats
  log('Scorecard parsed successfully');
  log('Number of innings:', innings.length);
  
  // Process all players and calculate their fantasy points
  const players = new Map();

  // Process batsmen
  for (const inning of innings) {
    for (const batsman of inning.batsman) {
      if (!players.has(batsman.id)) {
        players.set(batsman.id, {
          id: batsman.id,
          name: batsman.name,
          performance: {}
        });
      }
      
      const player = players.get(batsman.id);
      
      // Add batting stats
      player.performance.runs = batsman.runs;
      player.performance.balls = batsman.balls;
      player.performance.fours = batsman.fours;
      player.performance.sixes = batsman.sixes;
      player.performance.strikeRate = batsman.strkRate ? parseFloat(batsman.strkRate) : 
                                    (batsman.runs && batsman.balls ? (batsman.runs / batsman.balls) * 100 : 0);
      player.performance.outDec = batsman.outDec;
      
      // Check for captain/keeper
      if (batsman.isCaptain) {
        player.performance.isCaptain = true;
      }
      if (batsman.isKeeper) {
        player.performance.isKeeper = true;
      }
    }
  }

  // Process bowlers
  for (const inning of innings) {
    for (const bowler of inning.bowler) {
      if (!players.has(bowler.id)) {
        players.set(bowler.id, {
          id: bowler.id,
          name: bowler.name,
          performance: {}
        });
      }
      
      const player = players.get(bowler.id);
      
      // Add bowling stats
      player.performance.wickets = bowler.wickets;
      player.performance.overs = bowler.overs;
      player.performance.maidens = bowler.maidens;
      player.performance.bowlingRuns = bowler.runs;
      player.performance.economy = bowler.economy ? parseFloat(bowler.economy) : 
                                  (bowler.runs && bowler.overs ? bowler.runs / parseFloat(bowler.overs) : 0);
    }
  }

  // Process fielding stats (catches, stumpings, run outs)
  for (const inning of innings) {
    for (const batsman of inning.batsman) {
      if (!batsman.outDec) continue;
      
      const dismissal = batsman.outDec.toLowerCase();
      
      // Process catches (c Fielder b Bowler)
      if (dismissal.includes("c ")) {
        const match = dismissal.match(/c\s+([^b]+)\s+b/i);
        if (match && match[1]) {
          const fielderName = match[1].trim();
          
          // Find fielder by name
          let fielderId = null;
          for (const player of players.values()) {
            if (player.name.toLowerCase().includes(fielderName.toLowerCase())) {
              fielderId = player.id;
              break;
            }
          }
          
          if (fielderId) {
            const fielder = players.get(fielderId);
            fielder.performance.catches = (fielder.performance.catches || 0) + 1;
          }
        }
      }
      
      // Process stumpings (st Keeper b Bowler)
      if (dismissal.includes("st ")) {
        const match = dismissal.match(/st\s+([^b]+)\s+b/i);
        if (match && match[1]) {
          const keeperName = match[1].trim();
          
          // Find keeper by name
          let keeperId = null;
          for (const player of players.values()) {
            if (player.name.toLowerCase().includes(keeperName.toLowerCase())) {
              keeperId = player.id;
              break;
            }
          }
          
          if (keeperId) {
            const keeper = players.get(keeperId);
            keeper.performance.stumpings = (keeper.performance.stumpings || 0) + 1;
          }
        }
      }
      
      // Process run outs (run out Fielder) or (run out Fielder1/Fielder2)
      if (dismissal.includes("run out")) {
        const match = dismissal.match(/run out\s+\(?([^/)]+)(?:\/([^/)]+))?\)?/i);
        if (match) {
          // First fielder
          if (match[1]) {
            const fielderName = match[1].trim();
            let fielderId = null;
            
            for (const player of players.values()) {
              if (player.name.toLowerCase().includes(fielderName.toLowerCase())) {
                fielderId = player.id;
                break;
              }
            }
            
            if (fielderId) {
              const fielder = players.get(fielderId);
              
              // Direct run out if there's only one fielder
              if (!match[2]) {
                fielder.performance.runOutDirect = (fielder.performance.runOutDirect || 0) + 1;
              } else {
                fielder.performance.runOutIndirect = (fielder.performance.runOutIndirect || 0) + 1;
              }
            }
          }
          
          // Second fielder (indirect run out)
          if (match[2]) {
            const fielder2Name = match[2].trim();
            let fielder2Id = null;
            
            for (const player of players.values()) {
              if (player.name.toLowerCase().includes(fielder2Name.toLowerCase())) {
                fielder2Id = player.id;
                break;
              }
            }
            
            if (fielder2Id) {
              const fielder2 = players.get(fielder2Id);
              fielder2.performance.runOutIndirect = (fielder2.performance.runOutIndirect || 0) + 1;
            }
          }
        }
      }
    }
  }

  // Calculate LBW/Bowled dismissals for each bowler
  for (const inning of innings) {
    for (const bowler of inning.bowler) {
      const bowlerId = bowler.id;
      let lbwBowledCount = 0;
      
      for (const batsman of inning.batsman) {
        if (batsman.outDec) {
          const dismissal = batsman.outDec.toLowerCase();
          if ((dismissal.includes("lbw b ") || dismissal.startsWith("b ")) && 
              dismissal.includes(bowler.name.toLowerCase())) {
            lbwBowledCount++;
          }
        }
      }
      
      if (lbwBowledCount > 0) {
        const player = players.get(bowlerId);
        player.performance.lbwBowledCount = (player.performance.lbwBowledCount || 0) + lbwBowledCount;
      }
    }
  }

  // Calculate fantasy points for all players
  function calculateFantasyPoints(player) {
    let points = 0;
    const performance = player.performance;
    
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
      if (performance.runs === 0 && performance.balls && performance.balls > 0 && 
          performance.outDec && performance.outDec !== "not out") {
        points += SCORING_RULES.DUCK_PENALTY;
      }
      
      // Strike rate bonuses/penalties (only apply if player faced minimum 10 balls)
      if (performance.balls && performance.balls >= 10) {
        const strikeRate = performance.strikeRate || (performance.runs / performance.balls) * 100;
        
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
      
      // Wicket haul bonuses (apply only the highest applicable bonus)
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
      
      // Economy rate bonus/penalty (only if bowled at least 2 overs)
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
    
    // Captain/Vice-Captain Multiplier (if applicable)
    if (performance.isCaptain) {
      points *= SCORING_RULES.CAPTAIN_MULTIPLIER;
    } else if (performance.isViceCaptain) {
      points *= SCORING_RULES.VICE_CAPTAIN_MULTIPLIER;
    }
    
    return points;
  }

  // Calculate points for each player
  for (const player of players.values()) {
    player.points = calculateFantasyPoints(player);
  }

  // Display results
  log("\n========== FANTASY POINTS RESULTS ==========");

  // Sort players by points in descending order
  const sortedPlayers = Array.from(players.values()).sort((a, b) => b.points - a.points);

  for (const player of sortedPlayers) {
    log(`\n${player.name} (ID: ${player.id}): ${Math.round(player.points * 10) / 10} points`);
    
    // Show performance breakdown
    const performance = player.performance;
    
    if (performance.runs !== undefined) {
      log(`  Batting: ${performance.runs || 0} runs off ${performance.balls || 0} balls`);
      if (performance.fours || performance.sixes) {
        log(`  Boundaries: ${performance.fours || 0} fours, ${performance.sixes || 0} sixes`);
      }
      if (performance.strikeRate) {
        log(`  Strike Rate: ${performance.strikeRate.toFixed(2)}`);
      }
    }
    
    if (performance.wickets !== undefined) {
      log(`  Bowling: ${performance.wickets || 0} wickets for ${performance.bowlingRuns || 0} runs in ${performance.overs || '0'} overs`);
      if (performance.maidens) {
        log(`  Maidens: ${performance.maidens}`);
      }
      if (performance.economy) {
        log(`  Economy: ${performance.economy.toFixed(2)}`);
      }
      if (performance.lbwBowledCount) {
        log(`  LBW/Bowled: ${performance.lbwBowledCount}`);
      }
    }
    
    // Show fielding stats
    const fieldingStats = [];
    if (performance.catches) fieldingStats.push(`${performance.catches} catches`);
    if (performance.stumpings) fieldingStats.push(`${performance.stumpings} stumpings`);
    if (performance.runOutDirect) fieldingStats.push(`${performance.runOutDirect} direct run outs`);
    if (performance.runOutIndirect) fieldingStats.push(`${performance.runOutIndirect} indirect run outs`);
    
    if (fieldingStats.length > 0) {
      log(`  Fielding: ${fieldingStats.join(', ')}`);
    }
    
    // Show if player is captain/keeper
    if (performance.isCaptain) {
      log(`  Role: Captain (points multiplied by ${SCORING_RULES.CAPTAIN_MULTIPLIER})`);
    } else if (performance.isViceCaptain) {
      log(`  Role: Vice Captain (points multiplied by ${SCORING_RULES.VICE_CAPTAIN_MULTIPLIER})`);
    } else if (performance.isKeeper) {
      log(`  Role: Wicket Keeper`);
    }
  }
  
  // Write output to file
  fs.writeFileSync('/Users/mustafachaiwala/strike/full-fantasy-points-test.txt', output.join('\n'));
  
  // Signal success
  console.log('\nTest completed successfully!');
  process.exit(0);
} catch (error) {
  log('Error:', error.message);
  // Write error output to file
  fs.writeFileSync('/Users/mustafachaiwala/strike/full-fantasy-points-test.txt', output.join('\n'));
  // Signal failure
  console.error('Test failed!', error);
  process.exit(1);
}
