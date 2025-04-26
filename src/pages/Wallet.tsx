import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CreditCard,
  Wallet as WalletIcon,
  ReceiptText,
  Clock,
  Plus,
  Filter,
  Download,
  ArrowDown,
  ArrowUp,
  Settings,
  Shield,
  AlertCircle,
  Trophy,
  ExternalLink,
  Coins,
  Copy,
  Check,
} from "lucide-react";
import Header from "@/components/layout/Header";
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

// Payment methods
const savedPaymentMethods = [
  {
    id: 1,
    type: "card",
    name: "HDFC Credit Card",
    lastDigits: "4567",
    expiryDate: "06/26",
    isDefault: true,
  },
  {
    id: 2,
    type: "upi",
    name: "Google Pay",
    vpa: "user@okicici",
    isDefault: false,
  },
];

// Define token balances for Web3 wallet
const tokenBalances = [
  {
    name: "Ethereum",
    symbol: "ETH",
    balance: "0.45",
    value: 1350,
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    name: "USDC",
    symbol: "USDC",
    balance: "235.75",
    value: 235.75,
    icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  },
  {
    name: "MATIC",
    symbol: "MATIC",
    balance: "156.23",
    value: 187.48,
    icon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  },
  {
    name: "Strike Token",
    symbol: "STRIKE",
    balance: "500",
    value: 50,
    icon: "/placeholder.svg",
  },
];

// Define transaction history for Web3 wallet
const web3TransactionHistory = [
  {
    id: "0x1a2b3c4d5e6f",
    type: "deposit",
    tokenSymbol: "ETH",
    amount: "0.25",
    value: 750,
    timestamp: "2025-04-20T14:32:15",
    hash: "0x1a2b3c...4d5e6f",
    status: "confirmed",
  },
  {
    id: "0x7a8b9c0d1e2f",
    type: "withdraw",
    tokenSymbol: "USDC",
    amount: "100",
    value: 100,
    timestamp: "2025-04-18T09:45:22",
    hash: "0x7a8b9c...0d1e2f",
    status: "confirmed",
  },
  {
    id: "0x3c4d5e6f7a8b",
    type: "swap",
    tokenSymbol: "ETH",
    toTokenSymbol: "STRIKE",
    amount: "0.1",
    toAmount: "200",
    value: 300,
    timestamp: "2025-04-15T16:23:45",
    hash: "0x3c4d5e...6f7a8b",
    status: "confirmed",
  },
];

const Wallet = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("add-money");
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState("card");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  // Web3 related states
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedWeb3Network, setSelectedWeb3Network] = useState("ethereum");
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [connectWalletOpen, setConnectWalletOpen] = useState(false);
  const [swapTokenOpen, setSwapTokenOpen] = useState(false);
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("STRIKE");
  const [swapAmount, setSwapAmount] = useState("");

  // Predefined amounts
  const depositAmounts = [100, 500, 1000, 2000, 5000];
  const walletBalance = 4500;
  const withdrawableBalance = 3800;
  const bonusBalance = 700;

  // Calculate Web3 wallet total value
  const totalWeb3Value = tokenBalances.reduce(
    (acc, token) => acc + token.value,
    0
  );

  const handleQuickAmount = (amount: number) => {
    setAddAmount(amount.toString());
  };

  // Function to simulate connecting wallet
  const connectWallet = () => {
    setIsWalletConnected(true);
    setWalletAddress("0xABC...123def");
    toast({
      title: "Wallet Connected",
      description: "Your Web3 wallet has been successfully connected",
    });
    setConnectWalletOpen(false);
  };

  // Function to copy wallet address to clipboard
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    toast({
      title: "Wallet Disconnected",
      description: "Your Web3 wallet has been disconnected",
    });
  };

  return (
    <>
      <PageContainer>
        <Header title="Wallet" />

        <div className="space-y-6 mt-4">
          {/* Wallet cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Fiat Wallet card */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl p-6 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green/30 to-blue-600/30 rounded-xl blur-sm opacity-75"></div>
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>

              <div className="relative flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-lg text-gray-400 mb-1">Fiat Balance</h2>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">₹{walletBalance}</span>
                    <Badge className="ml-2 bg-neon-green/20 text-neon-green">
                      ₹{bonusBalance} Bonus
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Withdrawable: ₹{withdrawableBalance}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Dialog open={addMoneyOpen} onOpenChange={setAddMoneyOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-neon-green text-gray-900 hover:bg-neon-green/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Money
                      </Button>
                    </DialogTrigger>
                  </Dialog>

                  <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-neon-green/50 text-neon-green hover:bg-neon-green/10"
                      >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Withdraw
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Web3 Wallet card */}
            <div className="relative bg-gradient-to-br from-gray-900 to-violet-950 rounded-xl p-6 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/30 to-blue-600/30 rounded-xl blur-sm opacity-75"></div>
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>

              <div className="relative flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-lg text-gray-400 mb-1">Web3 Balance</h2>
                  {isWalletConnected ? (
                    <>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold">
                          ₹{totalWeb3Value}
                        </span>
                        <Badge className="ml-2 bg-violet-500/20 text-violet-400">
                          {tokenBalances.length} tokens
                        </Badge>
                      </div>
                      <div className="flex items-center mt-1 bg-gray-900/50 rounded-full py-1 px-2">
                        <span className="text-xs text-gray-400 truncate mr-2">
                          {walletAddress}
                        </span>
                        <button
                          onClick={copyAddressToClipboard}
                          className="text-violet-400 hover:text-violet-300"
                        >
                          {copiedAddress ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">No wallet connected</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {!isWalletConnected ? (
                    <Dialog
                      open={connectWalletOpen}
                      onOpenChange={setConnectWalletOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-violet-500 text-white hover:bg-violet-600">
                          <WalletIcon className="h-4 w-4 mr-2" />
                          Connect Wallet
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  ) : (
                    <>
                      <Dialog
                        open={swapTokenOpen}
                        onOpenChange={setSwapTokenOpen}
                      >
                        <DialogTrigger asChild>
                          <Button className="bg-violet-500 text-white hover:bg-violet-600">
                            <ArrowDown className="h-4 w-4 mr-2 rotate-45" />
                            Swap Tokens
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      <Button
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        onClick={disconnectWallet}
                      >
                        Disconnect
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            defaultValue="add-money"
            className="w-full"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="grid grid-cols-4 w-full bg-gray-900">
              <TabsTrigger
                value="add-money"
                className="data-[state=active]:bg-neon-green data-[state=active]:text-gray-900"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Money
              </TabsTrigger>
              <TabsTrigger
                value="withdraw"
                className="data-[state=active]:bg-neon-green data-[state=active]:text-gray-900"
              >
                <ArrowDown className="h-4 w-4 mr-2" />
                Withdraw
              </TabsTrigger>
              <TabsTrigger
                value="web3"
                className="data-[state=active]:bg-violet-500 data-[state=active]:text-white"
              >
                <Coins className="h-4 w-4 mr-2" />
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

            {/* Add Money Tab */}
            <TabsContent value="add-money" className="space-y-6 mt-6">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader>
                  <CardTitle>Add Money to Wallet</CardTitle>
                  <CardDescription>
                    Choose an amount and payment method
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount input */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">
                      Enter Amount (₹)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="bg-gray-800 border-gray-700 focus-visible:ring-neon-green"
                    />

                    <div className="flex flex-wrap gap-2 mt-3">
                      {depositAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          className="border-gray-700 hover:bg-neon-green/10 hover:border-neon-green"
                          onClick={() => handleQuickAmount(amount)}
                        >
                          ₹{amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card
                        className={`cursor-pointer border ${
                          depositMethod === "card"
                            ? "border-neon-green bg-neon-green/5"
                            : "border-gray-800 bg-gray-800/50"
                        }`}
                        onClick={() => setDepositMethod("card")}
                      >
                        <CardContent className="p-4 flex items-center">
                          <CreditCard
                            className={`h-5 w-5 mr-3 ${
                              depositMethod === "card"
                                ? "text-neon-green"
                                : "text-gray-400"
                            }`}
                          />
                          <span>Credit/Debit Card</span>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer border ${
                          depositMethod === "upi"
                            ? "border-neon-green bg-neon-green/5"
                            : "border-gray-800 bg-gray-800/50"
                        }`}
                        onClick={() => setDepositMethod("upi")}
                      >
                        <CardContent className="p-4 flex items-center">
                          <div
                            className={`h-5 w-5 mr-3 flex items-center justify-center ${
                              depositMethod === "upi"
                                ? "text-neon-green"
                                : "text-gray-400"
                            }`}
                          >
                            <span className="text-lg font-bold">U</span>
                          </div>
                          <span>UPI</span>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer border ${
                          depositMethod === "netbanking"
                            ? "border-neon-green bg-neon-green/5"
                            : "border-gray-800 bg-gray-800/50"
                        }`}
                        onClick={() => setDepositMethod("netbanking")}
                      >
                        <CardContent className="p-4 flex items-center">
                          <WalletIcon
                            className={`h-5 w-5 mr-3 ${
                              depositMethod === "netbanking"
                                ? "text-neon-green"
                                : "text-gray-400"
                            }`}
                          />
                          <span>Net Banking</span>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Saved payment methods */}
                  {(depositMethod === "card" || depositMethod === "upi") &&
                    savedPaymentMethods.filter(
                      (m) =>
                        (depositMethod === "card" && m.type === "card") ||
                        (depositMethod === "upi" && m.type === "upi")
                    ).length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">
                          Saved Payment Methods
                        </label>
                        <div className="space-y-2">
                          {savedPaymentMethods
                            .filter(
                              (m) =>
                                (depositMethod === "card" &&
                                  m.type === "card") ||
                                (depositMethod === "upi" && m.type === "upi")
                            )
                            .map((method) => (
                              <Card
                                key={method.id}
                                className="border-gray-800 bg-gray-800/50"
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      {method.type === "card" ? (
                                        <CreditCard className="h-5 w-5 mr-3 text-gray-400" />
                                      ) : (
                                        <div className="h-5 w-5 mr-3 flex items-center justify-center text-gray-400">
                                          <span className="text-lg font-bold">
                                            U
                                          </span>
                                        </div>
                                      )}
                                      <div>
                                        <p className="font-medium">
                                          {method.name}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                          {method.type === "card"
                                            ? `**** **** **** ${method.lastDigits} • Expires ${method.expiryDate}`
                                            : method.vpa}
                                        </p>
                                      </div>
                                    </div>
                                    {method.isDefault && (
                                      <Badge
                                        variant="outline"
                                        className="border-neon-green/50 text-neon-green"
                                      >
                                        Default
                                      </Badge>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>
                    )}

                  <Button
                    className="w-full bg-neon-green text-gray-900 hover:bg-neon-green/90"
                    disabled={!addAmount || parseInt(addAmount) <= 0}
                  >
                    Add ₹{addAmount || "0"} to Wallet
                  </Button>
                </CardContent>
              </Card>

              <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-400">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  STRIKE uses secure payment processing. All transactions are
                  encrypted and protected.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Withdraw Tab */}
            <TabsContent value="withdraw" className="space-y-6 mt-6">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader>
                  <CardTitle>Withdraw Funds</CardTitle>
                  <CardDescription>
                    Transfer funds to your bank account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount input */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-400">
                        Enter Amount (₹)
                      </label>
                      <span className="text-sm text-gray-400">
                        Available: ₹{withdrawableBalance}
                      </span>
                    </div>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-gray-800 border-gray-700 focus-visible:ring-neon-green"
                    />

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button
                        variant="outline"
                        className="border-gray-700 hover:bg-neon-green/10 hover:border-neon-green"
                        onClick={() =>
                          setWithdrawAmount(withdrawableBalance.toString())
                        }
                      >
                        Withdraw All
                      </Button>
                    </div>
                  </div>

                  {/* Withdrawal Method */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">
                      Withdrawal Method
                    </label>
                    <Select
                      value={withdrawMethod}
                      onValueChange={setWithdrawMethod}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-neon-green">
                        <SelectValue placeholder="Select withdrawal method" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="bank">Bank Account</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="wallet">E-Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bank account information */}
                  {withdrawMethod === "bank" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">
                          Account Holder Name
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter account holder name"
                          className="bg-gray-800 border-gray-700 focus-visible:ring-neon-green"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">
                          Account Number
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter account number"
                          className="bg-gray-800 border-gray-700 focus-visible:ring-neon-green"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">
                          IFSC Code
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter IFSC code"
                          className="bg-gray-800 border-gray-700 focus-visible:ring-neon-green"
                        />
                      </div>
                    </div>
                  )}

                  {/* UPI information */}
                  {withdrawMethod === "upi" && (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">UPI ID</label>
                      <Input
                        type="text"
                        placeholder="Enter UPI ID (e.g., name@upi)"
                        className="bg-gray-800 border-gray-700 focus-visible:ring-neon-green"
                      />
                    </div>
                  )}

                  {/* E-Wallet information */}
                  {withdrawMethod === "wallet" && (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">
                        E-Wallet Provider
                      </label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-neon-green">
                          <SelectValue placeholder="Select e-wallet provider" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="paytm">Paytm</SelectItem>
                          <SelectItem value="amazonpay">Amazon Pay</SelectItem>
                          <SelectItem value="phonepe">PhonePe</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                    <Clock className="h-4 w-4" />
                    <AlertTitle>Processing Time</AlertTitle>
                    <AlertDescription>
                      Withdrawals are typically processed within 24 hours. Bank
                      transfers may take 1-3 business days to reflect in your
                      account.
                    </AlertDescription>
                  </Alert>

                  <Button
                    className="w-full bg-neon-green text-gray-900 hover:bg-neon-green/90"
                    disabled={
                      !withdrawAmount ||
                      parseInt(withdrawAmount) <= 0 ||
                      parseInt(withdrawAmount) > withdrawableBalance
                    }
                  >
                    Withdraw ₹{withdrawAmount || "0"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Web3 Tab */}
            <TabsContent value="web3" className="space-y-6 mt-6">
              {!isWalletConnected ? (
                <Card className="bg-gray-900/60 border-gray-800">
                  <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                    <div className="h-16 w-16 bg-violet-500/20 rounded-full flex items-center justify-center mb-4">
                      <WalletIcon className="h-8 w-8 text-violet-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      Connect Your Web3 Wallet
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-md">
                      Connect your Ethereum wallet to access Web3 features,
                      trade tokens, and participate in exclusive contests.
                    </p>
                    <Button
                      className="bg-violet-500 text-white hover:bg-violet-600"
                      onClick={() => setConnectWalletOpen(true)}
                    >
                      <WalletIcon className="h-4 w-4 mr-2" />
                      Connect Wallet
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Web3 Network Selector */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Web3 Wallet</h2>
                    <Select
                      value={selectedWeb3Network}
                      onValueChange={setSelectedWeb3Network}
                    >
                      <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
                        <SelectValue placeholder="Select Network" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="ethereum">
                          Ethereum Mainnet
                        </SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                        <SelectItem value="arbitrum">Arbitrum</SelectItem>
                        <SelectItem value="optimism">Optimism</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Token Balances */}
                  <Card className="bg-gray-900/60 border-gray-800">
                    <CardHeader>
                      <CardTitle>Token Balances</CardTitle>
                      <CardDescription>
                        Your crypto assets on{" "}
                        {selectedWeb3Network === "ethereum"
                          ? "Ethereum"
                          : selectedWeb3Network === "polygon"
                          ? "Polygon"
                          : selectedWeb3Network === "arbitrum"
                          ? "Arbitrum"
                          : "Optimism"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {tokenBalances.map((token) => (
                        <div
                          key={token.symbol}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                              <img
                                src={token.icon}
                                alt={token.name}
                                className="h-10 w-10 object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{token.name}</p>
                              <p className="text-sm text-gray-400">
                                {token.balance} {token.symbol}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              ₹{token.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                        onClick={() => setSwapTokenOpen(true)}
                      >
                        <ArrowDown className="h-4 w-4 mr-2 rotate-45" />
                        Swap Tokens
                      </Button>
                      <Button className="bg-violet-500 text-white hover:bg-violet-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Bridge to Game
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Web3 Transaction History */}
                  <Card className="bg-gray-900/60 border-gray-800">
                    <CardHeader>
                      <CardTitle>Web3 Transactions</CardTitle>
                      <CardDescription>
                        Recent on-chain activity
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {web3TransactionHistory.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-start justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all"
                        >
                          <div>
                            <div className="flex items-center">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 
                                ${
                                  tx.type === "deposit"
                                    ? "bg-green-500/20 text-green-500"
                                    : tx.type === "withdraw"
                                    ? "bg-amber-500/20 text-amber-500"
                                    : "bg-violet-500/20 text-violet-400"
                                }`}
                              >
                                {tx.type === "deposit" && (
                                  <ArrowDown className="h-4 w-4" />
                                )}
                                {tx.type === "withdraw" && (
                                  <ArrowUp className="h-4 w-4" />
                                )}
                                {tx.type === "swap" && (
                                  <ArrowDown className="h-4 w-4 rotate-45" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {tx.type === "deposit"
                                    ? "Deposit"
                                    : tx.type === "withdraw"
                                    ? "Withdraw"
                                    : `Swap ${tx.tokenSymbol} → ${tx.toTokenSymbol}`}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {tx.type === "swap"
                                    ? `${tx.amount} ${tx.tokenSymbol} for ${tx.toAmount} ${tx.toTokenSymbol}`
                                    : `${tx.amount} ${tx.tokenSymbol}`}
                                </p>
                                <p className="text-xs text-violet-400">
                                  {tx.hash}{" "}
                                  <ExternalLink className="h-3 w-3 inline ml-1" />
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{tx.value}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(tx.timestamp).toLocaleString()}
                            </p>
                            <Badge
                              className={`${
                                tx.status === "confirmed"
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
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Transactions{" "}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* NFT Integration Call to Action */}
                  <Card className="bg-gradient-to-r from-purple-900/40 to-violet-900/40 border-violet-800/30">
                    <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
                      <div className="mb-4 md:mb-0 text-center md:text-left">
                        <h3 className="text-lg font-bold mb-1">
                          Fantasy Cricket NFTs
                        </h3>
                        <p className="text-gray-400">
                          Collect exclusive player cards and earn rewards
                        </p>
                      </div>
                      <Button className="bg-white text-gray-900 hover:bg-gray-200">
                        Explore NFT Marketplace
                      </Button>
                    </CardContent>
                  </Card>

                  <Alert className="bg-violet-500/10 border-violet-500/20 text-violet-400">
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Web3 Security</AlertTitle>
                    <AlertDescription>
                      Always verify transactions in your wallet. STRIKE will
                      never ask for your seed phrase or private keys.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6 mt-6">
              <Card className="bg-gray-900/60 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      View all your wallet transactions
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                      <Filter className="h-3.5 w-3.5 mr-1" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactionHistory.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="border-b border-gray-800 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 
                              ${
                                transaction.type === "deposit"
                                  ? "bg-green-500/20 text-green-500"
                                  : transaction.type === "withdrawal"
                                  ? "bg-amber-500/20 text-amber-500"
                                  : transaction.amount > 0
                                  ? "bg-neon-green/20 text-neon-green"
                                  : "bg-gray-500/20 text-gray-500"
                              }`}
                            >
                              {transaction.type === "deposit" && (
                                <ArrowDown className="h-5 w-5" />
                              )}
                              {transaction.type === "withdrawal" && (
                                <ArrowUp className="h-5 w-5" />
                              )}
                              {transaction.type === "contest" && (
                                <Trophy className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {transaction.type === "deposit"
                                  ? "Money Added"
                                  : transaction.type === "withdrawal"
                                  ? "Withdrawal"
                                  : transaction.amount > 0
                                  ? "Contest Winning"
                                  : "Contest Entry"}
                              </p>
                              <p className="text-sm text-gray-400">
                                {transaction.type !== "contest"
                                  ? `Via ${transaction.method}`
                                  : `${transaction.contestName} • ${transaction.matchName}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(transaction.date).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-semibold ${
                                transaction.amount > 0
                                  ? "text-neon-green"
                                  : "text-white"
                              }`}
                            >
                              {transaction.amount > 0 ? "+" : ""}₹
                              {Math.abs(transaction.amount)}
                            </p>
                            <Badge
                              className={`${
                                transaction.status === "completed"
                                  ? "bg-green-500/20 text-green-500 border-green-500/30"
                                  : transaction.status === "pending"
                                  ? "bg-amber-500/20 text-amber-500 border-amber-500/30"
                                  : "bg-red-500/20 text-red-500 border-red-500/30"
                              }`}
                            >
                              {transaction.status.charAt(0).toUpperCase() +
                                transaction.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load more button */}
                  <Button variant="outline" className="w-full mt-6">
                    Load More Transactions
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Promotion banner */}
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
                    Invite Friends <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support and info */}
          <Card className="bg-gray-900/40 border-gray-800">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-6 justify-between">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-neon-green mr-2" />
                  <span className="text-sm">Secure Transactions</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-neon-green mr-2" />
                  <span className="text-sm">Fast Withdrawals</span>
                </div>
                <Link
                  to="/support"
                  className="flex items-center text-neon-green hover:underline"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  <span className="text-sm">Payment Settings</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connect Wallet Dialog */}
        <Dialog open={connectWalletOpen} onOpenChange={setConnectWalletOpen}>
          <DialogContent className="bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle>Connect Web3 Wallet</DialogTitle>
              <DialogDescription>
                Connect your cryptocurrency wallet to access Web3 features
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 border-violet-500/30 hover:bg-violet-500/10 hover:border-violet-500"
                onClick={connectWallet}
              >
                <img
                  src="https://metamask.io/images/metamask-fox.svg"
                  alt="MetaMask"
                  className="h-10 mb-2"
                />
                <span>MetaMask</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 border-violet-500/30 hover:bg-violet-500/10 hover:border-violet-500"
                onClick={connectWallet}
              >
                <img
                  src="https://app.uniswap.org/static/media/walletConnectIcon.304e3277.svg"
                  alt="WalletConnect"
                  className="h-10 mb-2"
                />
                <span>WalletConnect</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 border-violet-500/30 hover:bg-violet-500/10 hover:border-violet-500"
                onClick={connectWallet}
              >
                <img
                  src="https://www.coinbase.com/img/favicon/favicon-32x32.png"
                  alt="Coinbase Wallet"
                  className="h-10 mb-2"
                />
                <span>Coinbase Wallet</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 border-violet-500/30 hover:bg-violet-500/10 hover:border-violet-500"
                onClick={connectWallet}
              >
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center mb-2">
                  <Plus className="h-6 w-6 text-violet-400" />
                </div>
                <span>More Options</span>
              </Button>
            </div>

            <DialogFooter className="flex-col sm:flex-col space-y-2">
              <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  By connecting a wallet, you agree to STRIKE's Terms of Service
                  and Privacy Policy
                </AlertDescription>
              </Alert>
              <Button
                variant="ghost"
                onClick={() => setConnectWalletOpen(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Swap Token Dialog */}
        <Dialog open={swapTokenOpen} onOpenChange={setSwapTokenOpen}>
          <DialogContent className="bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle>Swap Tokens</DialogTitle>
              <DialogDescription>
                Exchange one token for another at current market rates
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* From Token */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">From</label>
                <div className="flex gap-2">
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="w-1/3 bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="MATIC">MATIC</SelectItem>
                      <SelectItem value="STRIKE">STRIKE</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="flex-1 bg-gray-800 border-gray-700 focus-visible:ring-violet-500"
                  />
                </div>
                <div className="text-right text-sm text-gray-400">
                  Balance:{" "}
                  {tokenBalances.find((t) => t.symbol === fromToken)?.balance ||
                    "0"}{" "}
                  {fromToken}
                </div>
              </div>

              {/* Swap Direction */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full bg-gray-800"
                  onClick={() => {
                    const temp = fromToken;
                    setFromToken(toToken);
                    setToToken(temp);
                  }}
                >
                  <ArrowDown className="h-4 w-4 rotate-45" />
                </Button>
              </div>

              {/* To Token */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">To</label>
                <div className="flex gap-2">
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="w-1/3 bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="MATIC">MATIC</SelectItem>
                      <SelectItem value="STRIKE">STRIKE</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={
                      swapAmount
                        ? (
                            parseFloat(swapAmount) *
                            (fromToken === "ETH" && toToken === "STRIKE"
                              ? 2000
                              : fromToken === "STRIKE" && toToken === "ETH"
                              ? 0.0005
                              : fromToken === "USDC" && toToken === "STRIKE"
                              ? 10
                              : fromToken === "STRIKE" && toToken === "USDC"
                              ? 0.1
                              : 1)
                          ).toFixed(6)
                        : ""
                    }
                    disabled
                    className="flex-1 bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="text-right text-sm text-gray-400">
                  Balance:{" "}
                  {tokenBalances.find((t) => t.symbol === toToken)?.balance ||
                    "0"}{" "}
                  {toToken}
                </div>
              </div>

              {/* Exchange Rate */}
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Exchange Rate</span>
                  <span>
                    1 {fromToken} =
                    {fromToken === "ETH" && toToken === "STRIKE"
                      ? " 2000 "
                      : fromToken === "STRIKE" && toToken === "ETH"
                      ? " 0.0005 "
                      : fromToken === "USDC" && toToken === "STRIKE"
                      ? " 10 "
                      : fromToken === "STRIKE" && toToken === "USDC"
                      ? " 0.1 "
                      : " 1 "}
                    {toToken}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-400">Network Fee</span>
                  <span>~0.00045 ETH</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setSwapTokenOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-violet-500 text-white hover:bg-violet-600"
                disabled={!swapAmount || parseFloat(swapAmount) <= 0}
              >
                <ArrowDown className="h-4 w-4 mr-2 rotate-45" />
                Swap Tokens
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Money Dialog */}
        <Dialog open={addMoneyOpen} onOpenChange={setAddMoneyOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Money to Wallet</DialogTitle>
              <DialogDescription>
                Choose an amount and payment method to add money
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">
                  Enter Amount (₹)
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="bg-gray-800 border-gray-700 focus-visible:ring-neon-green"
                />

                <div className="flex flex-wrap gap-2 mt-3">
                  {depositAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      className="border-gray-700 hover:bg-neon-green/10 hover:border-neon-green"
                      onClick={() => handleQuickAmount(amount)}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAddMoneyOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-neon-green text-gray-900 hover:bg-neon-green/90"
                disabled={!addAmount || parseInt(addAmount) <= 0}
                onClick={() => setActiveTab("add-money")}
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Withdraw Dialog */}
        <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Enter amount to withdraw from your wallet
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-gray-400">
                    Enter Amount (₹)
                  </label>
                  <span className="text-sm text-gray-400">
                    Available: ₹{withdrawableBalance}
                  </span>
                </div>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-gray-800 border-gray-700 focus-visible:ring-neon-green"
                />

                <div className="flex flex-wrap gap-2 mt-3">
                  <Button
                    variant="outline"
                    className="border-gray-700 hover:bg-neon-green/10 hover:border-neon-green"
                    onClick={() =>
                      setWithdrawAmount(withdrawableBalance.toString())
                    }
                  >
                    Withdraw All
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setWithdrawOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-neon-green text-gray-900 hover:bg-neon-green/90"
                disabled={
                  !withdrawAmount ||
                  parseInt(withdrawAmount) <= 0 ||
                  parseInt(withdrawAmount) > withdrawableBalance
                }
                onClick={() => setActiveTab("withdraw")}
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default Wallet;
