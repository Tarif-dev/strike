import React from "react";
import { motion } from "framer-motion";
import { Fingerprint, Zap, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const BlockchainFeatureShowcase = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Powered By</h2>
        <Link
          to="/magicblock"
          className="text-sm flex items-center text-neon-green hover:underline"
        >
          View All Technologies <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MagicBlock Card */}
        <Link to="/magicblock">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-yellow-950 to-zinc-900 rounded-xl overflow-hidden border border-yellow-600/30 h-full"
          >
            <div className="relative p-5">
              {/* Background glow effect */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-500/20 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-yellow-400">
                      MagicBlock
                    </h3>
                    <p className="text-xs text-gray-400">
                      High-performance Infrastructure
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="text-yellow-400/50" />
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Transaction Speed
                  </span>
                  <span className="text-sm font-medium text-yellow-400">
                    10ms
                  </span>
                </div>

                <div className="w-full bg-yellow-900/20 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "95%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="bg-yellow-500 h-full rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Throughput</span>
                  <span className="text-sm font-medium text-yellow-400">
                    65k TPS
                  </span>
                </div>

                <div className="w-full bg-yellow-900/20 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="bg-yellow-500 h-full rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Finality</span>
                  <span className="text-sm font-medium text-yellow-400">
                    ~ 0.4 seconds
                  </span>
                </div>

                <div className="w-full bg-yellow-900/20 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="bg-yellow-500 h-full rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* ZK Compression Card */}
        <Link to="/zk-compression">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-violet-950 to-zinc-900 rounded-xl overflow-hidden border border-violet-600/30 h-full"
          >
            <div className="relative p-5">
              {/* Background glow effect */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl"></div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-violet-500/20 p-2 rounded-lg">
                    <Fingerprint className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-violet-400">
                      ZK Compression
                    </h3>
                    <p className="text-xs text-gray-400">
                      Advanced Data Structures
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="text-violet-400/50" />
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Data Compression
                  </span>
                  <span className="text-sm font-medium text-violet-400">
                    ~ 95%
                  </span>
                </div>

                <div className="w-full bg-violet-900/20 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "95%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="bg-violet-500 h-full rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Cost Reduction</span>
                  <span className="text-sm font-medium text-violet-400">
                    ~ 91%
                  </span>
                </div>

                <div className="w-full bg-violet-900/20 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "91%" }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="bg-violet-500 h-full rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Privacy Preservation
                  </span>
                  <span className="text-sm font-medium text-violet-400">
                    Best-in-class
                  </span>
                </div>

                <div className="w-full bg-violet-900/20 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "98%" }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="bg-violet-500 h-full rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default BlockchainFeatureShowcase;
