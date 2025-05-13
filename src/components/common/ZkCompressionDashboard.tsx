import React from "react";
import { motion } from "framer-motion";
import {
  FileKey,
  Clock,
  Shield,
  Database,
  BarChart2,
  PieChart,
  ArrowUpRight,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ZkCompressionDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header with summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-pink-950/30 to-zinc-900 border border-pink-600/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileKey className="h-5 w-5 text-pink-400 mr-2" />
              Compression Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-pink-400">95.2%</p>
                <p className="text-xs text-gray-400">Data size reduction</p>
              </div>
              <Badge
                variant="outline"
                className="bg-pink-950/30 text-pink-400 border-pink-500/30"
              >
                +2.1% this week
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-950/30 to-zinc-900 border border-pink-600/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Shield className="h-5 w-5 text-pink-400 mr-2" />
              Gas Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-pink-400">91%</p>
                <p className="text-xs text-gray-400">Lower transaction costs</p>
              </div>
              <Badge
                variant="outline"
                className="bg-pink-950/30 text-pink-400 border-pink-500/30"
              >
                Optimized
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-950/30 to-zinc-900 border border-pink-600/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 text-pink-400 mr-2" />
              Verification Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-pink-400">1.8s</p>
                <p className="text-xs text-gray-400">
                  Zero-knowledge proof time
                </p>
              </div>
              <Badge
                variant="outline"
                className="bg-pink-950/30 text-pink-400 border-pink-500/30"
              >
                -0.3s improvement
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-pink-950/30 to-zinc-900 border border-pink-600/30">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Data Consumption</CardTitle>
              <div className="bg-pink-500/20 p-2 rounded-lg">
                <BarChart2 className="h-5 w-5 text-pink-400" />
              </div>
            </div>
            <CardDescription>
              Comparison of on-chain storage before and after ZK compression
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] relative">
              {/* Chart placeholder with animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart2 className="h-32 w-32 text-pink-400/10" />
              </div>

              <div className="relative z-10 h-full flex items-end justify-around pt-10">
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-400 mb-2">Standard</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "95%" }}
                    transition={{ duration: 0.7 }}
                    className="w-16 bg-gray-500/30 rounded-t-sm"
                  />
                  <div className="text-xs text-gray-400 mt-2">100 MB</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-400 mb-2">With ZK</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "5%" }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="w-16 bg-pink-400 rounded-t-sm"
                  />
                  <div className="text-xs text-gray-400 mt-2">4.8 MB</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-950/30 to-zinc-900 border border-pink-600/30">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Transaction Metrics</CardTitle>
              <div className="bg-pink-500/20 p-2 rounded-lg">
                <PieChart className="h-5 w-5 text-pink-400" />
              </div>
            </div>
            <CardDescription>
              ZK Compression usage across different transaction types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] relative">
              {/* Chart placeholder with animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <PieChart className="h-32 w-32 text-pink-400/10" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-40 w-40">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    {/* Pie chart segments */}
                    <motion.circle
                      initial={{ strokeDasharray: "0 100" }}
                      animate={{ strokeDasharray: "45 100" }}
                      transition={{ duration: 1, delay: 0.1 }}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="20"
                      strokeDasharray="45 100"
                      transform="rotate(-90 50 50)"
                    />
                    <motion.circle
                      initial={{ strokeDasharray: "0 100" }}
                      animate={{ strokeDasharray: "30 100" }}
                      transition={{ duration: 1, delay: 0.3 }}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#db2777"
                      strokeWidth="20"
                      strokeDasharray="30 100"
                      strokeDashoffset="-45"
                      transform="rotate(-90 50 50)"
                    />
                    <motion.circle
                      initial={{ strokeDasharray: "0 100" }}
                      animate={{ strokeDasharray: "25 100" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#be185d"
                      strokeWidth="20"
                      strokeDasharray="25 100"
                      strokeDashoffset="-75"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
              </div>

              <div className="absolute bottom-0 w-full flex justify-center gap-4 text-xs">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-pink-400 rounded-sm mr-1"></div>
                  <span className="text-gray-400">Team Creation (45%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-pink-600 rounded-sm mr-1"></div>
                  <span className="text-gray-400">Match Data (30%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-pink-800 rounded-sm mr-1"></div>
                  <span className="text-gray-400">Prizes (25%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-pink-950/30 to-zinc-900 border border-pink-600/30 md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Recent ZK Compression Activity
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-pink-400 hover:text-pink-300 hover:bg-pink-950/30"
              >
                View All <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  type: "Team Creation",
                  user: "dhoni_fan24",
                  time: "3 min ago",
                  data: "5.1 KB",
                  savings: "96.2%",
                },
                {
                  type: "Match Stats Update",
                  user: "System",
                  time: "10 min ago",
                  data: "12.4 KB",
                  savings: "94.8%",
                },
                {
                  type: "Prize Distribution",
                  user: "System",
                  time: "25 min ago",
                  data: "7.8 KB",
                  savings: "95.3%",
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-pink-950/10 rounded-lg border border-pink-600/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-500/20 p-2 rounded-lg">
                      <FileKey className="h-4 w-4 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.type}</p>
                      <div className="flex items-center text-xs text-gray-400">
                        <Users className="h-3 w-3 mr-1" />
                        {activity.user}
                        <span className="mx-1">•</span>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-pink-400 font-medium">
                      {activity.data}
                    </p>
                    <p className="text-xs text-gray-400">
                      Saved {activity.savings}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-950/30 to-zinc-900 border border-pink-600/30">
          <CardHeader>
            <CardTitle className="text-lg">System Status</CardTitle>
            <CardDescription>
              ZK Compression infrastructure status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-400">ZK Prover</p>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Online
                  </Badge>
                </div>
                <div className="w-full bg-pink-950/20 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "25%" }}
                    transition={{ duration: 0.5 }}
                    className="bg-pink-500 h-full rounded-full"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">25% load</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-400">Storage Indexer</p>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Online
                  </Badge>
                </div>
                <div className="w-full bg-pink-950/20 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "38%" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-pink-500 h-full rounded-full"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">38% load</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-400">Verification Nodes</p>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    15/15
                  </Badge>
                </div>
                <div className="w-full bg-pink-950/20 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-pink-500 h-full rounded-full"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">All nodes active</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-pink-400 hover:bg-pink-950/30 hover:text-pink-300 border border-pink-600/20"
            >
              View Detailed Status
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ZkCompressionDashboard;
