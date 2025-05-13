import React from "react";
import { motion } from "framer-motion";
import { FileKey, Lock, Shield, Sparkles, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ZkCompressionPlayerStatsProps {
  className?: string;
  playerName?: string;
  dataCompressionRatio?: string;
  verificationTime?: string;
  transactionCost?: string;
}

const ZkCompressionPlayerStats: React.FC<ZkCompressionPlayerStatsProps> = ({
  className = "",
  playerName = "Player",
  dataCompressionRatio = "96.7%",
  verificationTime = "< 0.5s",
  transactionCost = "0.000012 SOL",
}) => {
  return (
    <Card
      className={`bg-gradient-to-br from-pink-950/30 to-zinc-900 border border-pink-600/30 ${className}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-pink-500/20 p-2 rounded-lg">
              <FileKey className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                ZK Compressed Player Data
              </CardTitle>
              <CardDescription className="text-sm text-gray-400">
                Zero-Knowledge Proof Verification
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ZK Compression Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-pink-950/20 rounded-lg p-3 border border-pink-600/10">
            <div className="flex items-center mb-2">
              <FileKey className="h-4 w-4 text-pink-400 mr-2" />
              <span className="text-sm text-gray-300">Data Compression</span>
            </div>
            <p className="text-pink-400 text-lg font-bold">
              {dataCompressionRatio}
            </p>
          </div>

          <div className="bg-pink-950/20 rounded-lg p-3 border border-pink-600/10">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-pink-400 mr-2" />
              <span className="text-sm text-gray-300">Verification Time</span>
            </div>
            <p className="text-pink-400 text-lg font-bold">
              {verificationTime}
            </p>
          </div>

          <div className="bg-pink-950/20 rounded-lg p-3 border border-pink-600/10">
            <div className="flex items-center mb-2">
              <Shield className="h-4 w-4 text-pink-400 mr-2" />
              <span className="text-sm text-gray-300">Transaction Cost</span>
            </div>
            <p className="text-pink-400 text-lg font-bold">{transactionCost}</p>
          </div>
        </div>

        {/* ZK Stats Description */}
        <div className="bg-pink-950/10 rounded-lg p-4 border border-pink-600/10">
          <p className="text-sm text-gray-300">
            Player data is securely compressed and verified using Zero-Knowledge
            proofs, reducing on-chain storage while maintaining data integrity
            and provable fairness. Transaction costs are reduced by over 90%
            compared to traditional methods.
          </p>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-400">
        <div className="flex items-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-pink-500 mr-2"
          />
          Last update: just now
        </div>
      </CardFooter>
    </Card>
  );
};

export default ZkCompressionPlayerStats;
