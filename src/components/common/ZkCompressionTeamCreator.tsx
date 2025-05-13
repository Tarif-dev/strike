import React from "react";
import { motion } from "framer-motion";
import { FileKey, Zap, Shield, ChevronRight, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ZkCompressionTeamCreatorProps {
  className?: string;
  teamSize?: number;
  maxCapacity?: number;
}

const ZkCompressionTeamCreator: React.FC<ZkCompressionTeamCreatorProps> = ({
  className = "",
  teamSize = 0,
  maxCapacity = 11,
}) => {
  // Calculate the progress percentage
  const progressPercentage = (teamSize / maxCapacity) * 100;

  return (
    <Card
      className={`bg-gradient-to-br from-pink-950/30 to-zinc-900 border border-pink-600/30 ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-pink-500/20 p-2 rounded-lg">
              <FileKey className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <CardTitle className="text-lg">ZK Compression</CardTitle>
            </div>
          </div>
          <Badge
            variant="outline"
            className="bg-pink-950/30 text-pink-400 border-pink-600/20"
          >
            {teamSize}/{maxCapacity} Players
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar for team creation */}
        <div className="space-y-2">
          <div className="w-full bg-pink-950/20 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="bg-pink-500 h-full rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>ZK Compression Active</span>
            <span>{progressPercentage.toFixed(0)}% Complete</span>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div className="bg-pink-950/20 rounded-lg p-3 border border-pink-600/10">
            <div className="flex items-center mb-1">
              <Zap className="h-4 w-4 text-pink-400 mr-2" />
              <span className="text-sm text-gray-300">Fast Updates</span>
            </div>
            <p className="text-xs text-gray-400">Real-time team verification</p>
          </div>

          <div className="bg-pink-950/20 rounded-lg p-3 border border-pink-600/10">
            <div className="flex items-center mb-1">
              <Shield className="h-4 w-4 text-pink-400 mr-2" />
              <span className="text-sm text-gray-300">Low Gas</span>
            </div>
            <p className="text-xs text-gray-400">
              91% reduced transaction fees
            </p>
          </div>
        </div>

        {/* Info about ZK Compression */}
        <div className="text-xs text-gray-400 bg-pink-950/10 p-3 rounded-lg border border-pink-600/10">
          Your team data is being compressed using Zero-Knowledge proofs to
          minimize on-chain storage costs while maintaining data integrity.
        </div>

        {/* Learn more button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-pink-400 hover:bg-pink-950/30 hover:text-pink-300 border border-pink-600/20 gap-1"
        >
          Learn about ZK Compression
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ZkCompressionTeamCreator;
