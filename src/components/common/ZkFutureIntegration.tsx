import React, { useState } from "react";

const ZkFutureIntegration: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="mb-8 bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg p-1">
      <div className="border border-neon-green/30 rounded-lg bg-gray-900/70 backdrop-blur-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full rounded-lg p-4 text-left hover:bg-gray-800/30 transition"
        >
          <div className="flex items-center">
            <span className="bg-neon-green/20 p-2 rounded-full mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neon-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </span>
            <span className="text-lg font-medium text-neon-green">
              Future Integration Roadmap: ZK Compression in Strike
            </span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-neon-green transition-transform ${isOpen ? "transform rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="px-6 pb-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-neon-green mb-3">
                Our Vision: Revolutionizing Cricket Fantasy with ZK Compression
              </h3>
              <p className="text-gray-300 mb-4">
                Strike is positioned to transform the fantasy cricket experience
                in India and globally by leveraging Solana&apos;s ZK Compression
                technology. Our implementation will dramatically reduce gas fees
                and improve transaction throughput - addressing key pain points
                for our price-sensitive Indian market.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-950 rounded-lg p-4 border border-neon-green/10">
                <h4 className="font-medium text-neon-green mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Compressed Account Creation
                </h4>
                <p className="text-gray-300 text-sm">
                  Users will be able to create compressed accounts at{" "}
                  <span className="text-neon-green">160x lower cost</span>{" "}
                  compared to traditional Solana accounts, making onboarding
                  virtually frictionless even for users with minimal SOL.
                </p>
              </div>

              <div className="bg-gray-950 rounded-lg p-4 border border-neon-green/10">
                <h4 className="font-medium text-neon-green mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  ZK Compressed USDC
                </h4>
                <p className="text-gray-300 text-sm">
                  Our platform will utilize ZK compressed USDC tokens for
                  betting, reducing token account costs by up to{" "}
                  <span className="text-neon-green">5000x</span>. This makes
                  microtransactions truly viable, allowing users to participate
                  with smaller amounts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-950 rounded-lg p-4 border border-neon-green/10">
                <h4 className="font-medium text-neon-green mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                  Compressed NFT Marketplace
                </h4>
                <p className="text-gray-300 text-sm">
                  Our NFT marketplace will feature player cards and collectibles
                  as compressed NFTs, allowing for rich metadata at a fraction
                  of the cost. Users can buy, sell, and trade these NFTs using
                  compressed tokens.
                </p>
              </div>

              <div className="bg-gray-950 rounded-lg p-4 border border-neon-green/10">
                <h4 className="font-medium text-neon-green mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                  Real-time Betting with ZK State Channels
                </h4>
                <p className="text-gray-300 text-sm">
                  We&apos;ll implement ZK state channels for real-time betting
                  during live matches, enabling instantaneous settlements with
                  cryptographic guarantees while minimizing on-chain footprint.
                </p>
              </div>
            </div>

            <div className="bg-gray-950 rounded-lg p-4 border border-neon-green/10 mb-6">
              <h4 className="font-medium text-neon-green mb-3">
                Impact on Indian Market
              </h4>
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center mt-0.5">
                  <span className="text-neon-green text-xs">₹</span>
                </div>
                <p className="text-gray-300 text-sm">
                  The Indian fantasy sports market is projected to reach $5
                  billion by 2025, but high transaction costs remain a barrier.
                  With ZK Compression, Strike will reduce fees by orders of
                  magnitude, making our platform accessible to millions of
                  cricket fans across India - from major metros to tier 2 and 3
                  cities.
                </p>
              </div>
            </div>

            <div className="bg-neon-green/5 rounded-lg p-4 border border-neon-green/20">
              <h4 className="font-medium text-neon-green mb-2">
                Technical Implementation Roadmap
              </h4>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-300">
                <li>
                  Integrate compressed SPL token standard for in-platform USDC
                </li>
                <li>
                  Implement compressed NFT standard (cNFT) for player cards and
                  collectibles
                </li>
                <li>
                  Develop ZK state channels for real-time in-match betting with
                  instant settlements
                </li>
                <li>
                  Create gasless transaction relayers for first-time users (meta
                  transactions)
                </li>
                <li>
                  Build batched transaction processing for contest entries and
                  reward distributions
                </li>
              </ol>
              <div className="mt-4 text-xs text-neon-green">
                <span className="font-bold">Estimated gas savings:</span> Up to
                99.98% compared to traditional Solana transactions
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZkFutureIntegration;
