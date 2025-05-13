import React from "react";
import { motion } from "framer-motion";
import { Zap, Cpu, BarChart3, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MagicBlockIntegration = () => {
  return (
    <div className="w-full bg-midnight-black/50 backdrop-blur-md border border-yellow-600/30 rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left column - Main info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold">MagicBlock Integration</h3>
          </div>

          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-4">
            HIGH-PERFORMANCE BLOCKCHAIN INFRASTRUCTURE
          </Badge>

          <p className="text-gray-300 mb-6">
            Strike leverages MagicBlock&apos;s high-performance blockchain
            infrastructure to provide ultra-low latency responses for real-time
            fantasy cricket gameplay on Solana. This enables transaction
            finality in milliseconds rather than seconds, creating a seamless
            user experience for fantasy cricket players.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gunmetal-grey/30 rounded-lg p-4 border border-yellow-600/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                <h4 className="font-semibold">10ms Response Time</h4>
              </div>
              <p className="text-sm text-gray-400">
                Ultra-fast data processing for real-time score updates and
                player performance tracking
              </p>
            </div>

            <div className="bg-gunmetal-grey/30 rounded-lg p-4 border border-yellow-600/20">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="h-5 w-5 text-yellow-400" />
                <h4 className="font-semibold">Parallel Processing</h4>
              </div>
              <p className="text-sm text-gray-400">
                Handle millions of concurrent transactions during peak match
                moments
              </p>
            </div>

            <div className="bg-gunmetal-grey/30 rounded-lg p-4 border border-yellow-600/20">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-yellow-400" />
                <h4 className="font-semibold">Advanced Analytics</h4>
              </div>
              <p className="text-sm text-gray-400">
                Process complex cricket statistics in real-time for instant
                strategy insights
              </p>
            </div>

            <div className="bg-gunmetal-grey/30 rounded-lg p-4 border border-yellow-600/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <h4 className="font-semibold">Immediate Settlements</h4>
              </div>
              <p className="text-sm text-gray-400">
                Instant prize distribution and wallet updates after match
                completion
              </p>
            </div>
          </div>
        </div>

        {/* Right column - Implementation */}
        <div className="w-full md:w-1/3 bg-yellow-500/5 rounded-xl p-5 border border-yellow-600/20">
          <h4 className="font-bold text-lg mb-4 text-yellow-400">
            Technical Implementation
          </h4>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-5 rounded-full bg-yellow-500/30 flex items-center justify-center text-xs">
                  1
                </div>
                <h5 className="font-semibold">High-Throughput RPC Nodes</h5>
              </div>
              <p className="text-sm text-gray-400 ml-7">
                Dedicated MagicBlock RPC nodes for Strike platform with 99.9%
                uptime guarantee
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-5 rounded-full bg-yellow-500/30 flex items-center justify-center text-xs">
                  2
                </div>
                <h5 className="font-semibold">Edge Computing Network</h5>
              </div>
              <p className="text-sm text-gray-400 ml-7">
                Globally distributed infrastructure reduces latency for users
                across India
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-5 rounded-full bg-yellow-500/30 flex items-center justify-center text-xs">
                  3
                </div>
                <h5 className="font-semibold">Optimized Smart Contracts</h5>
              </div>
              <p className="text-sm text-gray-400 ml-7">
                Custom MagicBlock instruction processors for fantasy sports
                operations
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-5 rounded-full bg-yellow-500/30 flex items-center justify-center text-xs">
                  4
                </div>
                <h5 className="font-semibold">Data Reliability</h5>
              </div>
              <p className="text-sm text-gray-400 ml-7">
                Multi-region redundancy ensures uninterrupted gameplay during
                live matches
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagicBlockIntegration;
