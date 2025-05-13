import React from "react";
import { motion } from "framer-motion";
import { FileKey } from "lucide-react";

interface ZkCompressionPlayerBadgeProps {
  className?: string;
  dataSize?: string;
}

const ZkCompressionPlayerBadge: React.FC<ZkCompressionPlayerBadgeProps> = ({
  className = "",
  dataSize = "95.2%",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-2 bg-pink-950/30 border border-pink-600/20 rounded-full px-3 py-1 text-xs ${className}`}
    >
      <FileKey className="h-3 w-3 text-pink-400" />
      <span className="text-pink-400 font-medium">
        ZK Compressed {dataSize}
      </span>
    </motion.div>
  );
};

export default ZkCompressionPlayerBadge;
