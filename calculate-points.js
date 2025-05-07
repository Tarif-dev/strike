// Fantasy points calculator test script
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
  RUN: 1,
  BOUNDARY_BONUS: 1,
  SIX_BONUS: 2,
  HALF_CENTURY_BONUS: 20,
  CENTURY_BONUS: 50,
  DUCK_PENALTY: -5,
  WICKET: 25,
  LBW_BOWLED_BONUS: 8,
  MAIDEN_OVER: 12,
  TWO_WICKET_HAUL: 10,
  THREE_WICKET_HAUL: 20,
  FOUR_WICKET_HAUL: 30,
  FIVE_WICKET_HAUL: 50,
  CATCH: 8,
  STUMPING: 12,
  RUN_OUT_DIRECT: 12,
  RUN_OUT_INDIRECT: 6
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
  
  // Print some stats
  log('Scorecard parsed successfully');
  log('Number of innings:', data.scorecard.length);
  
  // Pick a player and calculate their points
  const player = data.scorecard[0].batsman[0]; // Rohit Sharma
  log(`Calculating points for ${player.name}:`);
  
  // Calculate batting points
  let points = 0;
  
  // Base run points
  points += player.runs * SCORING_RULES.RUN;
  log(`Base runs: ${player.runs} * ${SCORING_RULES.RUN} = ${player.runs * SCORING_RULES.RUN}`);
  
  // Boundary bonuses
  if (player.fours) {
    const fourPoints = player.fours * SCORING_RULES.BOUNDARY_BONUS;
    points += fourPoints;
    log(`Boundaries: ${player.fours} fours * ${SCORING_RULES.BOUNDARY_BONUS} = ${fourPoints}`);
  }
  
  if (player.sixes) {
    const sixPoints = player.sixes * SCORING_RULES.SIX_BONUS;
    points += sixPoints;
    log(`Sixes: ${player.sixes} sixes * ${SCORING_RULES.SIX_BONUS} = ${sixPoints}`);
  }
  
  // Milestone bonuses
  if (player.runs >= 100) {
    points += SCORING_RULES.CENTURY_BONUS;
    log(`Century bonus: +${SCORING_RULES.CENTURY_BONUS}`);
  } else if (player.runs >= 50) {
    points += SCORING_RULES.HALF_CENTURY_BONUS;
    log(`Half-century bonus: +${SCORING_RULES.HALF_CENTURY_BONUS}`);
  }
  
  // Strike rate bonuses
  if (player.balls >= 10) {
    const strikeRate = parseFloat(player.strkRate);
    log(`Strike rate: ${strikeRate}`);
    
    if (strikeRate >= 140) {
      points += 6;
      log(`SR above 140 bonus: +6`);
    } else if (strikeRate >= 120) {
      points += 4;
      log(`SR 120-140 bonus: +4`);
    }
  }
  
  log(`\nTotal fantasy points: ${points}`);
  
  // Write output to file
  fs.writeFileSync('/Users/mustafachaiwala/strike/fantasy-points-test.txt', output.join('\n'));
  
  // Exit with success
  process.exit(0);
} catch (error) {
  log('Error:', error.message);
  // Write error output to file
  fs.writeFileSync('/Users/mustafachaiwala/strike/fantasy-points-test.txt', output.join('\n'));
  // Exit with failure code
  process.exit(1);
}
