import React from "react";
import { Zap, Clock, BarChart3, Shield, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface MagicBlockMatchInfoProps {
  matchId?: string;
  matchType?: string;
  stadium?: string;
}

const MagicBlockMatchInfo: React.FC<MagicBlockMatchInfoProps> = ({
  matchId = "M12345",
  matchType = "T20",
  stadium = "Wankhede Stadium",
}) => {
  return (
    <div className="bg-midnight-black/50 backdrop-blur-md border border-yellow-600/30 rounded-xl p-4 mb-4 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500/20 p-2 rounded-lg">
            <Zap className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-yellow-400">
              MagicBlock Integration
            </h3>
            <p className="text-xs text-gray-400">
              High-performance blockchain infrastructure
            </p>
          </div>
        </div>
        <Badge className="bg-yellow-500/10 text-yellow-400 text-xs border-yellow-500/30">
          MATCH ID: {matchId}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-yellow-600/20 relative overflow-hidden">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-yellow-400" />
            Real-Time Updates
          </h4>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 mb-1">Response Time</div>
              <div className="text-xl font-bold text-white">10ms</div>
            </div>

            <div className="h-10 w-px bg-yellow-600/20"></div>

            <div>
              <div className="text-xs text-gray-400 mb-1">Update Frequency</div>
              <div className="text-xl font-bold text-white">Live</div>
            </div>
          </div>

          {/* Animated pulsing dot to indicate realtime activity */}
          <div className="absolute bottom-3 right-3">
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-2 h-2 bg-yellow-400 rounded-full"
            />
          </div>
        </div>

        <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-yellow-600/20">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1.5">
            <Server className="h-4 w-4 text-yellow-400" />
            Infrastructure
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gunmetal-grey/40 p-2 rounded-md">
              <span className="text-gray-400">Edge Network:</span>
              <div className="font-medium text-white">Global</div>
            </div>

            <div className="bg-gunmetal-grey/40 p-2 rounded-md">
              <span className="text-gray-400">Redundancy:</span>
              <div className="font-medium text-white">Multi-region</div>
            </div>

            <div className="bg-gunmetal-grey/40 p-2 rounded-md">
              <span className="text-gray-400">Validator Pool:</span>
              <div className="font-medium text-white">Dedicated</div>
            </div>

            <div className="bg-gunmetal-grey/40 p-2 rounded-md">
              <span className="text-gray-400">RPC Nodes:</span>
              <div className="font-medium text-white">High-throughput</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center bg-gunmetal-grey/30 rounded-lg py-2 border border-yellow-600/20">
          <BarChart3 className="h-4 w-4 text-yellow-400 mb-1" />
          <span className="text-[10px] text-gray-400">Processing</span>
          <span className="text-sm font-bold text-white">50M TPS</span>
        </div>

        <div className="flex flex-col items-center justify-center bg-gunmetal-grey/30 rounded-lg py-2 border border-yellow-600/20">
          <Shield className="h-4 w-4 text-yellow-400 mb-1" />
          <span className="text-[10px] text-gray-400">Security</span>
          <span className="text-sm font-bold text-white">Ultra-high</span>
        </div>

        <div className="flex flex-col items-center justify-center bg-gunmetal-grey/30 rounded-lg py-2 border border-yellow-600/20">
          <Zap className="h-4 w-4 text-yellow-400 mb-1" />
          <span className="text-[10px] text-gray-400">Settlement</span>
          <span className="text-sm font-bold text-white">Instant</span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs text-gray-400">
          MagicBlock&apos;s high-performance Solana infrastructure powers this{" "}
          {matchType} match at {stadium}
        </p>
      </div>
    </div>
  );
};

export default MagicBlockMatchInfo;
