import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { LAMPORTS_PER_SOL, Keypair, PublicKey } from "@solana/web3.js";
import { Rpc } from "@lightprotocol/stateless.js";
import {
  createZkRpcConnection,
  generateWalletKeypair,
  storeKeypair,
  getStoredKeypair,
  getStoredPublicKey,
  requestAirdrop,
  getCompressedTokenBalance,
} from "../services/zkCompressionService";

interface ZkCompressionContextType {
  connection: Rpc | null;
  payer: Keypair | null;
  userWallet: Keypair | null;
  mint: PublicKey | null;
  isLocalnet: boolean;
  connectionStatus: {
    slot: number;
    health: any;
  } | null;
  errorMessage: string | null;
  isLoading: boolean;
  payerBalance: number;
  userBalance: number;
  payerTokenBalance: number;
  userTokenBalance: number;
  initializeWallets: () => Promise<void>;
  switchNetwork: (useLocalnet: boolean) => Promise<void>;
  setMint: (mint: PublicKey) => void;
  requestPayerAirdrop: () => Promise<string | null>;
  requestUserAirdrop: () => Promise<string | null>;
  refreshBalances: () => Promise<void>;
}

const ZkCompressionContext = createContext<
  ZkCompressionContextType | undefined
>(undefined);

export const useZkCompression = () => {
  const context = useContext(ZkCompressionContext);
  if (context === undefined) {
    throw new Error(
      "useZkCompression must be used within a ZkCompressionProvider"
    );
  }
  return context;
};

interface ZkCompressionProviderProps {
  children: ReactNode;
}

export const ZkCompressionProvider = ({
  children,
}: ZkCompressionProviderProps) => {
  const [connection, setConnection] = useState<Rpc | null>(null);
  const [payer, setPayer] = useState<Keypair | null>(null);
  const [userWallet, setUserWallet] = useState<Keypair | null>(null);
  const [mint, setMint] = useState<PublicKey | null>(null);
  const [isLocalnet, setIsLocalnet] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<{
    slot: number;
    health: any;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [payerBalance, setPayerBalance] = useState<number>(0);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [payerTokenBalance, setPayerTokenBalance] = useState<number>(0);
  const [userTokenBalance, setUserTokenBalance] = useState<number>(0);

  // Function to update SOL balances
  const updateSOLBalances = async () => {
    if (!connection || !payer || !userWallet) return;

    try {
      // Get payer SOL balance
      const payerRawBalance = await connection.getBalance(payer.publicKey);
      setPayerBalance(payerRawBalance / LAMPORTS_PER_SOL);

      // Get user SOL balance
      const userRawBalance = await connection.getBalance(userWallet.publicKey);
      setUserBalance(userRawBalance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error updating SOL balances:", error);
    }
  };

  // Function to update token balances
  const updateTokenBalances = async () => {
    if (!connection || !payer || !userWallet || !mint) return;

    try {
      // Get payer token balance
      const payerTokenBal = await getCompressedTokenBalance(
        connection,
        mint,
        payer.publicKey
      );
      setPayerTokenBalance(payerTokenBal);

      // Get user token balance
      const userTokenBal = await getCompressedTokenBalance(
        connection,
        mint,
        userWallet.publicKey
      );
      setUserTokenBalance(userTokenBal);
    } catch (error) {
      console.error("Error updating token balances:", error);
    }
  };

  // Combined function to refresh all balances
  const refreshBalances = async () => {
    setIsLoading(true);
    try {
      await Promise.all([updateSOLBalances(), updateTokenBalances()]);
    } catch (error) {
      console.error("Error refreshing balances:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeConnection = async (useLocalnet: boolean) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Setup connection based on network choice
      let rpcConnection: Rpc;
      if (useLocalnet) {
        rpcConnection = createZkRpcConnection();
      } else {
        // Replace with your Helius API key for devnet
        const devnetEndpoint =
          "https://devnet.helius-rpc.com?api-key=fd9d3c65-ab69-4b6b-b334-441c902a871a";
        rpcConnection = createZkRpcConnection(
          devnetEndpoint,
          devnetEndpoint,
          devnetEndpoint
        );
      }

      setConnection(rpcConnection);
      setIsLocalnet(useLocalnet);

      try {
        // Try to get connection status to verify it's working
        const slot = await rpcConnection.getSlot();
        const health = await rpcConnection.getIndexerHealth();
        setConnectionStatus({ slot, health });

        // Update balances after successful connection
        await updateSOLBalances();
        if (mint) {
          await updateTokenBalances();
        }
      } catch (error) {
        console.error("Error checking connection:", error);
        if (useLocalnet) {
          setErrorMessage(
            "Error connecting to local ZK Compression validator. Make sure to run 'light test-validator' before testing."
          );
        } else {
          setErrorMessage(
            "Error connecting to devnet. Please check your API key and network status."
          );
        }
      }
    } catch (error) {
      console.error("Error initializing connection:", error);
      setErrorMessage(
        "Failed to initialize ZK Compression connection. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const initializeWallets = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Initialize payer wallet (admin wallet)
      let payerWallet = getStoredKeypair("payer");
      if (!payerWallet) {
        payerWallet = generateWalletKeypair();
        storeKeypair("payer", payerWallet);
      }
      setPayer(payerWallet);

      // Initialize user wallet
      let userWallet = getStoredKeypair("user");
      if (!userWallet) {
        userWallet = generateWalletKeypair();
        storeKeypair("user", userWallet);
      }
      setUserWallet(userWallet);

      // Check for stored mint
      const mintAddressString = localStorage.getItem("zk-compression-mint");
      if (mintAddressString) {
        try {
          setMint(new PublicKey(mintAddressString));
        } catch (error) {
          console.error("Invalid stored mint address, resetting", error);
          localStorage.removeItem("zk-compression-mint");
        }
      }
    } catch (error) {
      console.error("Error initializing wallets:", error);
      setErrorMessage("Failed to initialize wallets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchNetwork = async (useLocalnet: boolean) => {
    await initializeConnection(useLocalnet);
  };

  const requestPayerAirdrop = async (): Promise<string | null> => {
    if (!connection || !payer) return null;
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const signature = await requestAirdrop(connection, payer.publicKey);
      await updateSOLBalances(); // Update balances after airdrop
      return signature;
    } catch (error) {
      console.error("Error requesting payer airdrop:", error);
      setErrorMessage("Failed to request airdrop for payer wallet.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const requestUserAirdrop = async (): Promise<string | null> => {
    if (!connection || !userWallet) return null;
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const signature = await requestAirdrop(connection, userWallet.publicKey);
      await updateSOLBalances(); // Update balances after airdrop
      return signature;
    } catch (error) {
      console.error("Error requesting user airdrop:", error);
      setErrorMessage("Failed to request airdrop for user wallet.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const setMintAddress = (mintAddress: PublicKey) => {
    setMint(mintAddress);
    localStorage.setItem("zk-compression-mint", mintAddress.toBase58());
  };

  // Initialize connection on first load
  useEffect(() => {
    initializeConnection(true);
    initializeWallets();
  }, []);

  // Add effect to update balances periodically
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (connection && (payer || userWallet)) {
      // Update balances immediately
      refreshBalances();

      // Then update every 10 seconds
      interval = setInterval(refreshBalances, 10000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [connection, payer, userWallet, mint]);

  const value = {
    connection,
    payer,
    userWallet,
    mint,
    isLocalnet,
    connectionStatus,
    errorMessage,
    isLoading,
    payerBalance,
    userBalance,
    payerTokenBalance,
    userTokenBalance,
    initializeWallets,
    switchNetwork,
    setMint: setMintAddress,
    requestPayerAirdrop,
    requestUserAirdrop,
    refreshBalances,
  };

  return (
    <ZkCompressionContext.Provider value={value}>
      {children}
    </ZkCompressionContext.Provider>
  );
};
