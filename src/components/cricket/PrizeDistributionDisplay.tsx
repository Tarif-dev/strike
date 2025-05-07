import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { PrizeDistributionDisplayProps } from '@/interfaces/prize-distribution';

const PrizeDistributionDisplay: React.FC<PrizeDistributionDisplayProps> = ({
  distributions,
  percentages,
  amounts,
  teamId,
  className = ''
}) => {
  // Convert distributions record to an array for sorting and display
  const distributionItems = Object.entries(distributions)
    .map(([id, distribution]) => ({
      id,
      distribution,
      percentage: percentages[id] || 0,
      amount: amounts[id] || 0,
      isCurrentTeam: id === teamId
    }))
    .sort((a, b) => b.percentage - a.percentage); // Sort by percentage, highest first

  return (
    <div className={`px-2 ${className}`}>
      <h3 className="text-sm font-semibold mb-3 flex items-center">
        <Trophy className="h-4 w-4 text-neon-green mr-2" />
        Potential Prize Distribution
      </h3>
      
      <div className="space-y-3">
        {distributionItems.map((item) => (
          <div 
            key={item.id}
            className={`p-3 rounded-lg flex justify-between items-center ${
              item.isCurrentTeam 
                ? 'bg-neon-green/10 border border-neon-green/30' 
                : 'bg-gray-800/50 border border-gray-700/50'
            }`}
          >
            <div className="flex-1">
              <p className={`font-medium ${item.isCurrentTeam ? 'text-neon-green' : 'text-white'}`}>
                {item.distribution.split(':')[0]}
                {item.isCurrentTeam && ' (Your Team)'}
              </p>
            </div>
            <div className="text-right">
              <Badge className={`${
                item.isCurrentTeam 
                  ? 'bg-neon-green/20 text-neon-green' 
                  : 'bg-gray-700 text-gray-300'
              }`}>
                {item.percentage}% ({item.amount.toFixed(2)} USDC)
              </Badge>
            </div>
          </div>
        ))}
        
        {distributionItems.length === 0 && (
          <div className="text-center py-6 text-gray-400">
            No prize distribution data available
          </div>
        )}
      </div>
    </div>
  );
};

export default PrizeDistributionDisplay;
