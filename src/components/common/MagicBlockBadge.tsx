import React from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MagicBlockBadgeProps {
  className?: string;
}

const MagicBlockBadge: React.FC<MagicBlockBadgeProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 bg-yellow-500/20 px-1.5 py-0.5 rounded-sm",
        className
      )}
    >
      <Zap className="w-3 h-3 text-yellow-400" />
      <span className="text-[10px] font-medium text-yellow-400">
        MagicBlock
      </span>
    </div>
  );
};

export default MagicBlockBadge;
