import { useState, useEffect, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { useZkCompression } from "@/contexts/ZkCompressionContext";
import {
  createCompressedTokenMint,
  mintCompressedTokens,
  transferCompressedTokens,
  getConnectionStatus,
  getCompressedTokenBalance,
} from "@/services/zkCompressionService";
import {
  notifySuccess,
  notifyError,
  formatPublicKey,
  copyToClipboard,
} from "@/utils/zkUtils";
import useZkLogger from "@/hooks/useZkLogger";
import ZkInfoCard from "@/components/common/ZkInfoCard";
import TokenBalanceCard from "@/components/common/TokenBalanceCard";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import ZkTutorial from "@/components/common/ZkTutorial";
import ZkDebugConsole from "@/components/common/ZkDebugConsole";
import ZkFutureIntegration from "@/components/common/ZkFutureIntegration";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";

export default function ZkCompression() {
  const {
    connection,
    payer,
    userWallet,
    mint,
    isLocalnet,
    connectionStatus,
    errorMessage,
    isLoading,
    switchNetwork,
    setMint,
    requestPayerAirdrop,
    requestUserAirdrop,
  } = useZkCompression();

  const [amount, setAmount] = useState<number>(1000000000);
  const [localNetStatus, setLocalNetStatus] = useState<
    "idle" | "checking" | "running" | "not-running"
  >("idle");
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null);
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [payerBalance, setPayerBalance] = useState<number | null>(null);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const updateBalances = useCallback(
    (
      type: "mint" | "transfer",
      targetWallet: "payer" | "user",
      amount: number
    ) => {
      if (type === "mint") {
        if (targetWallet === "payer") {
          setPayerBalance((prev) => (prev || 0) + amount / 1e9);
        } else {
          setUserBalance((prev) => (prev || 0) + amount / 1e9);
        }
      } else if (type === "transfer") {
        setPayerBalance((prev) => Math.max(0, (prev || 0) - amount / 1e9));
        setUserBalance((prev) => (prev || 0) + amount / 1e9);
      }
    },
    []
  );

  const fetchTokenBalances = () => {
    if (!mint || (!payer && !userWallet)) return;

    if (payer && payerBalance === null) {
      setPayerBalance(0);
    }
    if (userWallet && userBalance === null) {
      setUserBalance(0);
    }
  };

  const handleCreateMint = async () => {
    if (!connection || !payer) return;

    try {
      setTransactionType("Create ZK Compressed Token Mint");
      setTransactionStatus("pending");
      setTransactionSignature(null);
      setLoadingMessage("Creating new ZK compressed token mint...");

      const { mint: newMint, transactionSignature: signature } =
        await createCompressedTokenMint(connection, payer);

      setMint(newMint);
      setTransactionSignature(signature);
      setTransactionStatus("success");

      console.log(`Created mint: ${newMint.toBase58()}`);
      console.log(`Transaction signature: ${signature}`);
      notifySuccess(
        "Mint Created",
        `Successfully created ZK compressed token mint`
      );
    } catch (error) {
      console.error("Error creating mint:", error);
      setTransactionStatus("error");
      notifyError(
        "Mint Creation Failed",
        error.message || "Failed to create ZK compressed token mint"
      );
    } finally {
      setLoadingMessage("");
    }
  };

  const handleMintToSelf = async () => {
    if (!connection || !payer || !mint) return;

    try {
      setTransactionType("Mint ZK Compressed Tokens to Self");
      setTransactionStatus("pending");
      setTransactionSignature(null);
      setLoadingMessage(`Minting ${amount / 1e9} tokens to your wallet...`);

      const signature = await mintCompressedTokens(
        connection,
        payer,
        mint,
        payer.publicKey,
        amount
      );

      updateBalances("mint", "payer", amount);
      setTransactionSignature(signature);
      setTransactionStatus("success");

      notifySuccess(
        "Tokens Minted",
        `Successfully minted ${amount / 1e9} ZK compressed tokens to your wallet`
      );
    } catch (error) {
      console.error("Error minting tokens to self:", error);
      setTransactionStatus("error");
      notifyError(
        "Minting Failed",
        error.message || "Failed to mint ZK compressed tokens"
      );
    } finally {
      setLoadingMessage("");
    }
  };

  const handleMintToUser = async () => {
    if (!connection || !payer || !userWallet || !mint) return;

    try {
      setTransactionType("Mint ZK Compressed Tokens to User");
      setTransactionStatus("pending");
      setTransactionSignature(null);
      setLoadingMessage(`Minting ${amount / 1e9} tokens to user wallet...`);

      const signature = await mintCompressedTokens(
        connection,
        payer,
        mint,
        userWallet.publicKey,
        amount
      );

      updateBalances("mint", "user", amount);
      setTransactionSignature(signature);
      setTransactionStatus("success");

      notifySuccess(
        "Tokens Minted to User",
        `Successfully minted ${amount / 1e9} ZK compressed tokens to user wallet`
      );
    } catch (error) {
      console.error("Error minting tokens to user:", error);
      setTransactionStatus("error");
      notifyError(
        "Minting to User Failed",
        error.message || "Failed to mint tokens to user wallet"
      );
    } finally {
      setLoadingMessage("");
    }
  };

  const handleTransferToUser = async () => {
    if (!connection || !payer || !userWallet || !mint) return;

    try {
      setTransactionType("Transfer ZK Compressed Tokens to User");
      setTransactionStatus("pending");
      setTransactionSignature(null);

      const transferAmount = Math.min(amount, amount / 2);
      setLoadingMessage(
        `Transferring ${transferAmount / 1e9} tokens to user wallet...`
      );

      const signature = await transferCompressedTokens(
        connection,
        payer,
        mint,
        transferAmount,
        payer,
        userWallet.publicKey
      );

      updateBalances("transfer", "user", transferAmount);
      setTransactionSignature(signature);
      setTransactionStatus("success");

      notifySuccess(
        "Tokens Transferred",
        `Successfully transferred ${transferAmount / 1e9} ZK compressed tokens to user wallet`
      );
    } catch (error) {
      console.error("Error transferring tokens to user:", error);
      setTransactionStatus("error");
      notifyError(
        "Transfer Failed",
        error.message || "Failed to transfer ZK compressed tokens"
      );
    } finally {
      setLoadingMessage("");
    }
  };

  const checkLocalValidator = async () => {
    setLocalNetStatus("checking");
    try {
      if (!connection) {
        await switchNetwork(true);
      }

      if (connection) {
        const status = await getConnectionStatus(connection);
        console.log("Validator status:", status);
        setLocalNetStatus(status ? "running" : "not-running");
      }
    } catch (error) {
      console.error("Error checking local validator:", error);
      setLocalNetStatus("not-running");
    }
  };

  useEffect(() => {
    if (mint && (payer?.publicKey || userWallet?.publicKey)) {
      fetchTokenBalances();
    }
  }, [
    mint?.toBase58(),
    payer?.publicKey?.toBase58(),
    userWallet?.publicKey?.toBase58(),
  ]);

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <LoadingOverlay isVisible={!!loadingMessage} message={loadingMessage} />

        <h1 className="text-3xl font-bold text-neon-green mb-8">
          ZK Compression Demo
        </h1>

        <ZkTutorial />

        <ZkFutureIntegration />

        <ZkInfoCard />

        <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-neon-green/20">
          <h2 className="text-xl font-semibold text-neon-green mb-4">
            Connection Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-300 mb-2">
                Network: {isLocalnet ? "Localnet" : "Devnet"}
              </p>
              {connectionStatus && (
                <>
                  <p className="text-gray-300 mb-2">
                    Current Slot: {connectionStatus.slot}
                  </p>
                  <p className="text-gray-300 mb-2">
                    Indexer Health: {JSON.stringify(connectionStatus.health)}
                  </p>
                </>
              )}
            </div>

            <div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => switchNetwork(true)}
                  disabled={isLoading || isLocalnet}
                  className="bg-gray-800 hover:bg-gray-700 text-neon-green disabled:text-gray-500 px-4 py-2 rounded-md transition"
                >
                  Switch to Localnet
                </button>

                <button
                  onClick={() => switchNetwork(false)}
                  disabled={isLoading || !isLocalnet}
                  className="bg-gray-800 hover:bg-gray-700 text-neon-green disabled:text-gray-500 px-4 py-2 rounded-md transition"
                >
                  Switch to Devnet
                </button>

                <button
                  onClick={checkLocalValidator}
                  disabled={isLoading || !isLocalnet}
                  className="bg-gray-800 hover:bg-gray-700 text-neon-green disabled:text-gray-500 px-4 py-2 rounded-md transition"
                >
                  Check Local Validator
                </button>

                {localNetStatus === "checking" && (
                  <p className="text-yellow-500">
                    Checking local validator status...
                  </p>
                )}
                {localNetStatus === "running" && (
                  <p className="text-green-500">
                    Local validator is running! ✅
                  </p>
                )}
                {localNetStatus === "not-running" && (
                  <div>
                    <p className="text-red-500 mb-2">
                      Local validator is not running ❌
                    </p>
                    <p className="text-gray-400 text-sm">
                      Run{" "}
                      <code className="bg-gray-800 px-1 py-0.5 rounded">
                        light test-validator
                      </code>{" "}
                      in your terminal
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-900/30 border border-red-500 rounded-md p-3 mt-4">
              <p className="text-red-400">{errorMessage}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-neon-green/20">
          <h2 className="text-xl font-semibold text-neon-green mb-4">
            ZK Compression Wallets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-700 rounded-md p-4">
              <h3 className="text-lg font-medium text-neon-green mb-2">
                Payer Wallet (Admin)
              </h3>
              {payer ? (
                <>
                  <p
                    className="text-gray-300 break-all mb-4 cursor-pointer hover:text-neon-green transition"
                    onClick={() =>
                      copyToClipboard(
                        payer.publicKey.toBase58(),
                        "Payer wallet address copied"
                      )
                    }
                  >
                    {payer.publicKey.toBase58()}
                    <span className="ml-2 text-xs text-gray-500">
                      (click to copy)
                    </span>
                  </p>
                  <button
                    onClick={requestPayerAirdrop}
                    disabled={isLoading || !connection}
                    className="bg-gray-800 hover:bg-gray-700 text-neon-green disabled:text-gray-500 px-4 py-2 rounded-md transition"
                  >
                    Request SOL Airdrop
                  </button>
                </>
              ) : (
                <p className="text-gray-400">Wallet not initialized</p>
              )}
            </div>

            <div className="border border-gray-700 rounded-md p-4">
              <h3 className="text-lg font-medium text-neon-green mb-2">
                User Wallet
              </h3>
              {userWallet ? (
                <>
                  <p
                    className="text-gray-300 break-all mb-4 cursor-pointer hover:text-neon-green transition"
                    onClick={() =>
                      copyToClipboard(
                        userWallet.publicKey.toBase58(),
                        "User wallet address copied"
                      )
                    }
                  >
                    {userWallet.publicKey.toBase58()}
                    <span className="ml-2 text-xs text-gray-500">
                      (click to copy)
                    </span>
                  </p>
                  <button
                    onClick={requestUserAirdrop}
                    disabled={isLoading || !connection}
                    className="bg-gray-800 hover:bg-gray-700 text-neon-green disabled:text-gray-500 px-4 py-2 rounded-md transition"
                  >
                    Request SOL Airdrop
                  </button>
                </>
              ) : (
                <p className="text-gray-400">Wallet not initialized</p>
              )}
            </div>
          </div>
        </div>

        <TokenBalanceCard
          mint={mint}
          payerBalance={payerBalance}
          userBalance={userBalance}
          isLoading={isBalanceLoading}
          onRefreshClick={fetchTokenBalances}
        />

        <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-neon-green/20">
          <h2 className="text-xl font-semibold text-neon-green mb-4">
            ZK Compressed Token Operations
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-neon-green mb-2">
              Token Mint
            </h3>
            {mint ? (
              <p
                className="text-gray-300 break-all mb-4 cursor-pointer hover:text-neon-green transition"
                onClick={() =>
                  copyToClipboard(mint.toBase58(), "Token mint address copied")
                }
              >
                Current Mint: {mint.toBase58()}
                <span className="ml-2 text-xs text-gray-500">
                  (click to copy)
                </span>
              </p>
            ) : (
              <p className="text-yellow-500 mb-4">
                No token mint created yet. Create one below.
              </p>
            )}

            <button
              onClick={handleCreateMint}
              disabled={isLoading || !connection || !payer}
              className="bg-gray-800 hover:bg-gray-700 text-neon-green disabled:text-gray-500 px-4 py-2 rounded-md transition"
            >
              Create New ZK Compressed Token Mint
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-neon-green mb-2">
              Token Amount
            </h3>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={amount / 1e9}
                onChange={(e) => setAmount(parseFloat(e.target.value) * 1e9)}
                className="bg-gray-800 border border-gray-700 rounded-md p-2 text-white w-32"
              />
              <span className="text-gray-300">tokens (with 9 decimals)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleMintToSelf}
              disabled={isLoading || !connection || !payer || !mint}
              className="bg-gray-800 hover:bg-gray-700 text-neon-green disabled:text-gray-500 px-4 py-2 rounded-md transition"
            >
              Mint to Payer
            </button>

            <button
              onClick={handleMintToUser}
              disabled={
                isLoading || !connection || !payer || !mint || !userWallet
              }
              className="bg-gray-800 hover:bg-gray-700 text-neon-green disabled:text-gray-500 px-4 py-2 rounded-md transition"
            >
              Mint to User
            </button>

            <button
              onClick={handleTransferToUser}
              disabled={
                isLoading || !connection || !payer || !mint || !userWallet
              }
              className="bg-gray-800 hover:bg-gray-700 text-neon-green disabled:text-gray-500 px-4 py-2 rounded-md transition"
            >
              Transfer to User
            </button>
          </div>
        </div>

        {transactionType && (
          <div className="bg-gray-900 rounded-lg p-6 border border-neon-green/20">
            <h2 className="text-xl font-semibold text-neon-green mb-4">
              Transaction Status
            </h2>

            <p className="text-gray-300 mb-2">Operation: {transactionType}</p>

            <p className="mb-4">
              Status:{" "}
              {transactionStatus === "pending" && (
                <span className="text-yellow-500">Pending...</span>
              )}
              {transactionStatus === "success" && (
                <span className="text-green-500">Success! ✅</span>
              )}
              {transactionStatus === "error" && (
                <span className="text-red-500">Failed ❌</span>
              )}
            </p>

            {transactionSignature && (
              <div>
                <p className="text-gray-300 mb-2">Transaction Signature:</p>
                <p
                  className="text-gray-400 break-all bg-gray-800 p-3 rounded-md cursor-pointer hover:bg-gray-700 transition"
                  onClick={() =>
                    copyToClipboard(
                      transactionSignature,
                      "Transaction signature copied"
                    )
                  }
                >
                  {transactionSignature}
                  <span className="ml-2 text-xs text-gray-500">
                    (click to copy)
                  </span>
                </p>

                {!isLocalnet && (
                  <a
                    href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-green hover:underline mt-2 inline-block"
                  >
                    View on Solana Explorer →
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        <ZkDebugConsole isEnabled={true} />
      </div>
      <Navbar />
    </PageContainer>
  );
}
