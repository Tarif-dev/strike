import { describe, it, expect } from 'vitest';
import { calculateEnhancedPrizeDistribution } from '../enhanced-prize-distribution';
import type { TeamData } from '@/types/match';

// Test helper to create a mock team with basic fields
function createMockTeam(id: string, teamName: string, points: number, walletAddress?: string): TeamData {
  const team = {
    id,
    team_name: teamName,
    user_id: `user-${id}`,
    match_id: 'test-match',
    players: {},
    captain_id: 'captain-1',
    vice_captain_id: 'vice-captain-1',
    total_points: points,
  } as TeamData;
  
  // Add wallet address conditionally
  if (walletAddress) {
    // @ts-expect-error wallet_address is added at runtime
    team.wallet_address = walletAddress;
  }
  
  return team;
}

describe('Enhanced Prize Distribution', () => {
  it('should handle empty teams array', () => {
    const result = calculateEnhancedPrizeDistribution([], '1000');
    expect(result.distributions).toEqual([]);
    expect(result.explanation).toContain('No teams to distribute');
  });
  
  it('should distribute prizes correctly for a single participant', () => {
    const teams = [
      createMockTeam('1', 'Team Alpha', 100, 'wallet-address-1'),
    ];
    
    const result = calculateEnhancedPrizeDistribution(teams, '1000');
    
    expect(result.distributions.length).toBe(1);
    expect(result.distributions[0].wallet_address).toBe('wallet-address-1');
    expect(result.distributions[0].prize_amount).toBe(1000);
    expect(result.explanation).toContain('100% (1000.00 USDC each)');
  });
  
  it('should distribute prizes correctly for 2 participants', () => {
    const teams = [
      createMockTeam('1', 'Team Alpha', 100, 'wallet-address-1'),
      createMockTeam('2', 'Team Beta', 80, 'wallet-address-2'),
    ];
    
    const result = calculateEnhancedPrizeDistribution(teams, '1000');
    
    expect(result.distributions.length).toBe(2);
    expect(result.distributions[0].wallet_address).toBe('wallet-address-1');
    expect(result.distributions[0].prize_amount).toBe(700); // 70% of 1000
    expect(result.distributions[1].wallet_address).toBe('wallet-address-2');
    expect(result.distributions[1].prize_amount).toBe(300); // 30% of 1000
  });
  
  it('should distribute prizes correctly for 3 participants', () => {
    const teams = [
      createMockTeam('1', 'Team Alpha', 100, 'wallet-address-1'),
      createMockTeam('2', 'Team Beta', 80, 'wallet-address-2'),
      createMockTeam('3', 'Team Gamma', 60, 'wallet-address-3'),
    ];
    
    const result = calculateEnhancedPrizeDistribution(teams, '1000');
    
    expect(result.distributions.length).toBe(3);
    expect(result.distributions[0].prize_amount).toBe(500); // 50% of 1000
    expect(result.distributions[1].prize_amount).toBe(300); // 30% of 1000
    expect(result.distributions[2].prize_amount).toBe(200); // 20% of 1000
  });
  
  it('should distribute prizes correctly for many participants', () => {
    const teams = [
      createMockTeam('1', 'Team Alpha', 100, 'wallet-address-1'),
      createMockTeam('2', 'Team Beta', 90, 'wallet-address-2'),
      createMockTeam('3', 'Team Gamma', 80, 'wallet-address-3'),
      createMockTeam('4', 'Team Delta', 70, 'wallet-address-4'),
      createMockTeam('5', 'Team Epsilon', 60, 'wallet-address-5'),
      createMockTeam('6', 'Team Zeta', 50, 'wallet-address-6'),
    ];
    
    const result = calculateEnhancedPrizeDistribution(teams, '1000');
    
    expect(result.distributions.length).toBe(6);
    expect(result.distributions[0].prize_amount).toBe(400); // 40% of 1000
    expect(result.distributions[1].prize_amount).toBe(250); // 25% of 1000
    expect(result.distributions[2].prize_amount).toBe(150); // 15% of 1000
    
    // Remaining 20% distributed among positions 4-6
    expect(result.distributions.slice(3).reduce((sum, dist) => sum + dist.prize_amount, 0)).toBe(200);
  });
  
  it('should handle teams with tied scores correctly', () => {
    const teams = [
      createMockTeam('1', 'Team Alpha', 100, 'wallet-address-1'),
      createMockTeam('2', 'Team Beta', 90, 'wallet-address-2'),
      createMockTeam('3', 'Team Gamma', 90, 'wallet-address-3'), // Tied with Team Beta
      createMockTeam('4', 'Team Delta', 70, 'wallet-address-4'),
    ];
    
    const result = calculateEnhancedPrizeDistribution(teams, '1000');
    
    expect(result.distributions.length).toBe(4);
    expect(result.distributions[0].prize_amount).toBe(400); // Team Alpha: 40% of 1000
    
    // Teams Beta and Gamma tied for 2nd place - should share 2nd and 3rd place prizes (25% + 15% = 40%)
    // Each gets 20% of the total pool
    expect(result.distributions[1].prize_amount).toBe(200); 
    expect(result.distributions[2].prize_amount).toBe(200);
    
    // Team Delta gets 4th place prize
    expect(result.distributions[3].prize_amount).toBe(200);
    
    // Explanation should mention the tie handling
    expect(result.explanation).toContain('Tie handling');
    expect(result.explanation).toContain('Combined prizes for positions 2-3');
  });
  
  it('should handle 3-way ties correctly', () => {
    const teams = [
      createMockTeam('1', 'Team Alpha', 100, 'wallet-address-1'),
      createMockTeam('2', 'Team Beta', 90, 'wallet-address-2'),
      createMockTeam('3', 'Team Gamma', 90, 'wallet-address-3'), // Tied with Team Beta & Delta
      createMockTeam('4', 'Team Delta', 90, 'wallet-address-4'), // Tied with Team Beta & Gamma
    ];
    
    const result = calculateEnhancedPrizeDistribution(teams, '1000');
    
    expect(result.distributions.length).toBe(4);
    expect(result.distributions[0].prize_amount).toBe(400); // Team Alpha: 40% of 1000
    
    // Teams Beta, Gamma and Delta tied for 2nd place
    // They share 2nd, 3rd, and 4th place prizes (25% + 15% + 20% = 60%)
    // Each gets 20% of the total pool
    expect(result.distributions[1].prize_amount).toBe(200);
    expect(result.distributions[2].prize_amount).toBe(200); 
    expect(result.distributions[3].prize_amount).toBe(200);
    
    // Explanation should mention the tie handling
    expect(result.explanation).toContain('Tie handling');
    expect(result.explanation).toContain('Combined prizes for positions 2-4');
  });
  
  it('should skip teams that have no wallet address', () => {
    const teams = [
      createMockTeam('1', 'Team Alpha', 100, 'wallet-address-1'),
      createMockTeam('2', 'Team Beta', 90), // No wallet address
      createMockTeam('3', 'Team Gamma', 80, 'wallet-address-3'),
    ];
    
    const result = calculateEnhancedPrizeDistribution(teams, '1000');
    
    expect(result.distributions.length).toBe(2); // Only 2 teams get prizes
    expect(result.distributions[0].wallet_address).toBe('wallet-address-1');
    expect(result.distributions[1].wallet_address).toBe('wallet-address-3');
    
    // Explanation should mention missing wallet
    expect(result.explanation).toContain('No wallet address provided');
    expect(result.explanation).toContain('1 team(s) have no wallet address');
  });
  
  it('should handle first place tie correctly', () => {
    const teams = [
      createMockTeam('1', 'Team Alpha', 100, 'wallet-address-1'),
      createMockTeam('2', 'Team Beta', 100, 'wallet-address-2'), // Tied with Team Alpha
      createMockTeam('3', 'Team Gamma', 80, 'wallet-address-3'),
    ];
    
    const result = calculateEnhancedPrizeDistribution(teams, '1000');
    
    expect(result.distributions.length).toBe(3);
    
    // Teams Alpha and Beta tied for 1st place - should share 1st and 2nd place prizes (50% + 30% = 80%)
    // Each gets 40% of the total pool
    expect(result.distributions[0].prize_amount).toBe(400);
    expect(result.distributions[1].prize_amount).toBe(400);
    
    // Team Gamma gets 3rd place prize
    expect(result.distributions[2].prize_amount).toBe(200);
    
    // Explanation should mention the tie handling
    expect(result.explanation).toContain('Tie handling');
    expect(result.explanation).toContain('Combined prizes for positions 1-2');
  });
});
