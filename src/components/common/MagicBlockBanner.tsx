import React from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MagicBlockBannerProps {
  className?: string;
  compact?: boolean;
}

const MagicBlockBanner: React.FC<MagicBlockBannerProps> = ({
  className = "",
  compact = false,
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-950 to-yellow-900 opacity-50"></div>

      {/* Animated background pattern */}
      <motion.div
        initial={{ backgroundPosition: "0% 0%" }}
        animate={{ backgroundPosition: "100% 100%" }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"
      ></motion.div>

      {/* Glowing accent */}
      <div className="absolute h-px top-0 left-5 right-5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
      <div className="absolute h-px bottom-0 left-5 right-5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>

      {/* Content container */}
      <div className={`relative z-10 ${compact ? "px-4 py-3" : "px-6 py-4"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-yellow-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`font-bold ${compact ? "text-sm" : "text-base"} text-yellow-400`}
                >
                  Supercharged with MagicBlock
                </h3>

                {!compact && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-2 w-2 bg-yellow-400 rounded-full"
                  ></motion.div>
                )}
              </div>

              {!compact && (
                <p className="text-xs text-gray-300">
                  Ultra-fast, secure blockchain infrastructure for real-time
                  fantasy cricket
                </p>
              )}
            </div>
          </div>

          <Link to="/magicblock">
            <Button
              variant="ghost"
              size={compact ? "sm" : "default"}
              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-950/50"
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

export default MagicBlockBanner;
