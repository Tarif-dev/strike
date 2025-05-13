import React from "react";
import { motion } from "framer-motion";
import { FileKey, Shield, Database, Clock, Fingerprint } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ZkCompressionMatchInfoProps {
  matchId: string;
  matchType?: string;
  stadium?: string;
}

const ZkCompressionMatchInfo: React.FC<ZkCompressionMatchInfoProps> = ({
  matchId,
  matchType = "T20",
  stadium = "Wankhede Stadium",
}) => {
  return (
    <div className="bg-midnight-black/50 backdrop-blur-md border border-pink-600/30 rounded-xl p-4 overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>

      <div className="flex items-center gap-2 mb-4">
        <div className="bg-pink-500/20 p-2 rounded-lg">
          <FileKey className="h-5 w-5 text-pink-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-pink-400">ZK Compression</h3>
          <p className="text-xs text-gray-400">
            Efficient data transaction & privacy
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-pink-600/20">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-pink-400" />
            <div className="text-xs text-gray-400">Privacy Level</div>
          </div>
          <div className="text-sm font-medium text-white">Fully Protected</div>
        </div>

        <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-pink-600/20">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-4 w-4 text-pink-400" />
            <div className="text-xs text-gray-400">Data Compression</div>
          </div>
          <div className="text-sm font-medium text-white">95% Reduction</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-pink-400" />
            <span className="text-xs text-gray-400">Transaction Speed</span>
          </div>
          <Badge className="bg-pink-500/10 text-pink-400 text-xs border-pink-500/30">
            OPTIMIZED
          </Badge>
        </div>

        <div className="flex items-center justify-between bg-gunmetal-grey/30 rounded-lg p-3 border border-pink-600/20">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">85% Faster</span>
            <span className="text-xs text-gray-400">
              than traditional methods
            </span>
          </div>

          {/* Compression visualization */}
          <div className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div className="h-8 w-4 bg-gray-700/60 rounded-sm"></div>
              <span className="text-[8px] text-gray-400 mt-0.5">Before</span>
            </div>
            <div className="text-pink-400 text-xs">→</div>
            <div className="flex flex-col items-center">
              <div className="h-8 w-1 bg-pink-400/60 rounded-sm"></div>
              <span className="text-[8px] text-gray-400 mt-0.5">After</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Fingerprint className="h-4 w-4 text-pink-400" />
          <span className="text-xs text-gray-400">Match Verification</span>
        </div>

        <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-pink-600/20">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                Match ID: {matchId.slice(0, 8)}...
              </span>
              <span className="text-xs text-gray-400">
                Verified on-chain with zero knowledge proofs
              </span>
            </div>

            <div className="flex items-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="h-2 w-2 bg-pink-400 rounded-full mr-2"
              />
              <span className="text-xs text-pink-400">Verified</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs text-gray-400">
          Using <span className="text-pink-400">ZK Compression</span> to save{" "}
          <span className="text-pink-400">91%</span> on transaction costs
        </p>
      </div>
    </div>
  );
};

export default ZkCompressionMatchInfo;
