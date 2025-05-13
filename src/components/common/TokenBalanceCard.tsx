import React from "react";
import { PublicKey } from "@solana/web3.js";
import { formatTokenAmount } from "@/utils/zkUtils";

interface TokenBalanceCardProps {
  mint: PublicKey | null;
  payerBalance: number | null;
  userBalance: number | null;
  isLoading: boolean;
  onRefreshClick: () => void;
}

const TokenBalanceCard: React.FC<TokenBalanceCardProps> = ({
  mint,
  payerBalance,
  userBalance,
  isLoading,
  onRefreshClick,
}) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-neon-green/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-neon-green">
          Token Balances
        </h2>
        <button
          onClick={onRefreshClick}
          disabled={isLoading || !mint}
          className="bg-gray-800 hover:bg-gray-700 text-neon-green disabled:text-gray-500 px-4 py-2 rounded-md transition flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {!mint ? (
        <div className="text-yellow-500 p-4 bg-yellow-500/10 rounded-md">
          No token mint created yet. Create a token mint to view balances.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payer Balance */}
          <div className="border border-gray-700 rounded-md p-4">
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              Payer Wallet Balance
            </h3>
            {payerBalance !== null ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-neon-green">
                  {formatTokenAmount(payerBalance)}
                </span>
                <span className="ml-2 text-gray-400">tokens</span>
              </div>
            ) : (
              <div className="flex items-center animate-pulse">
                <div className="h-8 w-20 bg-gray-700 rounded"></div>
                <div className="ml-2 h-6 w-12 bg-gray-700 rounded"></div>
              </div>
            )}
          </div>

          {/* User Balance */}
          <div className="border border-gray-700 rounded-md p-4">
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              User Wallet Balance
            </h3>
            {userBalance !== null ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-neon-green">
                  {formatTokenAmount(userBalance)}
                </span>
                <span className="ml-2 text-gray-400">tokens</span>
              </div>
            ) : (
              <div className="flex items-center animate-pulse">
                <div className="h-8 w-20 bg-gray-700 rounded"></div>
                <div className="ml-2 h-6 w-12 bg-gray-700 rounded"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenBalanceCard;
