import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  FileKey,
  ChevronRight,
  ArrowUpRight,
  TrendingUp,
  Clock,
  DollarSign,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CompactTechFeatureCardsProps {
  className?: string;
}

const CompactTechFeatureCards: React.FC<CompactTechFeatureCardsProps> = ({
  className,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* MagicBlock Card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-yellow-950 to-zinc-900 rounded-xl overflow-hidden border border-yellow-600/30 h-full"
        >
          <div className="relative p-4">
            {/* Background glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>

            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-500/20 p-1.5 rounded-lg">
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-yellow-400">
                    MagicBlock
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    Parallel Processing
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-300">10ms Response</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-300">99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-300">High Security</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-300">Low Fees</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ZK Compression Card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-pink-950 to-zinc-900 rounded-xl overflow-hidden border border-pink-600/30 h-full"
        >
          <div className="relative p-4">
            {/* Background glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>

            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-pink-500/20 p-1.5 rounded-lg">
                  <FileKey className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-pink-400">
                    ZK Compression
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    Advanced Data Structures
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-pink-400" />
                <span className="text-gray-300">95% Compression</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3 h-3 text-pink-400" />
                <span className="text-gray-300">91% Cost Savings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-pink-400" />
                <span className="text-gray-300">Fast Processing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-pink-400" />
                <span className="text-gray-300">Privacy Focused</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center space-x-6">
        <Link
          to="/magicblock"
          className="text-xs flex items-center text-yellow-400 hover:underline"
        >
          Learn more about MagicBlock <ChevronRight className="h-3 w-3 ml-1" />
        </Link>
        <Link
          to="/zk-compression"
          className="text-xs flex items-center text-pink-400 hover:underline"
        >
          Learn more about ZK Compression{" "}
          <ChevronRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default CompactTechFeatureCards;
