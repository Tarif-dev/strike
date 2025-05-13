import React from "react";
import { motion } from "framer-motion";
import { FileKey, BarChart3, BarChart2, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ZkCompressionNotebookProps {
  className?: string;
}

const ZkCompressionNotebook: React.FC<ZkCompressionNotebookProps> = ({
  className = "",
}) => {
  return (
    <Card
      className={`bg-gradient-to-br from-pink-950/30 to-zinc-900 border border-pink-600/30 ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-pink-500/20 p-2 rounded-lg">
            <FileKey className="h-5 w-5 text-pink-400" />
          </div>
          <div>
            <CardTitle className="text-lg">ZK Compression Analysis</CardTitle>
            <p className="text-xs text-gray-400">
              Jupyter Notebook Visualization
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            {/* Performance Chart */}
            <div className="relative bg-pink-950/10 rounded-lg p-4 border border-pink-600/10 h-40">
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart3 className="h-24 w-24 text-pink-400/20" />
              </div>
              {/* Simulated bar chart */}
              <div className="relative z-10 h-full flex items-end justify-around">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "30%" }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="w-8 bg-pink-400/70 rounded-t-sm"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "40%" }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="w-8 bg-pink-400/70 rounded-t-sm"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "90%" }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="w-8 bg-pink-400 rounded-t-sm"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "25%" }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="w-8 bg-pink-400/70 rounded-t-sm"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "60%" }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="w-8 bg-pink-400/70 rounded-t-sm"
                />
              </div>
            </div>

            <div className="text-xs text-gray-400">
              <p>
                ZK Compression reduces transaction costs by up to 91% compared
                to standard transactions while maintaining the same security
                guarantees.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            {/* Transaction Chart */}
            <div className="relative bg-pink-950/10 rounded-lg p-4 border border-pink-600/10 h-40">
              <div className="absolute inset-0 flex items-center justify-center">
                <LineChart className="h-24 w-24 text-pink-400/20" />
              </div>
              {/* Simulated line chart */}
              <svg className="w-full h-full relative z-10" viewBox="0 0 100 50">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d="M 0,50 Q 15,45 30,25 Q 45,5 60,20 Q 75,35 100,10"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="text-xs text-gray-400">
              <p>
                Transaction volume using ZK Compression has increased by 347% in
                the last 30 days, demonstrating the scaling benefits.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            {/* Comparison Chart */}
            <div className="relative bg-pink-950/10 rounded-lg p-4 border border-pink-600/10 h-40">
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart2 className="h-24 w-24 text-pink-400/20" />
              </div>
              {/* Simulated comparison chart */}
              <div className="relative z-10 h-full flex items-end justify-around">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-gray-400 mb-1">
                    Standard
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "35%" }}
                    transition={{ duration: 0.7 }}
                    className="w-10 bg-gray-500/50 rounded-t-sm"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-gray-400 mb-1">ZK</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "95%" }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="w-10 bg-pink-400 rounded-t-sm"
                  />
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              <p>
                ZK Compression provides 95.2% data size reduction while
                increasing transaction throughput by 270% compared to standard
                methods.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ZkCompressionNotebook;
