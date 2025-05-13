import React from "react";
import { motion } from "framer-motion";
import { FileKey, Scissors, DollarSign, Lock } from "lucide-react";

interface ZkCompressionStatisticsProps {
  className?: string;
}

const ZkCompressionStatistics: React.FC<ZkCompressionStatisticsProps> = ({
  className = "",
}) => {
  // Sample data
  const zkStatistics = [
    {
      label: "Data Compression",
      value: "95%",
      icon: Scissors,
      description: "Reduction in data size",
    },
    {
      label: "Cost Savings",
      value: "91%",
      icon: DollarSign,
      description: "Lower transaction fees",
    },
    {
      label: "Privacy Level",
      value: "100%",
      icon: Lock,
      description: "Complete data protection",
    },
  ];

  return (
    <div
      className={`bg-midnight-black/50 backdrop-blur-md border border-pink-600/30 rounded-xl p-4 overflow-hidden relative ${className}`}
    >
      {/* Background effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>

      <div className="flex items-center gap-2 mb-4">
        <div className="bg-pink-500/20 p-2 rounded-lg">
          <FileKey className="h-5 w-5 text-pink-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-pink-400">
            ZK Compression Stats
          </h3>
          <p className="text-xs text-gray-400">
            Optimizing blockchain transactions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {zkStatistics.map((stat, index) => (
          <div
            key={index}
            className="bg-gunmetal-grey/30 rounded-lg p-3 border border-pink-600/20 flex flex-col items-center"
          >
            <div className="bg-pink-500/20 p-2 rounded-full mb-2">
              <stat.icon className="h-4 w-4 text-pink-400" />
            </div>
            <div className="text-lg font-bold text-white text-center">
              {stat.value}
            </div>
            <div className="text-xs text-gray-400 text-center mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gunmetal-grey/30 rounded-lg p-4 border border-pink-600/20 mb-4">
        <h4 className="text-sm font-medium text-pink-400 mb-3">
          How ZK Compression Works
        </h4>

        <div className="flex justify-between items-center h-16 mb-3 relative">
          {/* Connection lines */}
          <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-pink-600/20"></div>

          {/* Steps */}
          <div className="w-[25%] flex flex-col items-center z-10">
            <div className="h-10 w-10 rounded-full bg-pink-800/30 border border-pink-600/30 flex items-center justify-center mb-1">
              <span className="text-xs text-pink-400">1</span>
            </div>
            <span className="text-[10px] text-gray-400 text-center">
              Data Collection
            </span>
          </div>

          <div className="w-[25%] flex flex-col items-center z-10">
            <div className="h-10 w-10 rounded-full bg-pink-800/30 border border-pink-600/30 flex items-center justify-center mb-1">
              <span className="text-xs text-pink-400">2</span>
            </div>
            <span className="text-[10px] text-gray-400 text-center">
              Compression
            </span>
          </div>

          <div className="w-[25%] flex flex-col items-center z-10">
            <div className="h-10 w-10 rounded-full bg-pink-800/30 border border-pink-600/30 flex items-center justify-center mb-1">
              <span className="text-xs text-pink-400">3</span>
            </div>
            <span className="text-[10px] text-gray-400 text-center">
              ZK Proof
            </span>
          </div>

          <div className="w-[25%] flex flex-col items-center z-10">
            <div className="h-10 w-10 rounded-full bg-pink-800/30 border border-pink-600/30 flex items-center justify-center mb-1">
              <span className="text-xs text-pink-400">4</span>
            </div>
            <span className="text-[10px] text-gray-400 text-center">
              Validation
            </span>
          </div>
        </div>

        {/* Data packet animation */}
        <div className="relative h-4 bg-gunmetal-grey/60 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: ["0%", "100%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
            className="absolute top-1 bottom-1 left-1 w-6 bg-pink-400 rounded-full"
          />
        </div>

        <p className="text-xs text-gray-400 text-center">
          ZK Compression reduces data size while maintaining data integrity and
          privacy
        </p>
      </div>

      <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-pink-600/20">
        <h4 className="text-sm font-medium text-pink-400 mb-2">
          Benefits Comparison
        </h4>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Traditional Blockchain</span>
              <span>High cost, low efficiency</span>
            </div>
            <div className="h-2 w-full bg-gunmetal-grey/40 rounded-full">
              <div className="h-full w-[25%] bg-gray-500 rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">ZK Compression</span>
              <span className="text-pink-400">Low cost, high efficiency</span>
            </div>
            <div className="h-2 w-full bg-gunmetal-grey/40 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "95%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-pink-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZkCompressionStatistics;
