import React from "react";
import { motion } from "framer-motion";
import { FileKey, LineChart, Lock, Database, Zap } from "lucide-react";

interface ZkCompressionPlayerDataProps {
  playerName: string;
  compressionRatio?: string;
  storageSavings?: string;
  transactionCount?: string;
  verificationTime?: string;
  className?: string;
}

const ZkCompressionPlayerData: React.FC<ZkCompressionPlayerDataProps> = ({
  playerName,
  compressionRatio = "94.7%",
  storageSavings = "9.8KB",
  transactionCount = "143,267",
  verificationTime = "0.8s",
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-gradient-to-br from-pink-950/40 to-zinc-900 rounded-xl border border-pink-500/20 overflow-hidden ${className}`}
    >
      <div className="px-4 py-3 border-b border-pink-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-pink-500/20 p-1.5 rounded-md">
            <FileKey className="h-4 w-4 text-pink-400" />
          </div>
          <h3 className="font-medium text-pink-200">
            ZK Compressed Player Data
          </h3>
        </div>
        <span className="text-xs text-pink-300/70 bg-pink-500/10 py-0.5 px-2 rounded-full">
          Zero-Knowledge Proof
        </span>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-400 mb-4">
          Player data for{" "}
          <span className="text-pink-300 font-medium">{playerName}</span> is
          compressed and verified using ZK proofs, reducing on-chain storage
          while maintaining data integrity.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-pink-950/30 rounded-lg p-3 border border-pink-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Database className="h-4 w-4 text-pink-400" />
              <span className="text-xs text-pink-200 font-medium">
                Compression Ratio
              </span>
            </div>
            <p className="text-xl font-bold text-pink-400">
              {compressionRatio}
            </p>
          </div>

          <div className="bg-pink-950/30 rounded-lg p-3 border border-pink-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Lock className="h-4 w-4 text-pink-400" />
              <span className="text-xs text-pink-200 font-medium">
                Storage Savings
              </span>
            </div>
            <p className="text-xl font-bold text-pink-400">{storageSavings}</p>
          </div>

          <div className="bg-pink-950/30 rounded-lg p-3 border border-pink-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <LineChart className="h-4 w-4 text-pink-400" />
              <span className="text-xs text-pink-200 font-medium">
                Transactions
              </span>
            </div>
            <p className="text-xl font-bold text-pink-400">
              {transactionCount}
            </p>
          </div>

          <div className="bg-pink-950/30 rounded-lg p-3 border border-pink-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="h-4 w-4 text-pink-400" />
              <span className="text-xs text-pink-200 font-medium">
                Verification Time
              </span>
            </div>
            <p className="text-xl font-bold text-pink-400">
              {verificationTime}
            </p>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400 bg-pink-950/20 p-2 rounded border border-pink-500/10">
          ZK Compression enables storing player statistics, performance metrics,
          and historical data with 90%+ reduction in blockchain storage
          requirements while maintaining data integrity and privacy.
        </div>
      </div>
    </motion.div>
  );
};

export default ZkCompressionPlayerData;
