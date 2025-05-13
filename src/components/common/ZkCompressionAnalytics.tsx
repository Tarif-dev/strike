import React from "react";
import { motion } from "framer-motion";
import { FileKey, BarChart3, Activity, RefreshCw, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ZkCompressionAnalyticsProps {
  dataProcessed?: string;
  compressionRatio?: string;
  costSavings?: string;
  lastUpdate?: string;
}

const ZkCompressionAnalytics: React.FC<ZkCompressionAnalyticsProps> = ({
  dataProcessed = "750MB",
  compressionRatio = "95%",
  costSavings = "91%",
  lastUpdate = "30 seconds ago",
}) => {
  // Generate random analytics data for visualization
  const generateRandomStats = () => {
    const categories = [
      "Player Data",
      "Batting Stats",
      "Bowling Stats",
      "Team Strategy",
    ];
    return categories.map((category) => ({
      category,
      dataSize: Math.floor(Math.random() * 100) + 50,
      compressedSize: Math.floor(Math.random() * 10) + 2,
      savingsPercent: Math.floor(Math.random() * 10) + 90,
    }));
  };

  const stats = generateRandomStats();

  return (
    <div className="bg-midnight-black/50 backdrop-blur-md border border-pink-600/30 rounded-xl p-4 overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-pink-500/20 p-2 rounded-lg">
            <BarChart3 className="h-5 w-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-pink-400">
              ZK Compression Analytics
            </h3>
            <p className="text-xs text-gray-400">
              Privacy-preserving data optimization
            </p>
          </div>
        </div>
        <Badge className="bg-pink-500/10 text-pink-400 text-xs border-pink-500/30 flex items-center gap-1">
          <RefreshCw className="h-3 w-3" /> {lastUpdate}
        </Badge>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-gunmetal-grey/30 rounded-lg p-2 border border-pink-600/20">
          <div className="text-xs text-gray-400 mb-1">Data Processed</div>
          <div className="text-lg font-bold text-white">{dataProcessed}</div>
        </div>

        <div className="bg-gunmetal-grey/30 rounded-lg p-2 border border-pink-600/20">
          <div className="text-xs text-gray-400 mb-1">Compression</div>
          <div className="text-lg font-bold text-white">{compressionRatio}</div>
        </div>

        <div className="bg-gunmetal-grey/30 rounded-lg p-2 border border-pink-600/20">
          <div className="text-xs text-gray-400 mb-1">Cost Savings</div>
          <div className="text-lg font-bold text-white">{costSavings}</div>
        </div>

        <div className="bg-gunmetal-grey/30 rounded-lg p-2 border border-pink-600/20">
          <div className="text-xs text-gray-400 mb-1">Privacy Level</div>
          <div className="text-lg font-bold text-white">100%</div>
        </div>
      </div>

      {/* Stats visualization */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-pink-400" />
          Compression Efficiency by Data Type
        </h4>

        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="relative">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{stat.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-pink-400">
                    {stat.savingsPercent}% saved
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {stat.dataSize}KB → {stat.compressedSize}KB
                  </span>
                </div>
              </div>

              <div className="h-2 bg-gunmetal-grey/40 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.savingsPercent}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="h-full bg-pink-500/60 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zero-knowledge visualization */}
      <div className="bg-gunmetal-grey/30 rounded-lg border border-pink-600/20 p-3 relative">
        <h4 className="text-xs font-medium text-gray-300 mb-2 flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-pink-400" />
          Zero-Knowledge Privacy Protection
        </h4>

        <div className="flex items-center gap-2 overflow-hidden h-10 bg-gunmetal-grey/40 rounded-md relative p-1">
          {/* Data visualization */}
          <div className="flex flex-1 h-full">
            {/* Original data visualization */}
            <div className="flex-1 flex items-center flex-wrap overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="h-1 w-1 bg-gray-500 m-0.5 rounded-full"
                ></div>
              ))}
            </div>

            {/* Arrow */}
            <div className="px-2 flex items-center">
              <div className="text-pink-400 text-xs">→</div>
            </div>

            {/* Compressed & encrypted data visualization */}
            <div className="flex-1 flex items-center justify-center relative">
              <div className="h-6 w-6 bg-pink-500/40 rounded-full flex items-center justify-center">
                <Lock className="h-3 w-3 text-pink-400" />
              </div>

              {/* Animated shield effect */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="absolute inset-0 bg-pink-500/10 rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-2">
          <p className="text-xs text-gray-400">
            Data is compressed and protected with zero-knowledge cryptography
          </p>
        </div>
      </div>
    </div>
  );
};

// ZK Lock icon component for use within the component
const Lock = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    <line x1="12" y1="15" x2="12" y2="17"></line>
  </svg>
);

export default ZkCompressionAnalytics;
