import React from "react";
import { motion } from "framer-motion";
import { FileKey } from "lucide-react";
import { cn } from "@/lib/utils";

interface ZkBadgeProps {
  className?: string;
  dataSize?: string;
}

const ZkBadge: React.FC<ZkBadgeProps> = ({
  className = "",
  dataSize = "95.2%",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex items-center gap-1 bg-pink-950/30 border border-pink-600/20 rounded-full px-2 py-0.5 text-[10px]",
        className
      )}
    >
      <FileKey className="h-2.5 w-2.5 text-pink-400" />
      <span className="text-pink-400 font-medium">ZK {dataSize}</span>
    </motion.div>
  );
};

export default ZkBadge;
