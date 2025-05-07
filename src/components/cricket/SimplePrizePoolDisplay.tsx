import React from 'react';
import { Loader2, DollarSign, AlertTriangle } from 'lucide-react';
import { PrizePoolDisplayProps } from '@/interfaces/prize-distribution';

const SimplePrizePoolDisplay: React.FC<PrizePoolDisplayProps> = ({
  prizePool,
  loading = false,
  error = null,
  className = ''
}) => {
  return (
    <div className={`p-4 rounded-lg border ${
      error ? 'border-red-500/30 bg-red-500/10' :
      'border-gray-700 bg-gray-800/50'
    } ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400">Prize Pool:</span>
        <div className="flex items-center">
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-gray-400" />
              <span className="text-gray-400">Loading...</span>
            </div>
          ) : error ? (
            <div className="flex items-center text-red-400">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span>{error}</span>
            </div>
          ) : (
            <span className="text-neon-green font-bold flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              {prizePool || "0"} USDC
            </span>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500">
        Prize pool distribution is based on final rankings
      </div>
    </div>
  );
};

export default SimplePrizePoolDisplay;
