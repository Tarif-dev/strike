import React from "react";
import { motion } from "framer-motion";
import { FileKey, Users, Clock, DollarSign } from "lucide-react";

interface ZkCompressionPrizeDistributionProps {
  prizePool?: string;
  totalParticipants?: number;
  estimatedTime?: string;
}

const ZkCompressionPrizeDistribution: React.FC<
  ZkCompressionPrizeDistributionProps
> = ({
  prizePool = "500,000 USDC",
  totalParticipants = 150000,
  estimatedTime = "< 2 seconds",
}) => {
  // Generate sample distribution data
  const distributionData = [
    { rank: "1st", percentage: 20, amount: calculateAmount(20) },
    { rank: "2nd", percentage: 10, amount: calculateAmount(10) },
    { rank: "3rd", percentage: 8, amount: calculateAmount(8) },
    { rank: "4-10th", percentage: 24, amount: calculateAmount(24) },
    { rank: "11-100th", percentage: 25, amount: calculateAmount(25) },
    { rank: "101-1000th", percentage: 13, amount: calculateAmount(13) },
  ];

  // Calculate amount based on percentage
  function calculateAmount(percentage: number): string {
    const numericPrizePool = parseFloat(prizePool.replace(/[^0-9.]/g, ""));
    const amount = (numericPrizePool * percentage) / 100;

    return amount >= 1000
      ? `${(amount / 1000).toFixed(1)}K USDC`
      : `${amount.toFixed(0)} USDC`;
  }

  return (
    <div className="bg-midnight-black/50 backdrop-blur-md border border-pink-600/30 rounded-xl p-4 overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>

      <div className="flex items-center gap-2 mb-4">
        <div className="bg-pink-500/20 p-2 rounded-lg">
          <FileKey className="h-5 w-5 text-pink-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-pink-400">
            ZK Optimized Prize Distribution
          </h3>
          <p className="text-xs text-gray-400">
            Efficient, private & secure rewards
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-pink-600/20">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-pink-400" />
            <div className="text-xs text-gray-400">Total Prize Pool</div>
          </div>
          <div className="text-xl font-bold text-white">{prizePool}</div>
          <div className="text-xs text-gray-400 mt-1">
            Protected with zero-knowledge proofs
          </div>
        </div>

        <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-pink-600/20">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-pink-400" />
              <div className="text-xs text-gray-400">Participants</div>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-pink-400" />
              <span className="text-xs text-pink-400">
                Settlement time: {estimatedTime}
              </span>
            </div>
          </div>
          <div className="text-xl font-bold text-white">
            {totalParticipants.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Privacy-preserved, cost-efficient transactions
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <span className="text-pink-400 mr-1">Prize Distribution</span>
          <span className="text-xs text-gray-400">
            (optimized with ZK Compression)
          </span>
        </h4>

        <div className="space-y-2">
          {distributionData.map((item, index) => (
            <div
              key={index}
              className="bg-gunmetal-grey/30 rounded-lg overflow-hidden"
            >
              <div className="flex items-center">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="bg-pink-900/30 h-10 flex items-center pl-3"
                >
                  <span className="text-sm font-medium text-white">
                    {item.rank}
                  </span>
                </motion.div>

                <div className="flex justify-between items-center flex-1 px-3">
                  <span className="text-sm text-pink-400 font-medium">
                    {item.percentage}%
                  </span>
                  <span className="text-sm text-white">{item.amount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-pink-600/20">
        <h4 className="text-sm font-medium text-pink-400 mb-2">
          ZK Compression Benefits
        </h4>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gunmetal-grey/40 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-white">91%</div>
            <div className="text-[10px] text-gray-400">Cost Saving</div>
          </div>

          <div className="bg-gunmetal-grey/40 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-white">100%</div>
            <div className="text-[10px] text-gray-400">Privacy</div>
          </div>

          <div className="bg-gunmetal-grey/40 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-white">{estimatedTime}</div>
            <div className="text-[10px] text-gray-400">Settlement</div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs text-gray-400">
          ZK Compression enables{" "}
          <span className="text-pink-400">instant, private</span> prize
          distribution with <span className="text-pink-400">91% lower</span>{" "}
          transaction fees
        </p>
      </div>
    </div>
  );
};

export default ZkCompressionPrizeDistribution;
