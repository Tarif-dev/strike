import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageContainer from "@/components/layout/PageContainer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CalendarIcon, CheckCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  WalletNotConnectedError,
  WalletSendTransactionError,
} from "@solana/wallet-adapter-base";
import { Program, BN } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { IDL } from "@/idl/strike_contracts_new";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

// Schema for match creation form validation
const createMatchSchema = z
  .object({
    homeTeam: z.string({
      required_error: "Please select a home team",
    }),
    awayTeam: z.string({
      required_error: "Please select an away team",
    }),
    matchDate: z.date({
      required_error: "Please select a match date",
    }),
  })
  .refine((data) => data.homeTeam !== data.awayTeam, {
    message: "Home team and away team cannot be the same",
    path: ["awayTeam"],
  });

type CreateMatchFormValues = z.infer<typeof createMatchSchema>;

// List of IPL teams
const teams = [
  { code: "CSK", name: "Chennai Super Kings", logo: "/team_logos/csk.jpeg" },
  { code: "DC", name: "Delhi Capitals", logo: "/team_logos/dc.jpeg" },
  { code: "GT", name: "Gujarat Titans", logo: "/team_logos/gt.jpeg" },
  { code: "KKR", name: "Kolkata Knight Riders", logo: "/team_logos/kkr.jpeg" },
  { code: "LSG", name: "Lucknow Super Giants", logo: "/team_logos/lsg.jpeg" },
  { code: "MI", name: "Mumbai Indians", logo: "/team_logos/mi.jpeg" },
  { code: "PBKS", name: "Punjab Kings", logo: "/team_logos/pbks.jpeg" },
  {
    code: "RCB",
    name: "Royal Challengers Bengaluru",
    logo: "/team_logos/rcb.jpeg",
  },
  { code: "RR", name: "Rajasthan Royals", logo: "/team_logos/rr.jpeg" },
  { code: "SRH", name: "Sunrisers Hyderabad", logo: "/team_logos/srh.jpeg" },
];

const CreateMatch = () => {
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBlockchainProcessing, setIsBlockchainProcessing] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const [txComplete, setTxComplete] = useState(false);
  const [walletError, setWalletError] = useState("");

  const { connection } = useConnection();
  const wallet = useWallet();
  const {
    publicKey,
    connected,
    connecting,
    disconnect,
    select,
    sendTransaction,
  } = wallet;
  const { setVisible } = useWalletModal();

  // Monitor wallet connection status
  useEffect(() => {
    if (connected) {
      console.log("connection", connection);
      setWalletError("");
    }
  }, [connected]);

  // Function to check wallet connection and attempt reconnection if needed
  const ensureWalletConnection = async () => {
    if (!connected && !connecting) {
      setWalletError("Wallet connection lost. Attempting to reconnect...");

      // If wallet was previously selected, try to reconnect
      if (wallet.wallet) {
        try {
          // Attempt to disconnect and reconnect
          await disconnect();
          setTimeout(() => {
            select(wallet.wallet.adapter.name);
          }, 500);
          return false;
        } catch (error) {
          console.error("Error reconnecting wallet:", error);
          setWalletError(
            "Failed to reconnect wallet. Please connect manually."
          );
          return false;
        }
      } else {
        setWalletError("Wallet not connected. Please connect your wallet.");
        return false;
      }
    }
    return true;
  };

  const PROGRAM_ID = new PublicKey(
    "2Bnp9uikuv1EuAfHbcXizF8FcqNDKQg7hfuKbLC9y6hT"
  );
  const USDC_MINT = new PublicKey(
    "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
  );

  const onSubmit = async (values: CreateMatchFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create matches",
      });
      return;
    }

    // Check wallet connection status and attempt reconnection if needed
    if (!(await ensureWalletConnection())) {
      toast({
        variant: "destructive",
        title: "Wallet connection issue",
        description:
          walletError || "Please connect your Solana wallet to create a match",
      });
      return;
    }

    // Double-check connection after reconnection attempt
    if (!connected || !publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your Solana wallet to create a match",
      });
      return;
    }

    setIsSubmitting(true);
    setIsBlockchainProcessing(false);
    setWalletError(""); // Clear any previous wallet errors

    try {
      // Get team details from our local array
      const homeTeamData = teams.find((t) => t.code === values.homeTeam);
      const awayTeamData = teams.find((t) => t.code === values.awayTeam);

      if (!homeTeamData || !awayTeamData) {
        throw new Error("Invalid team selection");
      }

      // Generate a proper UUID for Supabase
      const uuid = crypto.randomUUID();

      // Create a shorter match ID for Solana by using the first 8 characters of the UUID
      // This will be used in the blockchain but not stored directly in Supabase
      const shortMatchId = uuid.split("-")[0]; // Use just the first segment of the UUID

      // Calculate registration end time (1 hour before match)
      const matchDateTime = new Date(values.matchDate);
      const registrationEndTime = new Date(matchDateTime);
      registrationEndTime.setHours(registrationEndTime.getHours() - 1);

      // Match data to be stored in Supabase
      const matchDetails = {
        id: uuid, // Store the full UUID in the match details
        shortId: shortMatchId, // Also store the short ID for reference
        date: matchDateTime.toISOString(),
        status: "upcoming",
        registrationEndTime: registrationEndTime.toISOString(),
        teams: {
          home: {
            name: homeTeamData.name,
            code: homeTeamData.code,
            logo: homeTeamData.logo,
          },
          away: {
            name: awayTeamData.name,
            code: awayTeamData.code,
            logo: awayTeamData.logo,
          },
        },
        venue: "Match Venue", // You might want to add this to your form
        result: null, // No result yet for new match
      };

      // 1. First, store in Supabase
      const { data, error } = await supabase
        .from("matches")
        .insert({
          match_id: uuid, // Use the full UUID for the primary key
          admin: user.id,
          match_details: matchDetails,
          registration_end_time: registrationEndTime.toISOString(),
          is_active: true,
          is_finalized: false,
          total_deposited: 0,
          bump: 1,
          token_bump: 1,
        })
        .select();

      if (error) {
        throw error;
      }

      // 2. Now initialize the match on the blockchain
      setIsBlockchainProcessing(true);
      setTxStatus("Preparing blockchain transaction...");

      // Create Anchor provider with proper preflightCommitment
      const provider = new anchor.AnchorProvider(connection, wallet, {
        commitment: "confirmed",
      });

      // Create program instance using the IDL
      const program = new Program(IDL, provider);

      // Convert JavaScript Date to Solana compatible Unix timestamp (seconds)
      const unixRegistrationEndTime = Math.floor(
        registrationEndTime.getTime() / 1000
      );

      // Use the shorter match ID for Solana PDA derivation
      console.log("short match id", shortMatchId);
      const matchIdBuffer = Buffer.from(shortMatchId);

      setTxStatus("Deriving program addresses...");

      // Find PDA for the match pool
      const [matchPoolPDA, matchBump] = await PublicKey.findProgramAddress(
        [Buffer.from("match_pool"), matchIdBuffer],
        PROGRAM_ID
      );

      // Find PDA for the pool token account
      const [poolTokenPDA, tokenBump] = await PublicKey.findProgramAddress(
        [Buffer.from("pool_token"), matchIdBuffer],
        PROGRAM_ID
      );

      // Check if USDC token account exists for the user

      setTxStatus("Building transaction...");

      try {
        // Log account data to help diagnose issues
        console.log("Transaction accounts:", {
          matchPool: matchPoolPDA.toString(),
          poolTokenAccount: poolTokenPDA.toString(),
          tokenMint: USDC_MINT.toString(),
          admin: publicKey.toString(),
          bumps: { matchBump, tokenBump },
          shortMatchId,
        });

        // Use a more detailed approach to build and send the transaction

        // Create the instruction using program methods
        const ix = await program.methods
          .initialize(
            shortMatchId, // Using the shorter ID format for Solana
            new BN(unixRegistrationEndTime)
          )
          .accounts({
            matchPool: matchPoolPDA,
            poolTokenAccount: poolTokenPDA,
            tokenMint: USDC_MINT,
            admin: publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: new PublicKey(
              "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ),
            associatedTokenProgram: new PublicKey(
              "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
            ),
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .instruction();
        console.log("instructions made");

        // Add the instruction to the transaction
        const transaction = new Transaction().add(ix);
        const { blockhash } = await connection.getLatestBlockhash("confirmed");
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;
        // Add right before sendTransaction
        try {
          console.log("Simulating transaction before sending...");
          const { value: simulationResult } =
            await connection.simulateTransaction(transaction);

          console.log("Simulation result:", simulationResult);

          if (simulationResult.err) {
            console.error("Simulation error:", simulationResult.err);
            // Parse and display a more user-friendly error
            if (simulationResult.logs) {
              console.error("Simulation logs:", simulationResult.logs);
              const programErrorLog = simulationResult.logs
                .filter(
                  (log) =>
                    log.includes("Program log:") ||
                    log.includes("Program failed")
                )
                .join("\n");

              if (programErrorLog) {
                throw new Error(`Program simulation error: ${programErrorLog}`);
              }
            }
            throw new Error(
              `Simulation failed: ${JSON.stringify(simulationResult.err)}`
            );
          } else {
            console.log("Simulation successful. Proceeding with transaction.");
          }
        } catch (simError) {
          console.error("Error during simulation:", simError);
          throw new Error(`Transaction simulation failed: ${simError.message}`);
        }
        const signature = await sendTransaction(transaction, connection, {
          skipPreflight: false,
          preflightCommitment: "processed",
          maxRetries: 3,
        });
        setTxStatus("Requesting wallet signature...");

        // Function to handle transaction with retries

        console.log("Transaction sent! Signature:", signature);
        // Send the transaction with retry mechanism
        setTxStatus("Requesting wallet signature...");

        setTxStatus(
          `Transaction sent! Signature: ${signature.substring(0, 8)}...`
        );
        setTxSignature(signature);

        // Wait for confirmation
        const confirmationStatus = await connection.confirmTransaction(
          signature,
          "confirmed"
        );

        if (confirmationStatus.value.err) {
          throw new Error(
            `Transaction failed: ${JSON.stringify(
              confirmationStatus.value.err
            )}`
          );
        }

        setTxStatus("Transaction confirmed! Match created successfully.");
        setTxComplete(true);

        // Show success message
        toast({
          title: "Match created successfully",
          description: `${homeTeamData.name} vs ${
            awayTeamData.name
          } on ${format(
            matchDateTime,
            "PPP"
          )}. Transaction confirmed on Solana.`,
        });

        // Navigate to matches page
        setTimeout(() => {
          navigate("/matches");
        }, 1500);

        // Clear form
        form.reset();
      } catch (txError) {
        console.error("Transaction error:", txError);

        // Check for specific error types
        if (txError.message?.includes("User rejected")) {
          setTxStatus("Transaction rejected by user");
          throw new Error(
            "You declined the transaction in your wallet. Please try again."
          );
        } else {
          setTxStatus(`Transaction failed: ${txError.message}`);

          // Try to get more information from the logs
          if (txError.logs) {
            console.error("Transaction logs:", txError.logs);
            // Look for specific program errors in the logs
            const programErrorLog = txError.logs
              .filter((log) => log.includes("Program log:"))
              .join("\n");

            if (programErrorLog) {
              console.error("Program logs:", programErrorLog);
              throw new Error(`Program error: ${programErrorLog}`);
            }
          }

          throw txError;
        }
      }
    } catch (error) {
      console.error("Error creating match:", error);
      toast({
        variant: "destructive",
        title: "Failed to create match",
        description:
          error instanceof Error
            ? handleBlockchainError(error)
            : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
      setIsBlockchainProcessing(false);
    }
  };

  // Enhanced error handler with more specific error messages
  const handleBlockchainError = (error) => {
    console.error("Blockchain error details:", error);

    // Check for WalletSendTransactionError specifically
    if (error.name === "WalletSendTransactionError") {
      console.log("WalletSendTransactionError details:", error);

      // Handle specific wallet adapter errors
      if (error.message?.includes("failed to send transaction")) {
        return "Failed to send transaction to the blockchain. Please try again or check your wallet connection.";
      }

      if (error.message?.includes("timeout")) {
        return "Transaction timed out. Please try again when the network is less congested.";
      }

      if (
        error.message?.includes("User rejected") ||
        error.message?.includes("declined")
      ) {
        return "You declined the transaction in your wallet. Please approve the transaction when prompted.";
      }

      // Generic wallet send error
      return "There was an issue sending the transaction from your wallet. Please try again or use a different wallet.";
    }

    // Common Solana error messages and user-friendly translations
    if (error instanceof WalletNotConnectedError) {
      return "Please connect your wallet to create a match";
    }

    if (error.message?.includes("User rejected")) {
      return "You declined the transaction. Please try again and approve the transaction";
    }

    if (
      error.message?.includes("insufficient funds") ||
      error.message?.includes("0x1")
    ) {
      return "Your wallet doesn't have enough SOL to pay for the transaction. Please add more SOL to your wallet";
    }

    if (error.message?.includes("expired") || error.message?.includes("0x1d")) {
      return "The transaction took too long to confirm. Please try again";
    }

    if (
      error.message?.includes("account not found") ||
      error.message?.includes("0x7")
    ) {
      return "One of the required accounts was not found. This might be due to incorrect program configuration.";
    }

    if (error.message?.includes("already in use")) {
      return "A match with this ID already exists. Please try again.";
    }

    // Program-specific errors
    if (
      error.message?.includes("Program error:") ||
      error.message?.includes("Program log:")
    ) {
      // Try to extract a more readable error message from program logs
      const errorMatch = error.message.match(/Program log: (.*)/);
      if (errorMatch && errorMatch[1]) {
        return `Program error: ${errorMatch[1]}`;
      }
      return error.message;
    }

    // Fallback to general error message
    return error.message || "An unknown blockchain error occurred";
  };

  const form = useForm<CreateMatchFormValues>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      homeTeam: "",
      awayTeam: "",
      matchDate: new Date(),
    },
  });

  return (
    <PageContainer>
      <div className="bg-cricket-dark-green px-4 py-3 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-bold text-white">Create Match</h1>
        <WalletMultiButton className="bg-neon-green hover:bg-neon-green/90 text-black font-medium shadow-md transition-all duration-200 hover:shadow-lg hover:translate-y-[-1px] border border-neon-green/30" />
      </div>
      <div className="flex flex-col items-center justify-center mt-8 px-4">
        <div className="w-full max-w-xl space-y-6 bg-cricket-medium-green p-8 rounded-xl shadow-lg border border-cricket-lime/30">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Create New Match</h1>
            <p className="text-cricket-lime/80 mt-2 text-sm">
              Set up a new match for the fantasy cricket league
            </p>
          </div>

          <div className="h-px w-full bg-cricket-lime/20 my-4"></div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="homeTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">
                      Home Team
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-cricket-dark-green/90 text-white border-cricket-lime focus:ring-2 focus:ring-cricket-lime focus:ring-offset-2 focus:ring-offset-cricket-medium-green">
                          <SelectValue placeholder="Select home team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-cricket-dark-green/95 border-cricket-lime shadow-lg backdrop-blur-sm z-50">
                        {teams.map((team) => (
                          <SelectItem
                            key={team.code}
                            value={team.code}
                            className="hover:bg-cricket-lime/20 focus:bg-cricket-lime/20 cursor-pointer text-white"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full overflow-hidden mr-3 border-2 border-cricket-lime/70 shadow-sm">
                                <img
                                  src={team.logo}
                                  alt={team.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-medium">{team.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="awayTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">
                      Away Team
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-cricket-dark-green/90 text-white border-cricket-lime focus:ring-2 focus:ring-cricket-lime focus:ring-offset-2 focus:ring-offset-cricket-medium-green">
                          <SelectValue placeholder="Select away team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-cricket-dark-green/95 border-cricket-lime shadow-lg backdrop-blur-sm z-50">
                        {teams.map((team) => (
                          <SelectItem
                            key={team.code}
                            value={team.code}
                            className="hover:bg-cricket-lime/20 focus:bg-cricket-lime/20 cursor-pointer text-white"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full overflow-hidden mr-3 border-2 border-cricket-lime/70 shadow-sm">
                                <img
                                  src={team.logo}
                                  alt={team.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-medium">{team.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="matchDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white font-medium">
                      Match Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-cricket-dark-green/90 border-cricket-lime text-white focus:ring-2 focus:ring-cricket-lime focus:ring-offset-2 focus:ring-offset-cricket-medium-green",
                              !field.value && "text-gray-400"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-70" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-cricket-dark-green/95 border-cricket-lime shadow-lg backdrop-blur-sm"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                          className="bg-cricket-dark-green text-white rounded-md"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-cricket-lime/80">
                      Select the date when the match will be played
                    </FormDescription>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 pt-2">
                <Button
                  type="submit"
                  className="w-full bg-neon-green text-black font-semibold text-lg py-6 shadow-md transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px] relative overflow-hidden border border-neon-green/30 group"
                  disabled={isSubmitting}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-neon-green/0 via-neon-green/30 to-neon-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-full group-hover:translate-x-full"></span>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Match
                    </>
                  ) : (
                    "Create Match"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          {walletError && (
            <div className="rounded-md border border-red-600/20 bg-red-600/10 p-4 mt-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-500">
                    Wallet Connection Error
                  </h3>
                  <div className="mt-1 text-sm text-red-400/80">
                    <p>{walletError}</p>
                  </div>
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                      onClick={() => {
                        if (wallet.wallet) {
                          disconnect().then(() => {
                            setTimeout(
                              () => select(wallet.wallet.adapter.name),
                              500
                            );
                          });
                        } else {
                          setVisible(true); // Open wallet selection modal
                        }
                      }}
                    >
                      Reconnect Wallet
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isBlockchainProcessing && (
            <div className="rounded-md border border-yellow-600/20 bg-yellow-600/10 p-4 mt-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {txStatus.includes("Error") ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-500">
                    Blockchain Transaction Status
                  </h3>
                  <div className="mt-1 text-sm text-yellow-400/80">
                    <p>{txStatus}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {txComplete && (
            <div className="rounded-md border border-green-600/20 bg-green-600/10 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-500">
                    Transaction Complete
                  </h3>
                  <div className="mt-2 text-sm text-green-400/80">
                    <p>
                      Match has been created successfully on the blockchain.
                    </p>
                    <p className="mt-1 font-mono text-xs">
                      Tx: {txSignature.substring(0, 8)}...
                      {txSignature.substring(txSignature.length - 8)}
                    </p>
                  </div>
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500/30 text-green-500 hover:bg-green-500/10"
                      onClick={() =>
                        window.open(
                          `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
                          "_blank"
                        )
                      }
                    >
                      View on Solana Explorer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default CreateMatch;
