import React from "react";
import {
  CircleCheck,
  CircleDashed,
  Coins,
  Database,
  ZapOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ZkInfoCard: React.FC = () => {
  const features = [
    {
      icon: Database,
      title: "Efficient Storage",
      description: "10,000x more data at the same cost",
      color: "text-blue-400",
    },
    {
      icon: CircleCheck,
      title: "Zero Knowledge Proofs",
      description: "Privacy-preserving compression",
      color: "text-green-400",
    },
    {
      icon: Coins,
      title: "Lower Costs",
      description: "Reduced on-chain storage fees",
      color: "text-yellow-400",
    },
    {
      icon: ZapOff,
      title: "State Compression",
      description: "Minimize blockchain bloat",
      color: "text-purple-400",
    },
  ];

  return (
    <div className="bg-gray-950 rounded-lg p-6 mb-8 border border-neon-green/20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-neon-green mb-6">
          About ZK Compression
        </h2>

        <div className="prose prose-invert max-w-none mb-8">
          <p className="text-gray-300">
            ZK Compression is a revolutionary Solana primitive that uses
            Zero-Knowledge proofs to compress on-chain data, enabling massive
            scalability improvements while maintaining security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 rounded-lg bg-gray-900/50 border border-gray-800"
            >
              <div
                className={cn("p-2 rounded-full bg-gray-800", feature.color)}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-neon-green mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-neon-green mb-2">
            Try it out!
          </h3>
          <p className="text-sm text-gray-300">
            This demo shows how to create and interact with compressed tokens on
            Solana. Start by connecting to the network and creating a new
            compressed token mint.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZkInfoCard;
