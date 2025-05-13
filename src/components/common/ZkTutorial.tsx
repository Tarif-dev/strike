import React, { useState } from "react";

const ZkTutorial: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-gray-900 rounded-lg p-4 text-left border border-neon-green/20 hover:bg-gray-800 transition"
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <span className="text-lg font-medium text-neon-green">
            How to Use This Demo
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
        <div className="mt-4 bg-gray-900/70 rounded-lg p-6 border border-neon-green/10">
          <ol className="list-decimal pl-6 space-y-4">
            <li className="text-gray-300">
              <span className="font-medium text-neon-green">
                Start the local validator:
              </span>{" "}
              Run{" "}
              <code className="bg-gray-800 px-2 py-1 rounded text-pink-400">
                ./start-zk-validator.sh
              </code>{" "}
              in your terminal to start the local ZK Compression validator.
            </li>
            <li className="text-gray-300">
              <span className="font-medium text-neon-green">
                Check connection status:
              </span>{" "}
              Use the "Check Local Validator" button to verify the connection to
              the local validator.
            </li>
            <li className="text-gray-300">
              <span className="font-medium text-neon-green">
                Request SOL airdrops:
              </span>{" "}
              Request airdrops to both wallets to pay for transaction fees.
            </li>
            <li className="text-gray-300">
              <span className="font-medium text-neon-green">
                Create a token mint:
              </span>{" "}
              Use the "Create New ZK Compressed Token Mint" button to create a
              new compressed token.
            </li>
            <li className="text-gray-300">
              <span className="font-medium text-neon-green">Mint tokens:</span>{" "}
              Mint tokens to either the payer wallet or user wallet using the
              respective buttons.
            </li>
            <li className="text-gray-300">
              <span className="font-medium text-neon-green">
                Transfer tokens:
              </span>{" "}
              Transfer tokens from the payer wallet to the user wallet.
            </li>
            <li className="text-gray-300">
              <span className="font-medium text-neon-green">
                Check balances:
              </span>{" "}
              Use the refresh button in the Token Balances section to check
              current token balances.
            </li>
          </ol>

          <div className="mt-6 p-4 bg-gray-800 rounded-md">
            <h4 className="text-neon-green font-medium mb-2">
              Why ZK Compression?
            </h4>
            <p className="text-gray-300 text-sm">
              ZK Compression is a powerful Solana primitive that enables
              significant state compression, allowing millions of assets to be
              stored on-chain at a fraction of the traditional cost. By
              combining Zero-Knowledge proofs with state compression, it reduces
              on-chain storage requirements while maintaining security.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZkTutorial;
