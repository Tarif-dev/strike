import React from "react";
import { Zap, Lock, Shield, Timer } from "lucide-react";
import { motion } from "framer-motion";

interface MagicBlockPrizeDistributionProps {
  prizePool?: string;
  totalParticipants?: number;
  estimatedTime?: string;
}

const MagicBlockPrizeDistribution: React.FC<
  MagicBlockPrizeDistributionProps
> = ({
  prizePool = "500,000 USDC",
  totalParticipants = 150000,
  estimatedTime = "< 1 second",
}) => {
  return (
    <div className="bg-midnight-black/50 backdrop-blur-md border border-yellow-600/30 rounded-xl p-4 overflow-hidden relative">
      {/* Background gradient effect */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>

      <div className="flex items-center gap-2 mb-4">
        <div className="bg-yellow-500/20 p-2 rounded-lg">
          <Zap className="h-5 w-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-yellow-400">
            MagicBlock Powered Distribution
          </h3>
          <p className="text-xs text-gray-400">
            Ultra-fast on-chain prize settlement
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-yellow-600/20">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4 text-yellow-400" />
              <span className="text-xs font-medium text-gray-300">
                Prize Pool
              </span>
            </div>
            <p className="text-lg font-bold text-white">{prizePool}</p>
          </div>

          <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-yellow-600/20">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-yellow-400" />
              <span className="text-xs font-medium text-gray-300">
                Security
              </span>
            </div>
            <p className="text-lg font-bold text-white">100%</p>
          </div>

          <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-yellow-600/20">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="h-4 w-4 text-yellow-400" />
              <span className="text-xs font-medium text-gray-300">
                Settlement
              </span>
            </div>
            <p className="text-lg font-bold text-white">{estimatedTime}</p>
          </div>
        </div>
      </div>

      {/* Animation showing prize distribution */}
      <div className="relative h-20 mb-3 overflow-hidden bg-gunmetal-grey/30 rounded-lg border border-yellow-600/20 p-3">
        <h4 className="text-xs font-medium text-gray-300 mb-2">
          Live Prize Settlement Visualization
        </h4>

        <div className="relative h-8">
          {/* Prize pool indicator */}
          <div className="absolute left-0 top-0 h-8 w-24 bg-yellow-500/20 rounded-l-md flex items-center justify-center">
            <span className="text-xs font-bold text-yellow-400">Pool</span>
          </div>

          {/* Distribution animation */}
          <motion.div
            initial={{ x: 24, width: 0, opacity: 0 }}
            animate={{
              x: [24, 200, 24],
              width: [0, 40, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            className="absolute h-8 bg-yellow-400/30 rounded-md"
          />

          {/* Winner wallets */}
          <div className="absolute right-0 top-0 h-8 w-32 bg-neon-green/20 rounded-r-md flex items-center justify-center">
            <span className="text-xs font-bold text-neon-green">Winners</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        MagicBlock&apos;s parallel transaction processing enables instant
        settlement for {totalParticipants.toLocaleString()} contest participants
      </p>
    </div>
  );
};

export default MagicBlockPrizeDistribution;
