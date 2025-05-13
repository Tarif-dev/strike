import React from "react";
import { motion } from "framer-motion";
import { Zap, BarChart3, Activity, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MagicBlockAnalyticsProps {
  statsUpdateTime?: string;
  nodeCount?: number;
  transactionSpeed?: string;
  dataProcessed?: string;
}

const MagicBlockAnalytics: React.FC<MagicBlockAnalyticsProps> = ({
  statsUpdateTime = "2 seconds ago",
  nodeCount = 42,
  transactionSpeed = "10ms",
  dataProcessed = "1.2TB",
}) => {
  // Generate random cricket stats for visualization
  const generateRandomStats = () => {
    const categories = ["Batting", "Bowling", "Fielding", "Strategy"];
    return categories.map((category) => ({
      category,
      value: Math.floor(Math.random() * 100),
      processingTime: Math.floor(Math.random() * 10) + 1,
      transactions: Math.floor(Math.random() * 100000) + 10000,
    }));
  };

  const stats = generateRandomStats();

  return (
    <div className="bg-midnight-black/50 backdrop-blur-md border border-yellow-600/30 rounded-xl p-4 overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500/20 p-2 rounded-lg">
            <BarChart3 className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-yellow-400">
              MagicBlock Analytics
            </h3>
            <p className="text-xs text-gray-400">
              Real-time match statistics processing
            </p>
          </div>
        </div>
        <Badge className="bg-yellow-500/10 text-yellow-400 text-xs border-yellow-500/30 flex items-center gap-1">
          <RefreshCw className="h-3 w-3" /> {statsUpdateTime}
        </Badge>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-gunmetal-grey/30 rounded-lg p-2 border border-yellow-600/20">
          <div className="text-xs text-gray-400 mb-1">Active Nodes</div>
          <div className="text-lg font-bold text-white">{nodeCount}</div>
        </div>

        <div className="bg-gunmetal-grey/30 rounded-lg p-2 border border-yellow-600/20">
          <div className="text-xs text-gray-400 mb-1">Tx Speed</div>
          <div className="text-lg font-bold text-white">{transactionSpeed}</div>
        </div>

        <div className="bg-gunmetal-grey/30 rounded-lg p-2 border border-yellow-600/20">
          <div className="text-xs text-gray-400 mb-1">Data Processed</div>
          <div className="text-lg font-bold text-white">{dataProcessed}</div>
        </div>

        <div className="bg-gunmetal-grey/30 rounded-lg p-2 border border-yellow-600/20">
          <div className="text-xs text-gray-400 mb-1">Uptime</div>
          <div className="text-lg font-bold text-white">99.9%</div>
        </div>
      </div>

      {/* Stats visualization */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-yellow-400" />
          Real-time Cricket Statistics Processing
        </h4>

        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="relative">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{stat.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">{stat.value}%</span>
                  <span className="text-[10px] text-gray-500">
                    {stat.processingTime}ms •{" "}
                    {stat.transactions.toLocaleString()} tx/s
                  </span>
                </div>
              </div>

              <div className="h-2 bg-gunmetal-grey/40 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.value}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="h-full bg-yellow-500/60 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Processing visualization */}
      <div className="bg-gunmetal-grey/30 rounded-lg border border-yellow-600/20 p-3 relative">
        <h4 className="text-xs font-medium text-gray-300 mb-2">
          Data Processing Pipeline
        </h4>

        <div className="flex items-center gap-2 overflow-hidden h-8 bg-gunmetal-grey/40 rounded-md relative">
          <div className="absolute inset-0 flex">
            {/* Data collection node */}
            <div className="h-full w-1/5 flex items-center justify-center bg-yellow-500/20 border-r border-yellow-600/30">
              <span className="text-[10px] text-yellow-400">Collect</span>
            </div>

            {/* Processing node */}
            <div className="h-full w-1/5 flex items-center justify-center bg-yellow-500/10 border-r border-yellow-600/30">
              <span className="text-[10px] text-yellow-400">Process</span>
            </div>

            {/* Validation node */}
            <div className="h-full w-1/5 flex items-center justify-center bg-yellow-500/15 border-r border-yellow-600/30">
              <span className="text-[10px] text-yellow-400">Validate</span>
            </div>

            {/* Distribution node */}
            <div className="h-full w-1/5 flex items-center justify-center bg-yellow-500/20 border-r border-yellow-600/30">
              <span className="text-[10px] text-yellow-400">Distribute</span>
            </div>

            {/* Client node */}
            <div className="h-full w-1/5 flex items-center justify-center bg-neon-green/20">
              <span className="text-[10px] text-neon-green">Client</span>
            </div>
          </div>

          {/* Data packet animation */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [0, 240] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="absolute h-4 w-4 bg-yellow-400 rounded-full z-10 left-2 top-2"
          />
        </div>
      </div>

      <div className="text-center mt-3">
        <p className="text-xs text-gray-400">
          MagicBlock's infrastructure enables real-time cricket analytics
          processing with sub-10ms latency
        </p>
      </div>
    </div>
  );
};

export default MagicBlockAnalytics;
