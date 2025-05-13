import React from "react";
import { motion } from "framer-motion";
import { FileKey, Users, Zap, Lock, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ZkCompressionTeamCreationProps {
  className?: string;
  teamSize?: number;
  maxPlayers?: number;
  creationProgress?: number;
  dataReduction?: string;
  gasReduction?: string;
}

const ZkCompressionTeamCreation: React.FC<ZkCompressionTeamCreationProps> = ({
  className = "",
  teamSize = 0,
  maxPlayers = 11,
  creationProgress = 0,
  dataReduction = "95.3%",
  gasReduction = "91.2%",
}) => {
  // Calculate effective progress as a percentage
  const effectiveProgress = (teamSize / maxPlayers) * 100;
  const progressColor =
    teamSize === maxPlayers ? "bg-green-500" : "bg-pink-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-gradient-to-br from-pink-950/40 to-zinc-900/80 rounded-xl border border-pink-500/20 overflow-hidden ${className}`}
    >
      <div className="px-4 py-3 border-b border-pink-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-pink-500/20 p-1.5 rounded-md">
            <FileKey className="h-4 w-4 text-pink-400" />
          </div>
          <h3 className="font-medium text-pink-200">ZK Compressed Team</h3>
        </div>
        <span className="text-xs text-pink-300/70 bg-pink-500/10 py-0.5 px-2 rounded-full">
          Optimized Storage
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Team Creation</span>
          <span className="text-sm font-medium text-pink-300">
            {teamSize}/{maxPlayers} Players
          </span>
        </div>

        <div className="w-full h-2 bg-pink-950/30 rounded-full mb-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${effectiveProgress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`h-full ${progressColor} rounded-full`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-pink-950/30 rounded-lg p-3 border border-pink-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Lock className="h-4 w-4 text-pink-400" />
              <span className="text-xs text-pink-200 font-medium">
                Data Reduction
              </span>
            </div>
            <p className="text-xl font-bold text-pink-400">{dataReduction}</p>
          </div>

          <div className="bg-pink-950/30 rounded-lg p-3 border border-pink-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="h-4 w-4 text-pink-400" />
              <span className="text-xs text-pink-200 font-medium">
                Gas Savings
              </span>
            </div>
            <p className="text-xl font-bold text-pink-400">{gasReduction}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-pink-200 bg-pink-950/30 p-2 rounded border border-pink-500/10">
          <span className="bg-pink-500/20 p-1 rounded">
            <Users className="h-3 w-3 text-pink-400" />
          </span>
          <span>
            Your team data is ZK-compressed, reducing on-chain storage costs by
            up to {dataReduction} while maintaining complete data integrity.
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ZkCompressionTeamCreation;
