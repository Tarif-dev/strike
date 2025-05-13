import React from "react";
import { motion } from "framer-motion";
import { Zap, Server, BarChart3, Shield, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MagicBlockStats {
  label: string;
  before: string;
  after: string;
  icon: React.ReactNode;
}

const MagicBlockMatchStatistics = () => {
  const stats: MagicBlockStats[] = [
    {
      label: "Transaction Speed",
      before: "2-4 sec",
      after: "10 ms",
      icon: <Activity className="h-3 w-3 text-yellow-400" />,
    },
    {
      label: "Data Throughput",
      before: "1K TPS",
      after: "50M TPS",
      icon: <Server className="h-3 w-3 text-yellow-400" />,
    },
    {
      label: "Security Level",
      before: "High",
      after: "Ultra High",
      icon: <Shield className="h-3 w-3 text-yellow-400" />,
    },
    {
      label: "Analytics Processing",
      before: "Minutes",
      after: "Real-time",
      icon: <BarChart3 className="h-3 w-3 text-yellow-400" />,
    },
  ];

  return (
    <div className="w-full bg-midnight-black/50 backdrop-blur-md border border-yellow-600/30 rounded-xl p-4 overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>

      <div className="flex items-center gap-2 mb-4">
        <div className="bg-yellow-500/20 p-2 rounded-lg">
          <Zap className="h-5 w-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-yellow-400">
            MagicBlock Optimized Stats
          </h3>
          <p className="text-xs text-gray-400">
            Performance improvements powered by MagicBlock
          </p>
        </div>
        <Badge className="ml-auto bg-yellow-500/10 text-yellow-400 text-xs">
          BLOCKCHAIN OPTIMIZED
        </Badge>
      </div>

      {/* Stats comparison table */}
      <div className="relative overflow-hidden rounded-lg border border-yellow-600/20 mb-4">
        <div className="grid grid-cols-4 text-xs font-medium text-gray-300 bg-gunmetal-grey/30 p-2">
          <div>Metric</div>
          <div>Traditional</div>
          <div>MagicBlock</div>
          <div>Improvement</div>
        </div>

        <div className="divide-y divide-yellow-600/10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="grid grid-cols-4 text-xs p-2 items-center bg-gunmetal-grey/10"
            >
              <div className="flex items-center gap-1.5">
                {stat.icon}
                <span>{stat.label}</span>
              </div>
              <div className="text-gray-400">{stat.before}</div>
              <div className="text-yellow-400 font-medium">{stat.after}</div>
              <div>
                <Badge
                  variant="outline"
                  className="bg-yellow-500/5 border-yellow-500/20 text-yellow-400 text-[10px]"
                >
                  {stat.label === "Transaction Speed"
                    ? "200,000x faster"
                    : stat.label === "Data Throughput"
                      ? "50,000x higher"
                      : stat.label === "Security Level"
                        ? "Enhanced"
                        : "Instant"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animated visualization of speed improvement */}
      <div className="bg-gunmetal-grey/20 rounded-lg p-3 border border-yellow-600/20 relative overflow-hidden">
        <h4 className="text-xs font-medium text-gray-300 mb-2">
          Live Speed Comparison
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <div className="relative h-8 bg-gunmetal-grey/30 rounded-md overflow-hidden">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 z-10">
              Standard
            </span>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "linear" }}
              className="h-full bg-gray-700/50"
            />
          </div>

          <div className="relative h-8 bg-gunmetal-grey/30 rounded-md overflow-hidden">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-yellow-400 z-10">
              MagicBlock
            </span>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.01, ease: "linear" }}
              className="h-full bg-yellow-500/30"
            />
          </div>
        </div>
      </div>

      <div className="text-center mt-3">
        <p className="text-xs text-gray-400">
          MagicBlock's infrastructure enables sub-10ms transaction finality for
          real-time fantasy cricket updates
        </p>
      </div>
    </div>
  );
};

export default MagicBlockMatchStatistics;
