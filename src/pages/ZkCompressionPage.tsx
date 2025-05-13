import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import {
  FileKey,
  ArrowRight,
  Shield,
  BarChart3,
  Database,
  Layers,
  Cpu,
  Clock,
  ChevronRight,
  Code,
  Zap,
  Loader2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import ZkCompressionBanner from "@/components/common/ZkCompressionBanner";
import ZkCompressionMetrics from "@/components/common/ZkCompressionMetrics";
import ZkCompressionNotebook from "@/components/common/ZkCompressionNotebook";

// ZK Compression Demo Imports
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

const ZkCompressionPage = () => {
  // ZK Compression Demo State
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
    <>
      <Navbar />
      <PageContainer className="py-8">
        <div className="max-w-screen-xl mx-auto">
          {/* Hero Section */}
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 mb-4 px-3 py-1">
                ADVANCED BLOCKCHAIN TECHNOLOGY
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Zero-Knowledge Compression
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                A revolutionary approach to scaling blockchain data storage and
                reducing transaction costs
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ZkCompressionBanner className="rounded-xl mb-8" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card className="bg-pink-950/10 border border-pink-600/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-pink-500/20 p-3 rounded-lg mb-3">
                      <FileKey className="h-6 w-6 text-pink-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">
                      95% Data Compression
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Drastically reduce the on-chain footprint of your fantasy
                      cricket data
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-pink-950/10 border border-pink-600/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-pink-500/20 p-3 rounded-lg mb-3">
                      <Shield className="h-6 w-6 text-pink-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">
                      91% Lower Gas Fees
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Pay significantly less for transactions while maintaining
                      full security
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-pink-950/10 border border-pink-600/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-pink-500/20 p-3 rounded-lg mb-3">
                      <Zap className="h-6 w-6 text-pink-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">
                      Instant Verification
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Lightning-fast verification of compressed data with
                      zero-knowledge proofs
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Metrics Dashboard */}
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6">
                ZK Compression Statistics
              </h2>
              <ZkCompressionMetrics />
            </motion.div>
          </section>

          {/* Technical Details */}
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">Technical Details</h2>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="implementation">
                    Implementation
                  </TabsTrigger>
                  <TabsTrigger value="benchmark">Benchmarks</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card className="bg-gunmetal-grey/30 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Database className="h-5 w-5 text-pink-400 mr-2" />
                        How ZK Compression Works
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">
                        ZK Compression leverages zero-knowledge proofs to
                        represent large amounts of data with compact
                        mathematical proofs. In fantasy cricket, this means we
                        can store player statistics, match data, and team
                        compositions using a fraction of the blockchain space.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-pink-950/10 p-4 rounded-lg border border-pink-600/20">
                          <h4 className="font-bold mb-2 flex items-center">
                            <Layers className="h-4 w-4 text-pink-400 mr-2" />
                            Data Compression
                          </h4>
                          <p className="text-sm text-gray-400">
                            Original data is compressed using special algorithms
                            that can reduce storage requirements by up to 95%
                            while maintaining all critical information.
                          </p>
                        </div>

                        <div className="bg-pink-950/10 p-4 rounded-lg border border-pink-600/20">
                          <h4 className="font-bold mb-2 flex items-center">
                            <Shield className="h-4 w-4 text-pink-400 mr-2" />
                            Verification
                          </h4>
                          <p className="text-sm text-gray-400">
                            Zero-knowledge proofs allow anyone to verify the
                            compressed data is authentic without needing to
                            access the original uncompressed information.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <ZkCompressionNotebook />
                </TabsContent>

                <TabsContent value="implementation" className="space-y-6">
                  <Card className="bg-gunmetal-grey/30 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Code className="h-5 w-5 text-pink-400 mr-2" />
                        Implementation in Strike
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-300">
                          Strike implements ZK Compression at multiple levels of
                          the platform:
                        </p>

                        <div className="rounded-lg border border-pink-600/20 overflow-hidden">
                          <div className="bg-pink-950/10 p-4 border-b border-pink-600/20">
                            <h4 className="font-bold">
                              Player Data Compression
                            </h4>
                          </div>
                          <div className="p-4 bg-gunmetal-grey/20">
                            <pre className="text-sm overflow-x-auto">
                              <code className="text-pink-300">
                                {`// Example ZK Compression implementation for player data
const compressPlayerData = async (playerData) => {
  const { stats, history, performance } = playerData;
  
  // Create a merkle tree of player statistics
  const statsMerkleTree = await createMerkleTree(stats);
  
  // Generate ZK proof for performance data
  const zkProof = await generateZKProof(performance);
  
  // Compressed output is 95% smaller than original data
  return {
    merkleRoot: statsMerkleTree.root,
    proof: zkProof,
    metadata: compressMetadata(playerData.info)
  };
}`}
                              </code>
                            </pre>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                          <div className="bg-pink-950/10 p-4 rounded-lg border border-pink-600/20">
                            <h4 className="font-bold mb-2 flex items-center">
                              <Cpu className="h-4 w-4 text-pink-400 mr-2" />
                              On-chain Processing
                            </h4>
                            <p className="text-sm text-gray-400">
                              All computation for compression and verification
                              happens through specialized Solana programs
                            </p>
                          </div>

                          <div className="bg-pink-950/10 p-4 rounded-lg border border-pink-600/20">
                            <h4 className="font-bold mb-2 flex items-center">
                              <Zap className="h-4 w-4 text-pink-400 mr-2" />
                              Optimized Retrieval
                            </h4>
                            <p className="text-sm text-gray-400">
                              Efficient data retrieval through merkle proofs
                              without decompressing entire datasets
                            </p>
                          </div>

                          <div className="bg-pink-950/10 p-4 rounded-lg border border-pink-600/20">
                            <h4 className="font-bold mb-2 flex items-center">
                              <Clock className="h-4 w-4 text-pink-400 mr-2" />
                              Real-time Updates
                            </h4>
                            <p className="text-sm text-gray-400">
                              State updates can be verified in under 2 seconds
                              with minimal gas costs
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="benchmark" className="space-y-6">
                  <Card className="bg-gunmetal-grey/30 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 text-pink-400 mr-2" />
                        Performance Benchmarks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="relative h-72 bg-gunmetal-grey/20 rounded-lg border border-pink-600/10 p-6">
                          <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <BarChart3 className="h-24 w-24 text-pink-400" />
                          </div>

                          <h4 className="font-bold mb-6 text-center">
                            Data Size Comparison
                          </h4>

                          <div className="h-40 flex items-end justify-around">
                            <div className="flex flex-col items-center">
                              <div className="h-36 w-20 bg-gray-500/50 rounded-t-sm relative overflow-hidden">
                                <motion.div
                                  initial={{ height: "0%" }}
                                  animate={{ height: "100%" }}
                                  transition={{ duration: 1.5, delay: 0.5 }}
                                  className="absolute bottom-0 w-full bg-gray-600/70"
                                />
                                <div className="absolute bottom-2 w-full text-center text-white font-bold">
                                  100%
                                </div>
                              </div>
                              <span className="mt-2 text-sm">Standard</span>
                            </div>

                            <div className="flex flex-col items-center">
                              <div className="h-36 w-20 bg-pink-500/20 rounded-t-sm relative overflow-hidden">
                                <motion.div
                                  initial={{ height: "0%" }}
                                  animate={{ height: "5%" }}
                                  transition={{ duration: 1.5, delay: 0.8 }}
                                  className="absolute bottom-0 w-full bg-pink-500/70"
                                />
                                <div className="absolute bottom-2 w-full text-center text-white font-bold">
                                  5%
                                </div>
                              </div>
                              <span className="mt-2 text-sm">
                                ZK Compressed
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-pink-950/10 p-4 rounded-lg border border-pink-600/20">
                            <h4 className="font-bold mb-4">Gas Costs</h4>

                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm text-gray-400">
                                    Standard Transaction
                                  </span>
                                  <span className="text-sm">0.00025 SOL</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2 rounded-full">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                    className="bg-gray-500 h-full rounded-full"
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm text-gray-400">
                                    ZK Compressed
                                  </span>
                                  <span className="text-sm text-pink-400">
                                    0.000023 SOL
                                  </span>
                                </div>
                                <div className="w-full bg-gray-700 h-2 rounded-full">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "9%" }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="bg-pink-500 h-full rounded-full"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-pink-950/10 p-4 rounded-lg border border-pink-600/20">
                            <h4 className="font-bold mb-4">Processing Speed</h4>

                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm text-gray-400">
                                    Standard Verification
                                  </span>
                                  <span className="text-sm">5.2 seconds</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2 rounded-full">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                    className="bg-gray-500 h-full rounded-full"
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm text-gray-400">
                                    ZK Verification
                                  </span>
                                  <span className="text-sm text-pink-400">
                                    1.8 seconds
                                  </span>
                                </div>
                                <div className="w-full bg-gray-700 h-2 rounded-full">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "34.6%" }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="bg-pink-500 h-full rounded-full"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </section>

          {/* CTA Section */}
          <section className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center"
            >
              <Card className="bg-gradient-to-br from-pink-950/30 to-zinc-900 border border-pink-600/20 p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Experience ZK Compression in Action
                </h3>
                <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                  Create your fantasy cricket team now and see how ZK
                  Compression technology makes your experience faster and more
                  cost-effective.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    className="bg-pink-500 hover:bg-pink-400 text-white"
                  >
                    <Link to="/matches">
                      Browse Matches <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
                  >
                    <Link to="/docs/zk-compression">
                      Read Documentation{" "}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </section>

          {/* ZK Compression Demo Section */}
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h2 className="text-2xl font-bold text-pink-400 mb-6">
                ZK Compression Demo
              </h2>
              <div className="container mx-auto px-4 max-w-4xl">
                <LoadingOverlay
                  isVisible={!!loadingMessage}
                  message={loadingMessage}
                />

                <ZkTutorial />

                <ZkFutureIntegration />

                <ZkInfoCard />

                <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-pink-600/20">
                  <h2 className="text-xl font-semibold text-pink-400 mb-4">
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
                            Indexer Health:{" "}
                            {JSON.stringify(connectionStatus.health)}
                          </p>
                        </>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => switchNetwork(true)}
                          disabled={isLoading || isLocalnet}
                          className="bg-gray-800 hover:bg-gray-700 text-pink-400 disabled:text-gray-500 px-4 py-2 rounded-md transition"
                        >
                          Switch to Localnet
                        </button>

                        <button
                          onClick={() => switchNetwork(false)}
                          disabled={isLoading || !isLocalnet}
                          className="bg-gray-800 hover:bg-gray-700 text-pink-400 disabled:text-gray-500 px-4 py-2 rounded-md transition"
                        >
                          Switch to Devnet
                        </button>

                        <button
                          onClick={checkLocalValidator}
                          disabled={isLoading || !isLocalnet}
                          className="bg-gray-800 hover:bg-gray-700 text-pink-400 disabled:text-gray-500 px-4 py-2 rounded-md transition"
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

                <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-pink-600/20">
                  <h2 className="text-xl font-semibold text-pink-400 mb-4">
                    ZK Compression Wallets
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-700 rounded-md p-4">
                      <h3 className="text-lg font-medium text-pink-400 mb-2">
                        Payer Wallet (Admin)
                      </h3>
                      {payer ? (
                        <>
                          <p
                            className="text-gray-300 break-all mb-4 cursor-pointer hover:text-pink-400 transition"
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
                            className="bg-gray-800 hover:bg-gray-700 text-pink-400 disabled:text-gray-500 px-4 py-2 rounded-md transition"
                          >
                            Request SOL Airdrop
                          </button>
                        </>
                      ) : (
                        <p className="text-gray-400">Wallet not initialized</p>
                      )}
                    </div>

                    <div className="border border-gray-700 rounded-md p-4">
                      <h3 className="text-lg font-medium text-pink-400 mb-2">
                        User Wallet
                      </h3>
                      {userWallet ? (
                        <>
                          <p
                            className="text-gray-300 break-all mb-4 cursor-pointer hover:text-pink-400 transition"
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
                            className="bg-gray-800 hover:bg-gray-700 text-pink-400 disabled:text-gray-500 px-4 py-2 rounded-md transition"
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

                <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-pink-600/20">
                  <h2 className="text-xl font-semibold text-pink-400 mb-4">
                    ZK Compressed Token Operations
                  </h2>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-pink-400 mb-2">
                      Token Mint
                    </h3>
                    {mint ? (
                      <p
                        className="text-gray-300 break-all mb-4 cursor-pointer hover:text-pink-400 transition"
                        onClick={() =>
                          copyToClipboard(
                            mint.toBase58(),
                            "Token mint address copied"
                          )
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
                      className="bg-gray-800 hover:bg-gray-700 text-pink-400 disabled:text-gray-500 px-4 py-2 rounded-md transition"
                    >
                      Create New ZK Compressed Token Mint
                    </button>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-pink-400 mb-2">
                      Token Amount
                    </h3>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={amount / 1e9}
                        onChange={(e) =>
                          setAmount(parseFloat(e.target.value) * 1e9)
                        }
                        className="bg-gray-800 border border-gray-700 rounded-md p-2 text-white w-32"
                      />
                      <span className="text-gray-300">
                        tokens (with 9 decimals)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={handleMintToSelf}
                      disabled={isLoading || !connection || !payer || !mint}
                      className="bg-gray-800 hover:bg-gray-700 text-pink-400 disabled:text-gray-500 px-4 py-2 rounded-md transition"
                    >
                      Mint to Payer
                    </button>

                    <button
                      onClick={handleMintToUser}
                      disabled={
                        isLoading ||
                        !connection ||
                        !payer ||
                        !mint ||
                        !userWallet
                      }
                      className="bg-gray-800 hover:bg-gray-700 text-pink-400 disabled:text-gray-500 px-4 py-2 rounded-md transition"
                    >
                      Mint to User
                    </button>

                    <button
                      onClick={handleTransferToUser}
                      disabled={
                        isLoading ||
                        !connection ||
                        !payer ||
                        !mint ||
                        !userWallet
                      }
                      className="bg-gray-800 hover:bg-gray-700 text-pink-400 disabled:text-gray-500 px-4 py-2 rounded-md transition"
                    >
                      Transfer to User
                    </button>
                  </div>
                </div>

                {transactionType && (
                  <div className="bg-gray-900 rounded-lg p-6 border border-pink-600/20">
                    <h2 className="text-xl font-semibold text-pink-400 mb-4">
                      Transaction Status
                    </h2>

                    <p className="text-gray-300 mb-2">
                      Operation: {transactionType}
                    </p>

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
                        <p className="text-gray-300 mb-2">
                          Transaction Signature:
                        </p>
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
                            className="text-pink-400 hover:underline mt-2 inline-block"
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
            </motion.div>
          </section>

          <Separator className="my-8 bg-gray-800" />

          <footer className="text-center text-sm text-gray-500">
            <p>
              ZK Compression technology is powered by Solana&apos;s state
              compression features.
            </p>
            <p className="mt-1">
              © 2025 Strike Fantasy Cricket. All rights reserved.
            </p>
          </footer>
        </div>
      </PageContainer>
    </>
  );
};

export default ZkCompressionPage;
