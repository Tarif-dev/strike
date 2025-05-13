import React from "react";
import { motion } from "framer-motion";
import { FileKey, Activity, BarChart3, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ZkCompressionMetricsProps {
  className?: string;
  dailyTransactions?: number;
  averageCompression?: string;
  totalSaved?: string;
}

const ZkCompressionMetrics: React.FC<ZkCompressionMetricsProps> = ({
  className = "",
  dailyTransactions = 2543789,
  averageCompression = "95.7%",
  totalSaved = "1,275.83 SOL",
}) => {
  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Card
      className={`bg-gradient-to-br from-pink-950/30 to-zinc-900 border border-pink-600/30 ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-pink-500/20 p-2 rounded-lg">
              <FileKey className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <CardTitle className="text-lg">ZK Compression Metrics</CardTitle>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
          >
            View Details <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {/* Daily Transactions */}
          <div className="bg-pink-950/10 p-4 rounded-lg border border-pink-600/10">
            <div className="flex items-center mb-1">
              <Activity className="h-4 w-4 text-pink-400 mr-2" />
              <span className="text-sm text-gray-300">Daily Transactions</span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-pink-400">
                {formatNumber(dailyTransactions)}
              </p>
              <div className="flex items-center text-green-400 text-xs">
                <span className="mr-1">+12.4%</span>
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 45 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="h-3 w-3" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Average Compression */}
          <div className="bg-pink-950/10 p-4 rounded-lg border border-pink-600/10">
            <div className="flex items-center mb-1">
              <BarChart3 className="h-4 w-4 text-pink-400 mr-2" />
              <span className="text-sm text-gray-300">Avg. Compression</span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-pink-400">
                {averageCompression}
              </p>
              <div className="flex items-center text-green-400 text-xs">
                <span className="mr-1">+0.3%</span>
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 45 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="h-3 w-3" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Total Saved */}
          <div className="bg-pink-950/10 p-4 rounded-lg border border-pink-600/10">
            <div className="flex items-center mb-1">
              <FileKey className="h-4 w-4 text-pink-400 mr-2" />
              <span className="text-sm text-gray-300">Total SOL Saved</span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-pink-400">{totalSaved}</p>
              <div className="flex items-center text-green-400 text-xs">
                <span className="mr-1">+8.7%</span>
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 45 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="h-3 w-3" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time graph */}
        <div className="mt-4 bg-pink-950/5 p-4 rounded-lg border border-pink-600/10 h-32 flex items-end justify-between relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <BarChart3 className="h-16 w-16 text-pink-400" />
          </div>

          {/* Responsive bar chart - Simulated with animated bars */}
          {[...Array(24)].map((_, i) => {
            // Generate a random height for each bar between 10% and 100%
            const randomHeight = 10 + Math.random() * 90;

            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${randomHeight}%` }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
                className={`w-1.5 bg-pink-400 rounded-t-sm mx-0.5 ${i % 3 === 0 ? "opacity-100" : "opacity-70"}`}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ZkCompressionMetrics;
