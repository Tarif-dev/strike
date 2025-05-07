// Helper function to calculate player points from performance data
export const calculatePlayerPoints = (performance: any, scoringRules: any): number => {
  if (!performance) return 0;
  
  let points = 0;
  
  // Batting points
  if (performance.runs) {
    // Runs
    points += performance.runs * scoringRules.BATTING.RUN;
    
    // Bonuses for 50s and 100s
    if (performance.runs >= 100) {
      points += scoringRules.BATTING.HUNDRED;
    } else if (performance.runs >= 50) {
      points += scoringRules.BATTING.FIFTY;
    }
    
    // Fours
    if (performance.fours) {
      points += performance.fours * scoringRules.BATTING.FOUR;
    }
    
    // Sixes
    if (performance.sixes) {
      points += performance.sixes * scoringRules.BATTING.SIX;
    }
    
    // Strike rate bonus
    if (performance.strike_rate && performance.balls && performance.balls >= 10) {
      if (performance.strike_rate > 170) {
        points += scoringRules.BATTING.STRIKE_RATE_BONUS.GT_170;
      } else if (performance.strike_rate > 150) {
        points += scoringRules.BATTING.STRIKE_RATE_BONUS.GT_150;
      } else if (performance.strike_rate > 130) {
        points += scoringRules.BATTING.STRIKE_RATE_BONUS.GT_130;
      }
    }
    
    // Duck penalty (0 runs)
    if (performance.runs === 0 && performance.balls && performance.balls > 0) {
      points += scoringRules.BATTING.DUCK;
    }
  }
  
  // Bowling points
  if (performance.wickets) {
    // Wickets
    points += performance.wickets * scoringRules.BOWLING.WICKET;
    
    // Bonus for multiple wickets
    if (performance.wickets >= 5) {
      points += scoringRules.BOWLING.FIVE_WICKETS;
    } else if (performance.wickets >= 4) {
      points += scoringRules.BOWLING.FOUR_WICKETS;
    } else if (performance.wickets >= 3) {
      points += scoringRules.BOWLING.THREE_WICKETS;
    }
    
    // Maiden overs
    if (performance.maidens) {
      points += performance.maidens * scoringRules.BOWLING.MAIDEN_OVER;
    }
    
    // Economy rate bonuses/penalties
    if (performance.economy && performance.overs && performance.overs >= 2) {
      if (performance.economy < 5) {
        points += scoringRules.BOWLING.ECONOMY_BONUS.LT_5;
      } else if (performance.economy < 6) {
        points += scoringRules.BOWLING.ECONOMY_BONUS.LT_6;
      } else if (performance.economy < 7) {
        points += scoringRules.BOWLING.ECONOMY_BONUS.LT_7;
      } else if (performance.economy > 12) {
        points += scoringRules.BOWLING.ECONOMY_PENALTY.GT_12;
      } else if (performance.economy > 11) {
        points += scoringRules.BOWLING.ECONOMY_PENALTY.GT_11;
      } else if (performance.economy > 10) {
        points += scoringRules.BOWLING.ECONOMY_PENALTY.GT_10;
      }
    }
  }
  
  // Fielding points
  if (performance.catches) {
    points += performance.catches * scoringRules.FIELDING.CATCH;
    
    // Bonus for 3 or more catches
    if (performance.catches >= 3) {
      points += scoringRules.FIELDING.THREE_CATCHES;
    }
  }
  
  if (performance.stumpings) {
    points += performance.stumpings * scoringRules.FIELDING.STUMPING;
  }
  
  if (performance.run_outs) {
    points += performance.run_outs * scoringRules.FIELDING.RUN_OUT;
  }
  
  return points;
};

// Extract player ID safely from either string or object
export const getPlayerId = (player: any): string => {
  if (typeof player === 'string') {
    return player;
  }
  
  if (player && typeof player === 'object' && 'id' in player) {
    return player.id;
  }
  
  return String(player);
};

// Get player name safely
export const getPlayerName = (player: any): string => {
  if (typeof player === 'string') {
    return player;
  }
  
  if (player && typeof player === 'object') {
    return player.name || (player.id ? String(player.id) : "Unknown Player");
  }
  
  return "Unknown Player";
};

// Find player details by ID in a collection of teams
export const findPlayerDetails = (playerId: string, teams: any[]): { name: string; team: string; position: string } => {
  // Try to find the player in all teams data
  for (const team of teams) {
    if (!Array.isArray(team.players)) continue;
    
    // Check each player in the team
    for (const player of team.players) {
      if (typeof player === 'object' && player !== null) {
        // Handle both flattened and nested player objects
        if (player.id === playerId) {
          return {
            name: player.name ? String(player.name) : String(playerId),
            team: player.team ? String(player.team) : "unknown",
            position: player.position ? String(player.position) : "unknown"
          };
        }
      }
    }
  }
  
  // Return default values if player not found
  return {
    name: String(playerId),
    team: "unknown",
    position: "unknown"
  };
};

// Extract player IDs from a team
export const extractPlayerIds = (team: any): string[] => {
  if (!team || !Array.isArray(team.players)) {
    return [];
  }
  
  return team.players.map(player => getPlayerId(player));
};
