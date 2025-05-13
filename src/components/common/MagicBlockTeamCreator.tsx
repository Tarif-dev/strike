import React from "react";
import { motion } from "framer-motion";
import { Zap, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MagicBlockTeamCreatorProps {
  teamSize?: number;
  maxCapacity?: number;
  className?: string;
}

const MagicBlockTeamCreator: React.FC<MagicBlockTeamCreatorProps> = ({
  teamSize = 0,
  maxCapacity = 11,
  className = "",
}) => {
  const progressPercentage = (teamSize / maxCapacity) * 100;
  const isOptimal = teamSize >= maxCapacity * 0.8;

  return (
    <div
      className={cn(
        "bg-yellow-950/10 border border-yellow-600/20 rounded-xl p-4 mb-4",
        className
      )}
    >
      <div className="flex items-center mb-3">
        <div className="bg-yellow-500/20 p-2 rounded-lg mr-3">
          <Zap className="h-5 w-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-base font-bold">MagicBlock Team Creator</h3>
          <p className="text-xs text-gray-400">
            Real-time team validation and processing
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-end mb-1.5">
          <div className="flex items-center">
            <Users className="h-4 w-4 text-yellow-400 mr-1.5" />
            <span className="text-sm font-medium">Team Size</span>
          </div>
          <span className="text-sm">
            <span className={isOptimal ? "text-green-400" : "text-yellow-400"}>
              {teamSize}
            </span>
            <span className="text-gray-400">/{maxCapacity}</span>
          </span>
        </div>

        <div className="relative">
          <Progress
            value={progressPercentage}
            className="h-2 bg-gunmetal-grey/40"
          />
          {teamSize > 0 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
            >
              <div className="bg-yellow-950/50 border border-yellow-600/30 rounded-full h-4 w-4 flex items-center justify-center">
                <span className="text-[8px] text-yellow-400">{teamSize}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gunmetal-grey/30 rounded-lg p-2.5 border border-yellow-600/10">
          <div className="flex items-center mb-1">
            <Clock className="h-3.5 w-3.5 text-yellow-400 mr-1.5" />
            <span className="text-xs font-medium">Processing Time</span>
          </div>
          <div className="text-lg font-bold">10ms</div>
        </div>

        <div className="bg-gunmetal-grey/30 rounded-lg p-2.5 border border-yellow-600/10">
          <div className="flex items-center mb-1">
            <Zap className="h-3.5 w-3.5 text-yellow-400 mr-1.5" />
            <span className="text-xs font-medium">On-Chain Status</span>
          </div>
          <div className="text-lg font-bold flex items-center">
            <span className="text-green-400 mr-1">Ready</span>
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2 text-xs">
          {isOptimal ? (
            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          )}
          <span className="text-gray-300">
            {isOptimal
              ? "Your team meets the optimal configuration requirements for maximum points potential"
              : "Add more players to your team to meet the optimal configuration requirements"}
          </span>
        </div>

        <div className="flex items-start gap-2 text-xs">
          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
          <span className="text-gray-300">
            MagicBlock&apos;s parallel processing ensures instant team
            validation and on-chain registration
          </span>
        </div>

        <div className="flex items-start gap-2 text-xs">
          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
          <span className="text-gray-300">
            Your team will be processed in just 10ms, regardless of network
            congestion
          </span>
        </div>
      </div>
    </div>
  );
};

export default MagicBlockTeamCreator;
