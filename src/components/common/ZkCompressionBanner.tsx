import React from "react";
import { motion } from "framer-motion";
import { FileKey, ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ZkCompressionBannerProps {
  className?: string;
  compact?: boolean;
}

const ZkCompressionBanner: React.FC<ZkCompressionBannerProps> = ({
  className = "",
  compact = false,
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-950 to-purple-900 opacity-50"></div>

      {/* Animated background pattern */}
      <motion.div
        initial={{ backgroundPosition: "0% 0%" }}
        animate={{ backgroundPosition: "100% 100%" }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"
      ></motion.div>

      {/* Glowing accent */}
      <div className="absolute h-px top-0 left-5 right-5 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
      <div className="absolute h-px bottom-0 left-5 right-5 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>

      {/* Content container */}
      <div className={`relative z-10 ${compact ? "px-4 py-3" : "px-6 py-4"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-pink-500/20 p-2 rounded-lg">
              <FileKey className="h-5 w-5 text-pink-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`font-bold ${compact ? "text-sm" : "text-base"} text-pink-400`}
                >
                  Powered by ZK Compression
                </h3>

                {!compact && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-2 w-2 bg-pink-400 rounded-full"
                  ></motion.div>
                )}
              </div>

              {!compact && (
                <p className="text-xs text-gray-300">
                  95% reduced transaction costs with zero-knowledge proofs
                </p>
              )}
            </div>
          </div>

          <Link to="/zk-compression">
            <Button
              variant="ghost"
              size={compact ? "sm" : "default"}
              className="text-pink-400 hover:text-pink-300 hover:bg-pink-950/50"
            >
              Learn More
              <ArrowRight
                className={`ml-2 ${compact ? "h-3 w-3" : "h-4 w-4"}`}
              />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ZkCompressionBanner;
