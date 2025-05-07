# Prize Pool Utility Function

This utility provides functions to fetch the prize pool amount for a match in the fantasy cricket application.

## Direct Function Usage

To use the `fetchPrizePool` function directly:

```tsx
import { fetchPrizePool } from '@/utils/prize-pool';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

// Inside your component:
const { connection } = useConnection();
const wallet = useWallet();

// Later in your code:
const getPrizePool = async () => {
  try {
    const prizePoolAmount = await fetchPrizePool(matchId, connection, wallet);
    console.log('Prize pool amount:', prizePoolAmount, 'USDC');
    // Do something with the prize pool amount
  } catch (error) {
    console.error('Error fetching prize pool:', error);
  }
};
```

## React Hook Usage

For a more React-friendly approach, use the `usePrizePool` hook:

```tsx
import { usePrizePool } from '@/utils/prize-pool';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

// Inside your component:
const { connection } = useConnection();
const wallet = useWallet();
const { prizePool, loading, error, refetch } = usePrizePool(matchId, connection, wallet);

// Now you can use these values in your UI:
return (
  <div>
    {loading ? (
      <p>Loading prize pool...</p>
    ) : (
      <p>Prize Pool: {prizePool} USDC</p>
    )}
    <button onClick={refetch}>Refresh</button>
  </div>
);
```

## Component Usage

You can also use the ready-made `PrizePoolDisplay` component:

```tsx
import PrizePoolDisplay from '@/components/cricket/PrizePoolDisplay';

// Inside your component:
return (
  <div>
    <h2>Match Details</h2>
    {/* Other match content */}
    <PrizePoolDisplay matchId={matchId} />
  </div>
);
```

## Important Notes

1. The wallet must be connected to fetch the prize pool data
2. A valid match ID must be provided
3. The chain connection must be established
4. Error handling is built into both the function and hook
