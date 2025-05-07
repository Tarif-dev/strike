// Example of using the usePrizePool hook

import React from 'react';
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePrizePool } from '@/utils/prize-pool';
import { Loader2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PrizePoolDisplayProps = {
  matchId: string;
};

const PrizePoolDisplay: React.FC<PrizePoolDisplayProps> = ({ matchId }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  // Use our custom hook to fetch the prize pool
  const { prizePool, loading, error, refetch } = usePrizePool(
    matchId,
    connection,
    wallet
  );

  return (
    <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700 mt-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-gray-300">Total Prize Pool</h3>
          <div className="flex items-center mt-1">
            {loading ? (
              <Loader2 className="h-4 w-4 text-neon-green animate-spin mr-2" />
            ) : (
              <Trophy className="h-4 w-4 text-neon-green mr-2" />
            )}
            <span className="text-xl font-bold text-white">{prizePool} USDC</span>
          </div>
          {error && (
            <p className="text-xs text-red-400 mt-1">Failed to load prize pool data</p>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refetch}
          disabled={loading || !wallet.connected}
          className="text-neon-green border-neon-green/30 hover:bg-neon-green/10"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trophy className="h-4 w-4 mr-1" />
          )}
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>
    </div>
  );
};

export default PrizePoolDisplay;
