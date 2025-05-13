import React from "react";
import { motion } from "framer-motion";
import { Cpu, Zap, Timer, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RealTimePerformanceProps {
  playerName?: string;
  teamName?: string;
  matchType?: string;
}

const MagicBlockRealTimePerformance: React.FC<RealTimePerformanceProps> = ({
  playerName = "MS Dhoni",
  teamName = "Chennai Super Kings",
  matchType = "T20",
}) => {
  // Simulated real-time performance metrics
  const perfMetrics = {
    responseTime: "10ms",
    concurrentTxns: "1.2M",
    uptime: "99.9%",
    lastUpdated: "2 seconds ago",
  };

  return (
    <div className="w-full bg-midnight-black/50 backdrop-blur-md border border-yellow-600/30 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-yellow-500/20 p-1.5 rounded-lg">
          <Zap className="h-4 w-4 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-yellow-400">
            MagicBlock Powered
          </h3>
          <p className="text-xs text-gray-400">
            Real-time performance analytics
          </p>
        </div>
        <Badge className="ml-auto bg-yellow-500/10 text-yellow-400 text-xs">
          {perfMetrics.lastUpdated}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gunmetal-grey/30 rounded-lg p-2 border border-yellow-600/20">
          <div className="flex items-center gap-1.5 mb-1">
            <Timer className="h-3 w-3 text-yellow-400" />
            <span className="text-xs font-medium text-gray-300">
              Response Time
            </span>
          </div>
          <p className="text-lg font-bold text-yellow-400">
            {perfMetrics.responseTime}
          </p>
        </div>

        <div className="bg-gunmetal-grey/30 rounded-lg p-2 border border-yellow-600/20">
          <div className="flex items-center gap-1.5 mb-1">
            <Cpu className="h-3 w-3 text-yellow-400" />
            <span className="text-xs font-medium text-gray-300">
              Transactions
            </span>
          </div>
          <p className="text-lg font-bold text-yellow-400">
            {perfMetrics.concurrentTxns}
          </p>
        </div>

        <div className="bg-gunmetal-grey/30 rounded-lg p-2 border border-yellow-600/20">
          <div className="flex items-center gap-1.5 mb-1">
            <BarChart3 className="h-3 w-3 text-yellow-400" />
            <span className="text-xs font-medium text-gray-300">Uptime</span>
          </div>
          <p className="text-lg font-bold text-yellow-400">
            {perfMetrics.uptime}
          </p>
        </div>
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        className="h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-full mb-2"
      />

      <p className="text-xs text-gray-400 text-center">
        Real-time blockchain infrastructure by MagicBlock for sub-10ms fantasy
        cricket updates
      </p>
    </div>
  );
};

export default MagicBlockRealTimePerformance;
