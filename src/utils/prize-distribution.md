# Prize Distribution and Prize Pool Utilities

This document describes the utility functions created for handling prize pool calculation and prize distribution in the fantasy cricket app.

## Prize Pool Utilities

The `prize-pool.ts` file contains utilities for fetching and displaying the prize pool for a match:

### fetchPrizePool

```typescript
const fetchPrizePool = async (
  matchId: string,
  connection: Connection, 
  wallet: WalletContextState
): Promise<string>
```

**Description:** Fetches the total prize pool amount for a match from the blockchain.

**Parameters:**
- `matchId`: The ID of the match
- `connection`: Solana connection object
- `wallet`: Wallet context state

**Returns:** A string representing the total prize pool in USDC

### usePrizePool (React Hook)

```typescript
const usePrizePool = (
  matchId: string | undefined,
  connection: Connection | null, 
  wallet: WalletContextState
): { prizePool: string | null; loading: boolean; error: string | null }
```

**Description:** A React hook for conveniently fetching the prize pool in React components.

**Parameters:** Same as `fetchPrizePool`

**Returns:** An object with:
- `prizePool`: The prize pool amount (string) or null
- `loading`: Boolean indicating if the prize pool is being fetched
- `error`: Error message or null

## Prize Distribution Utilities

The `prize-distribution.ts` file contains utilities for calculating prize distribution:

### calculatePrizeDistribution

```typescript
const calculatePrizeDistribution = (
  rankedTeams: TeamData[],
  prizePool: string
): PrizeDistributionResult
```

**Description:** Calculates how the prize pool should be distributed among ranked teams. Handles different scenarios:

1. **Single participant:** Gets 100% of the prize pool
2. **Two participants:**
   - If tied, each gets 50%
   - If not tied, first place gets
   - 70%, second place gets 30%
3. **Multiple participants (3+):**
   - Handles positions and ties at any position
   - First place (or tied first): ~50%
   - Second place (or tied second): ~25%
   - Third place (or tied third): ~15%
   - Fourth and Fifth: ~10% combined
   - Remaining positions: share the remainder evenly

**Parameters:**
- `rankedTeams`: Array of team data, ranked by points (highest first)
- `prizePool`: Total prize pool as a string (e.g., "1000")

**Returns:** An object containing:
- `distributions`: Record mapping team IDs to readable distribution strings
- `percentages`: Record mapping team IDs to numerical percentage values
- `amounts`: Record mapping team IDs to actual prize amounts
- `message`: A formatted string representing all distributions

### PrizeDistributionResult Interface

```typescript
interface PrizeDistributionResult {
  distributions: Record<string, string>;
  message: string;
  percentages: Record<string, number>;
  amounts: Record<string, number>;
}
```

### calculateTeamPrize

```typescript
const calculateTeamPrize = (
  teamId: string,
  rankedTeams: TeamData[],
  prizePool: string
): string
```

**Description:** Calculates the prize amount for a specific team based on its position

**Parameters:**
- `teamId`: The ID of the team to get prize info for
- `rankedTeams`: Array of team data, ranked by points
- `prizePool`: Total prize pool amount

**Returns:** A string representing the prize amount for the team

## Prize Transaction Utilities

The `prize-transaction.ts` file contains the utility for processing prize distribution transactions:

### processPrizeDistribution

```typescript
const processPrizeDistribution = async (
  matchId: string,
  teams: TeamData[],
  distribution: PrizeDistributionResult
): Promise<void>
```

**Description:** Processes prize distribution transactions by:
1. Marking the match as finalized in the database
2. Recording transactions for each team in the prize_distributions table
3. In a production environment, this would integrate with blockchain transaction processing

**Parameters:**
- `matchId`: The ID of the match
- `teams`: The ranked teams list
- `distribution`: The calculated prize distribution result from `calculatePrizeDistribution`

**Returns:** A promise that resolves when distribution is complete

## UI Components

### PrizePoolDisplay

```tsx
<PrizePoolDisplay 
  prizePool={prizePool}
  loading={prizePoolLoading}
  error={prizePoolError}
/>
```

A reusable component that displays the prize pool amount with appropriate loading and error states.

### PrizeDistributionDisplay

```tsx
<PrizeDistributionDisplay 
  distributions={prizeDistribution.distributions}
  percentages={prizeDistribution.percentages}
  amounts={prizeDistribution.amounts}
  teamId={team.id} // Optional: to highlight current team
/>
```

A reusable component that visualizes the prize distribution data, with optional highlighting of the current team's prize.

## Usage Examples

### Fetching and Displaying Prize Pool

```tsx
// Import the hook
import { usePrizePool } from "@/utils/prize-pool";
import PrizePoolDisplay from "@/components/cricket/PrizePoolDisplay";

// In your component:
const { 
  prizePool, 
  loading: prizePoolLoading,
  error: prizePoolError
} = usePrizePool(matchId, connection, wallet);

// In your JSX:
<PrizePoolDisplay 
  prizePool={prizePool}
  loading={prizePoolLoading}
  error={prizePoolError}
/>
```

### Calculating and Displaying Prize Distribution

```tsx
// Import utilities
import { calculatePrizeDistribution } from "@/utils/prize-distribution";
import PrizeDistributionDisplay from "@/components/cricket/PrizeDistributionDisplay";

// Calculate prize distribution
const distribution = calculatePrizeDistribution(rankedTeams, prizePool);

// In your JSX:
<PrizeDistributionDisplay 
  distributions={distribution.distributions}
  percentages={distribution.percentages}
  amounts={distribution.amounts}
  teamId={currentTeamId} // Optional
/>
```

## Edge Cases Handled

1. **No participating teams:** Returns empty distribution
2. **Single participant:** Gets 100% of the prize
3. **Ties at any position:** Prize for that position is split evenly
4. **Multiple ties at different positions:** Correctly handles complex distributions

## Sample Distribution Scenarios

- **Solo player:** Player gets 100% of the prize pool
- **Two players (no tie):** First gets 70%, second gets 30%
- **Two players (tied):** Each gets 50%
- **Three players with ties:** For example, if two tie for first place, they split the first place share, and the third player gets the second place share
- **Multiple ties across different positions:** Handles distribution according to rules

```typescript
const calculatePrizeDistribution = (
  rankedTeams: TeamData[],
  prizePool: string
): PrizeDistributionResult
```

**Description:** Calculates prize distribution among teams based on their ranking and handles different scenarios:
- Single participant getting 100%
- Two participants with 70/30 split (or 50/50 if tied)
- Multiple participants with dynamic distribution
- Ties at any position in the leaderboard

**Parameters:**
- `rankedTeams`: Teams ranked by points in descending order
- `prizePool`: Total prize pool amount (string)

**Returns:** A `PrizeDistributionResult` object with:
- `distributions`: Record mapping team IDs to formatted prize strings
- `message`: A newline-separated string of all distributions
- `percentages`: Record mapping team IDs to their percentage of the prize
- `amounts`: Record mapping team IDs to their prize amounts

### calculateTeamPrize

```typescript
const calculateTeamPrize = (
  teamId: string,
  rankedTeams: TeamData[],
  prizePool: string
): string
```

**Description:** Calculates the prize amount for a specific team based on its position.

**Parameters:**
- `teamId`: ID of the team to calculate prize for
- `rankedTeams`: Teams ranked by points in descending order
- `prizePool`: Total prize pool amount (string)

**Returns:** The prize amount for the team in USDC (string)

## PrizePoolDisplay Component

A reusable React component that displays the prize pool for a match:

```tsx
<PrizePoolDisplay 
  matchId="match-123"
  showLabel={true}
  labelText="Prize Pool:"
  className="text-white"
/>
```

**Props:**
- `matchId`: Required - ID of the match
- `showLabel`: Optional (default: true) - Whether to show label text
- `labelText`: Optional (default: "Prize Pool:") - Label text
- `className`: Optional - Additional CSS classes

## Usage Examples

### 1. Fetching prize pool in a component:

```tsx
const { prizePool, loading, error } = usePrizePool(matchId, connection, wallet);

if (loading) return <div>Loading prize pool...</div>;
if (error) return <div>Error: {error}</div>;

return <div>Prize Pool: {prizePool} USDC</div>;
```

### 2. Calculating prize distribution:

```tsx
// Get ranked teams
const rankedTeams = [...teams].sort((a, b) => 
  (b.total_points || 0) - (a.total_points || 0)
);

// Calculate prize distribution
const { distributions, message, percentages, amounts } = 
  calculatePrizeDistribution(rankedTeams, prizePool);

// Display the distribution message
console.log(message);

// Get a specific team's prize amount
const teamPrize = amounts[teamId];
```

### 3. Using the PrizePoolDisplay component:

```tsx
<div className="match-details">
  <h2>{match.title}</h2>
  <div className="match-stats">
    <PrizePoolDisplay matchId={match.id} />
  </div>
</div>
```
