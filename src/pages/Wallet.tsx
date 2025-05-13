import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wallet as WalletIcon,
  ArrowLeft,
  CreditCard,
  CopyIcon,
  Clock,
  FileText,
  ArrowDown,
  ArrowUp,
  Plus,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Check,
  ChevronRight,
  Building,
  Landmark,
  DollarSign,
  ChevronDown,
  Banknote,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  ConfirmedSignatureInfo,
  ParsedTransactionWithMeta,
} from "@solana/web3.js";

// Import Solana wallet adapter
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-base";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

// Solana web3 imports
import * as web3 from "@solana/web3.js";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { url } from "inspector";
import USDCLOGO from "@/components/icons/usdc.png";
import SolanaLogo from "@/components/icons/solana.png";
// Mock data
const transactionHistory = [
  {
    id: 1,
    type: "deposit",
    amount: 500,
    date: "2025-04-15T10:23:45",
    method: "UPI",
    status: "completed",
    reference: "ABCD1234",
  },
  {
    id: 2,
    type: "withdrawal",
    amount: 1200,
    date: "2025-04-12T16:45:22",
    method: "Bank Transfer",
    status: "completed",
    reference: "WXYZ5678",
  },
  {
    id: 3,
    type: "contest",
    amount: 2000,
    date: "2025-04-10T20:15:30",
    contestName: "IPL Mega Contest",
    matchName: "MI vs CSK",
    status: "completed",
    reference: "WIN789012",
  },
  {
    id: 4,
    type: "deposit",
    amount: 1000,
    date: "2025-04-07T08:30:15",
    method: "Credit Card",
    status: "completed",
    reference: "PQRS3456",
  },
  {
    id: 5,
    type: "contest",
    amount: -100,
    date: "2025-04-05T19:45:10",
    contestName: "T20 Daily",
    matchName: "RCB vs KKR",
    status: "completed",
    reference: "ENT567890",
  },
];

// USDC token mint address on Solana devnet
const USDC_MINT = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");

const Wallet = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("web3");

  // Solana wallet adapter hooks
  const wallet = useWallet();
  const { publicKey, connected, connecting, select, disconnect } = wallet;
  const { connection } = useConnection();
  const { setVisible, visible } = useWalletModal();

  // For handling direct wallet selection
  const [selectedWalletName, setSelectedWalletName] = useState(null);

  // Token balance states
  const [solBalance, setSolBalance] = useState(null);
  const [usdcBalance, setUsdcBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWeb3Network, setSelectedWeb3Network] = useState("solana");
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionError, setTransactionError] = useState(null);

  // Add these imports at the top of your file

  // Add this function to fetch real transaction history
  const fetchTransactionHistory = async () => {
    if (!publicKey || !connection) return;

    try {
      setTransactionsLoading(true);
      setTransactionError(null);

      // Get recent transaction signatures (last 10 transactions)
      const signatures = await connection.getSignaturesForAddress(
        publicKey,
        { limit: 10 },
        "confirmed"
      );

      if (signatures.length === 0) {
        setWalletTransactions([]);
        return;
      }

      // Fetch transaction details for each signature
      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const tx = await connection.getParsedTransaction(
              sig.signature,
              "confirmed"
            );
            return {
              signature: sig.signature,
              timestamp: sig.blockTime ? new Date(sig.blockTime * 1000) : null,
              status: sig.err ? "failed" : "completed",
              details: tx,
              // Try to determine if it's a SOL transfer or token transfer
              type: getTransactionType(tx),
              amount: getTransactionAmount(tx, publicKey.toString()),
            };
          } catch (err) {
            console.error("Error fetching transaction details:", err);
            return {
              signature: sig.signature,
              timestamp: sig.blockTime ? new Date(sig.blockTime * 1000) : null,
              status: "unknown",
              error: err.message,
            };
          }
        })
      );

      setWalletTransactions(transactions);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      setTransactionError(error.message);
      toast({
        title: "Error Fetching Transactions",
        description: "Could not load your transaction history.",
        variant: "destructive",
      });
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Helper functions to determine transaction type and amount
  const getTransactionType = (tx) => {
    if (!tx || !tx.meta) return "unknown";

    try {
      // Check for SOL transfers
      if (
        tx.transaction?.message?.instructions.some(
          (instr) =>
            instr.program === "system" &&
            ["transfer", "transferWithSeed"].includes(instr.parsed?.type)
        )
      ) {
        return "sol-transfer";
      }

      // Check for SPL token transfers
      if (
        tx.transaction?.message?.instructions.some(
          (instr) =>
            instr.program === "spl-token" &&
            ["transfer", "transferChecked"].includes(instr.parsed?.type)
        )
      ) {
        return "token-transfer";
      }

      return "other";
    } catch (e) {
      return "unknown";
    }
  };

  const getTransactionAmount = (tx, walletAddress) => {
    if (!tx || !tx.meta) return null;

    try {
      // For SOL transfers
      if (tx.transaction?.message?.instructions) {
        const transferInstruction = tx.transaction.message.instructions.find(
          (instr) =>
            instr.program === "system" &&
            ["transfer", "transferWithSeed"].includes(instr.parsed?.type)
        );

        if (transferInstruction) {
          const info = transferInstruction.parsed.info;
          // Determine if this wallet is sender or receiver
          const isSender = info.source === walletAddress;
          const amount = info.lamports / LAMPORTS_PER_SOL;
          return {
            amount: isSender ? -amount : amount,
            token: "SOL",
          };
        }
      }

      // For more complex transactions, just show balance change
      // This is a simplified approach - full parsing is complex
      const postBalances = tx.meta.postBalances;
      const preBalances = tx.meta.preBalances;

      // Find this wallet's index in the accounts array
      const accountIndex = tx.transaction.message.accountKeys.findIndex(
        (key) => key.pubkey.toString() === walletAddress
      );

      if (accountIndex !== -1) {
        const balanceChange =
          (postBalances[accountIndex] - preBalances[accountIndex]) /
          LAMPORTS_PER_SOL;
        return {
          amount: balanceChange,
          token: "SOL",
        };
      }

      return null;
    } catch (e) {
      console.error("Error parsing transaction amount:", e);
      return null;
    }
  };

  // Add this to load transaction history when connected
  useEffect(() => {
    if (connected && publicKey && activeTab === "history") {
      fetchTransactionHistory();
    }
  }, [connected, publicKey, activeTab]);

  // Format public key for display
  const formatPublicKey = (key) => {
    if (!key) return "";
    const keyStr = key.toString();
    return `${keyStr.substring(0, 4)}...${keyStr.substring(keyStr.length - 4)}`;
  };

  // Copy address to clipboard
  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  // Connect wallet function (tries direct selection first, then falls back to modal)

  // Handle connection errors and show helpful messages
  useEffect(() => {
    console.log("Wallet connection state:", { connecting, connected });
    if (!connecting && !connected && selectedWalletName) {
      // If we tried to connect but failed, show an error message
      setTimeout(() => {
        toast({
          title: "Wallet Connection Failed",
          description:
            "Please make sure your wallet is installed and unlocked, then try again.",
          variant: "destructive",
        });
        setSelectedWalletName(null);
      }, 1000);
    }
  }, [connecting, connected, selectedWalletName]);

  // Fetch token balances with enhanced error handling
  const fetchBalances = async () => {
    if (!publicKey || !connection) return;

    try {
      setIsLoading(true);

      // Fetch SOL balance
      const balance = await connection.getBalance(publicKey);
      setSolBalance(balance / LAMPORTS_PER_SOL);

      // Create a devnet connection explicitly for token accounts
      const devnetConnection = new web3.Connection(
        clusterApiUrl("devnet"),
        "confirmed"
      );

      // Fetch USDC balance with extended timeout and retry logic
      try {
        // Try to get token accounts with explicit devnet connection
        const tokenAccounts =
          await devnetConnection.getParsedTokenAccountsByOwner(publicKey, {
            mint: USDC_MINT,
          });

        if (tokenAccounts.value.length > 0) {
          const tokenAccount = tokenAccounts.value[0];
          const accountData = tokenAccount.account.data.parsed.info;
          const tokenBalance = accountData.tokenAmount.uiAmount;
          setUsdcBalance(tokenBalance);
        } else {
          // No existing token account found, so balance is 0
          setUsdcBalance(0);
        }
      } catch (e) {
        console.error("Error fetching USDC balance:", e);
        setUsdcBalance(0);

        // Show a more specific error message
        if (e.message?.includes("token account not found")) {
          toast({
            title: "No USDC Account",
            description: "You don't have a USDC token account yet on devnet.",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching balances:", error);
      toast({
        title: "Balance Update Failed",
        description:
          "Could not fetch your latest balances. Network may be congested.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Connect and fetch balances when wallet state changes
  useEffect(() => {
    if (connected && publicKey) {
      // Add a small delay to ensure the connection is fully established
      const timer = setTimeout(() => {
        fetchBalances();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSolBalance(null);
      setUsdcBalance(null);
    }
  }, [connected, publicKey]);

  // Debug information for wallet status
  useEffect(() => {
    console.log("Wallet status:", {
      connected,
      connecting,
      publicKey: publicKey?.toString() || null,
      walletCount: wallet.wallets?.length || 0,
    });
  }, [connected, connecting, publicKey, wallet.wallets]);

  return (
    <>
      <PageContainer>
        <div className="space-y-6 mt-4">
          <Tabs
            defaultValue="web3"
            className="w-full"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="grid grid-cols-4 w-full bg-gray-900">
              <TabsTrigger
                value="web3"
                className="data-[state=active]:bg-violet-500 data-[state=active]:text-white"
              >
                <Banknote className="h-4 w-4 mr-2" />
                Web3
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-neon-green data-[state=active]:text-gray-900"
              >
                <Clock className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="web3" className="space-y-6 mt-6">
              {!connected ? (
                <Card className="bg-gray-900/60 border-gray-800">
                  <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                    <div className="h-16 w-16 bg-violet-500/20 rounded-full flex items-center justify-center mb-4">
                      <WalletIcon className="h-8 w-8 text-violet-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      Connect Your Solana Wallet
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-md">
                      Connect your Solana wallet to access Web3 features, view
                      USDC balance, and participate in exclusive contests.
                    </p>

                    {/* Replace custom button with Solana's WalletMultiButton */}
                    <div className="wallet-adapter-button-container">
                      <WalletMultiButton className="bg-violet-500 text-white hover:bg-violet-600" />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Web3 Network Selector */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Solana Wallet</h2>
                    <Select
                      value={selectedWeb3Network}
                      onValueChange={setSelectedWeb3Network}
                    >
                      <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
                        <SelectValue placeholder="Select Network" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="solana">Solana Devnet</SelectItem>
                        <SelectItem value="mainnet" disabled>
                          Solana Mainnet
                        </SelectItem>
                        <SelectItem value="testnet" disabled>
                          Solana Testnet
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Wallet Info */}
                  <Card className="bg-gray-900/60 border-gray-800">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Wallet Details</CardTitle>
                        <WalletDisconnectButton className="text-red-400 border-red-400/30 hover:bg-red-400/10 text-sm h-9 px-4 py-2" />
                      </div>
                      <CardDescription>
                        Your Solana wallet on the {selectedWeb3Network} network
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800/60 rounded-lg">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-violet-500/20 rounded-full flex items-center justify-center mr-3">
                            <WalletIcon className="h-5 w-5 text-violet-400" />
                          </div>
                          <div>
                            <p className="font-medium">Wallet Address</p>
                            <p className="text-sm text-gray-400">
                              {formatPublicKey(publicKey)}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={copyAddress}>
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Token Balances */}
                  <Card className="bg-gray-900/60 border-gray-800">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Token Balances</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchBalances}
                          disabled={isLoading}
                        >
                          <RefreshCw
                            className={`h-4 w-4 mr-2 ${
                              isLoading ? "animate-spin" : ""
                            }`}
                          />
                          Refresh
                        </Button>
                      </div>
                      <CardDescription>
                        Your crypto assets on the Solana devnet
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* SOL Balance */}
                      <div className="flex items-center justify-between p-3 bg-gray-800/60 rounded-lg">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                            <img
                              src={"/api/placeholder/20/20"}
                              alt="SOL"
                              className="h-5 w-5"
                            />
                          </div>
                          <div>
                            <p className="font-medium">Solana</p>
                            <p className="text-xs text-gray-400">SOL</p>
                          </div>
                        </div>
                        <p className="font-medium">
                          {isLoading ? (
                            <span className="text-gray-400">Loading...</span>
                          ) : solBalance !== null ? (
                            solBalance.toFixed(4)
                          ) : (
                            "0.0000"
                          )}
                        </p>
                      </div>

                      {/* USDC Balance */}
                      <div className="flex items-center justify-between p-3 bg-gray-800/60 rounded-lg">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                            <img
                              src={USDCLOGO}
                              alt="USDC"
                              className="h-15 w-15"
                            />
                          </div>
                          <div>
                            <p className="font-medium">USD Coin</p>
                            <p className="text-xs text-gray-400">USDC</p>
                          </div>
                        </div>
                        <p className="font-medium">
                          {isLoading ? (
                            <span className="text-gray-400">Loading...</span>
                          ) : usdcBalance !== null ? (
                            usdcBalance.toFixed(2)
                          ) : (
                            "0.00"
                          )}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          window.open(
                            `https://explorer.solana.com/address/${publicKey}?cluster=devnet`,
                            "_blank"
                          )
                        }
                      >
                        View on Solana Explorer
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>

                  <Alert className="bg-violet-500/10 border-violet-500/20 text-violet-400">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Web3 Security Notice</AlertTitle>
                    <AlertDescription>
                      You&apos;re connected to Solana&apos;s devnet. Tokens here
                      have no real value. Always verify transactions in your
                      wallet before signing.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </TabsContent>

            {/* History Tab */}
            {/* History Tab */}
            <TabsContent value="history" className="space-y-6 mt-6">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      Your Solana wallet transactions on {selectedWeb3Network}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={fetchTransactionHistory}
                      disabled={transactionsLoading || !connected}
                    >
                      <RefreshCw
                        className={`h-3.5 w-3.5 mr-1 ${
                          transactionsLoading ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() =>
                        window.open(
                          `https://explorer.solana.com/address/${publicKey}?cluster=devnet`,
                          "_blank"
                        )
                      }
                      disabled={!connected}
                    >
                      <ChevronDown className="h-3.5 w-3.5 mr-1" />
                      Explorer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {!connected ? (
                    <div className="flex flex-col items-center justify-center p-10 text-center">
                      <AlertTriangle className="h-8 w-8 text-gray-500 mb-2" />
                      <p className="text-gray-400">
                        Connect your wallet to view transaction history
                      </p>
                      <div className="mt-4">
                        <WalletMultiButton className="bg-violet-500 text-white hover:bg-violet-600" />
                      </div>
                    </div>
                  ) : transactionsLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-violet-400 mr-2" />
                      <span>Loading transaction history...</span>
                    </div>
                  ) : transactionError ? (
                    <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error loading transactions</AlertTitle>
                      <AlertDescription>{transactionError}</AlertDescription>
                    </Alert>
                  ) : walletTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Clock className="h-10 w-10 text-gray-500 mb-2" />
                      <p className="text-lg font-medium text-gray-300">
                        No transactions found
                      </p>
                      <p className="text-gray-400 max-w-md mt-1">
                        This wallet doesn&apos;t have any transactions on the{" "}
                        {selectedWeb3Network} network yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {walletTransactions.map((tx) => (
                        <div
                          key={tx.signature}
                          className="border-b border-gray-800 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 
                    ${
                      tx.type === "sol-transfer"
                        ? "bg-blue-500/20 text-blue-400"
                        : tx.type === "token-transfer"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                    }`}
                              >
                                {tx.type === "sol-transfer" && (
                                  <Banknote className="h-5 w-5" />
                                )}
                                {tx.type === "token-transfer" && (
                                  <CreditCard className="h-5 w-5" />
                                )}
                                {tx.type === "other" && (
                                  <FileText className="h-5 w-5" />
                                )}
                                {tx.type === "unknown" && (
                                  <AlertTriangle className="h-5 w-5" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {tx.type === "sol-transfer"
                                    ? "SOL Transfer"
                                    : tx.type === "token-transfer"
                                      ? "Token Transfer"
                                      : "Transaction"}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {tx.signature.substring(0, 8)}...
                                  {tx.signature.substring(
                                    tx.signature.length - 8
                                  )}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {tx.timestamp
                                    ? tx.timestamp.toLocaleString()
                                    : "Unknown time"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              {tx.amount && (
                                <p
                                  className={`font-semibold ${
                                    tx.amount.amount > 0
                                      ? "text-neon-green"
                                      : "text-white"
                                  }`}
                                >
                                  {tx.amount.amount > 0 ? "+" : ""}
                                  {tx.amount.amount.toFixed(4)}{" "}
                                  {tx.amount.token}
                                </p>
                              )}
                              <Badge
                                className={`${
                                  tx.status === "completed"
                                    ? "bg-green-500/20 text-green-500 border-green-500/30"
                                    : tx.status === "pending"
                                      ? "bg-amber-500/20 text-amber-500 border-amber-500/30"
                                      : "bg-red-500/20 text-red-500 border-red-500/30"
                                }`}
                              >
                                {tx.status.charAt(0).toUpperCase() +
                                  tx.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  `https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`,
                                  "_blank"
                                )
                              }
                            >
                              View details{" "}
                              <ChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-blue-600/20"></div>
            <Card className="bg-gray-900/60 border-0">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-bold mb-1">Refer & Earn</h3>
                    <p className="text-gray-400">
                      Invite friends and earn ₹100 for each referral
                    </p>
                  </div>
                  <Button className="bg-white text-gray-900 hover:bg-gray-200">
                    Invite Friends <ArrowLeft className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default Wallet;
