# Cricket Fantasy Points System - User Guide

This document provides guidance on using the fantasy points calculation system that processes player performance data from Cricbuzz API scorecards.

## Overview

The fantasy points system calculates points for cricket players based on their performance in matches. It considers:

- Batting statistics (runs, boundaries, strike rate)
- Bowling statistics (wickets, economy rate, maidens)
- Fielding contributions (catches, stumpings, run-outs)
- Special roles (captain, vice-captain)

## Core Components

The system consists of several key components:

1. **Points Calculation Engine** (`calculate-fantasy-points.ts`)
   - Defines scoring rules
   - Contains algorithms for calculating points

2. **Scorecard Processor** (`process-scorecard.ts` and `scorecard-processor.ts`)
   - Extracts player performance data from API responses
   - Converts API data into performance format

3. **Admin Interface** (`MatchDetailAdmin.tsx`)
   - Provides UI for processing scorecards
   - Shows calculated points for players

## Using the System

### Processing a Match Scorecard

To process a match scorecard and calculate fantasy points:

1. Obtain the scorecard data from the Cricbuzz API
2. Call the `processScorecard` function with the data
3. Match players from the scorecard with your team players by ID
4. Calculate points using the `calculateTeamPoints` function

```typescript
import { processScorecard } from '@/utils/process-scorecard';
import { calculateTeamPoints } from '@/utils/calculate-fantasy-points';

// Step 1: Process the scorecard
const processedData = processScorecard(scorecardData);

// Step 2: Calculate points for your team
const teamPlayersWithIds = [
  { id: '101' }, // Rohit Sharma
  { id: '102' }, // Virat Kohli
  // ... other players
];

const pointsResults = calculateTeamPoints(processedData, teamPlayersWithIds);
```

### Understanding the Scoring System

#### Batting Points

| Performance               | Points                |
|---------------------------|------------------------|
| Per run scored            | 1 point                |
| Boundary bonus (4 runs)   | +1 point (additional)  |
| Six bonus                 | +2 points (additional) |
| Half-century (50+ runs)   | +20 points            |
| Century (100+ runs)       | +50 points            |
| Duck (0 runs, dismissed)  | -5 points             |

#### Strike Rate Bonuses/Penalties (for batsmen facing 10+ balls)

| Strike Rate          | Points    |
|----------------------|-----------|
| SR ≥ 140             | +6 points |
| 120 ≤ SR < 140       | +4 points |
| 100 ≤ SR < 120       | +2 points |
| 90 ≤ SR < 100        | 0 points  |
| 80 ≤ SR < 90         | -2 points |
| 70 ≤ SR < 80         | -4 points |
| SR < 70              | -6 points |

#### Bowling Points

| Performance                | Points               |
|----------------------------|----------------------|
| Per wicket                 | 25 points            |
| LBW/Bowled dismissal       | +8 points (additional)|
| Maiden over                | +12 points           |
| 2 wicket haul              | +10 points           |
| 3 wicket haul              | +20 points           |
| 4 wicket haul              | +30 points           |
| 5+ wicket haul             | +50 points           |

#### Economy Rate Bonuses/Penalties (for bowlers bowling 2+ overs)

| Economy Rate         | Points    |
|----------------------|-----------|
| ER < 5               | +6 points |
| 5 ≤ ER < 6           | +4 points |
| 6 ≤ ER < 7           | +2 points |
| 7 ≤ ER < 8           | 0 points  |
| 8 ≤ ER < 9           | -2 points |
| 9 ≤ ER < 10          | -4 points |
| ER ≥ 10              | -6 points |

#### Fielding Points

| Performance               | Points    |
|---------------------------|-----------|
| Catch                     | 8 points  |
| Stumping                  | 12 points |
| Direct run out            | 12 points |
| Indirect run out          | 6 points  |

#### Captain/Vice-Captain

| Role                      | Points Multiplier |
|---------------------------|------------------|
| Captain                   | 2x               |
| Vice-Captain              | 1.5x             |

### Testing the System

Several test scripts are available to validate the fantasy points calculation:

1. `test-fantasy-points.js` - Basic test for points calculation
2. `calculate-points.js` - Tests points calculation for specific players
3. `full-test.js` - Processes the entire scorecard and calculates points for all players
4. `validate-fantasy-points.js` - Validates the calculation against manually verified results
5. `integration-test.js` - Runs all tests in sequence to verify the system works correctly

To run the tests:

```bash
# Run a specific test
node calculate-points.js

# Run all tests
node integration-test.js
```

## Troubleshooting

### Common Issues

1. **Player ID Mismatch**: Ensure player IDs in your team match those in the Cricbuzz scorecard. Check for any discrepancies in the ID format.

2. **Dismissal Parsing**: For fielding points, the system parses dismissal descriptions. If fielding points seem incorrect, verify the format of the dismissal descriptions in the scorecard.

3. **API Format Changes**: If the Cricbuzz API changes its response format, the scorecard processor may need updating. Monitor for any sudden changes in calculation results.

### Debugging Tips

1. Use the `test-fantasy-points.js` script to verify points calculation for individual players.

2. Check the full breakdown of points in the test output files to see exactly how points are being calculated.

3. If the calculation for a specific performance seems off, review the relevant scoring rules in `calculate-fantasy-points.ts`.

## Extending the System

To add or modify scoring rules:

1. Update the `SCORING_RULES` object in `calculate-fantasy-points.ts`.
2. Add any new calculation logic in the appropriate function.
3. Run the validation tests to ensure your changes work correctly.

Example of adding a new scoring rule:

```typescript
// Add to SCORING_RULES object
const SCORING_RULES = {
  // ... existing rules
  NEW_RULE: 10, // New rule with 10 points
};

// Implement the rule in the calculation function
if (performance.someCondition) {
  points += rules.NEW_RULE;
}
```

## Conclusion

The cricket fantasy points calculation system provides a comprehensive way to score player performances based on their contributions with the bat, ball, and in the field. By following this guide, you should be able to effectively use, test, and extend the system as needed.
