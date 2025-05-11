import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  buyNft,
  connection,
  createCollection,
  mintPlayerNft,
  getCollectionNfts,
} from "@/lib/nft-utils";
import { useToast } from "@/hooks/use-toast";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

// Mock NFT data for initial display
const MOCK_NFTS = [
  {
    id: "1",
    name: "Virat Kohli",
    description: "One of the greatest batsmen in cricket history.",
    team: "Royal Challengers Bangalore",
    image: "/players/virat_kohli.jpg",
    owner: "7zxFCUmXXT5sGLZy8kECamZs36vPhSWegXhrWLsL7Zt6",
    mint: "mint_address_1",
    price: 10,
    attributes: [
      { trait_type: "Role", value: "Batsman" },
      { trait_type: "Batting", value: "95" },
      { trait_type: "Fielding", value: "88" },
      { trait_type: "Leadership", value: "92" },
    ],
  },
  {
    id: "2",
    name: "MS Dhoni",
    description: "The legendary captain and wicketkeeper.",
    team: "Chennai Super Kings",
    image: "/players/ms_dhoni.jpg",
    owner: "7JbfZSgxgs3WTbpx3UUXVXjrXo5NNPTdB4jvQD7TEdFg",
    mint: "mint_address_2",
    price: 12,
    attributes: [
      { trait_type: "Role", value: "Wicketkeeper" },
      { trait_type: "Batting", value: "87" },
      { trait_type: "Fielding", value: "94" },
      { trait_type: "Leadership", value: "99" },
    ],
  },
  {
    id: "3",
    name: "Jasprit Bumrah",
    description: "India's premier fast bowler known for his yorkers.",
    team: "Mumbai Indians",
    image: "/players/jasprit_bumrah.jpg",
    owner: "7JbfZSgxgs3WTbpx3UUXVXjrXo5NNPTdB4jvQD7TEdFg",
    mint: "mint_address_3",
    price: 9,
    attributes: [
      { trait_type: "Role", value: "Bowler" },
      { trait_type: "Bowling", value: "96" },
      { trait_type: "Fielding", value: "82" },
      { trait_type: "Speed", value: "94" },
    ],
  },
  {
    id: "4",
    name: "Jos Buttler",
    description: "England's aggressive opening batsman.",
    team: "Rajasthan Royals",
    image: "/players/jos_buttler.jpg",
    owner: "7JbfZSgxgs3WTbpx3UUXVXjrXo5NNPTdB4jvQD7TEdFg",
    mint: "mint_address_4",
    price: 8.5,
    attributes: [
      { trait_type: "Role", value: "Batsman" },
      { trait_type: "Batting", value: "93" },
      { trait_type: "Fielding", value: "85" },
      { trait_type: "Strike Rate", value: "96" },
    ],
  },
  {
    id: "5",
    name: "Rashid Khan",
    description: "Afghanistan's star leg-spinner.",
    team: "Gujarat Titans",
    image: "/players/rashid_khan.jpg",
    owner: "7JbfZSgxgs3WTbpx3UUXVXjrXo5NNPTdB4jvQD7TEdFg",
    mint: "mint_address_5",
    price: 8,
    attributes: [
      { trait_type: "Role", value: "Bowler" },
      { trait_type: "Bowling", value: "94" },
      { trait_type: "Fielding", value: "83" },
      { trait_type: "Economy", value: "91" },
    ],
  },
  {
    id: "6",
    name: "Rishabh Pant",
    description: "India's explosive wicketkeeper-batsman.",
    team: "Delhi Capitals",
    image: "/players/rishabh_pant.jpg",
    owner: "7JbfZSgxgs3WTbpx3UUXVXjrXo5NNPTdB4jvQD7TEdFg",
    mint: "mint_address_6",
    price: 7.5,
    attributes: [
      { trait_type: "Role", value: "Wicketkeeper" },
      { trait_type: "Batting", value: "88" },
      { trait_type: "Fielding", value: "85" },
      { trait_type: "Innovation", value: "94" },
    ],
  },
];

// Define the context type
type NFTContextType = {
  nfts: Array<any>;
  loading: boolean;
  error: string | null;
  collectionAddress: string | null;
  createNFTCollection: () => Promise<void>;
  mintPlayerNFT: (playerData: any) => Promise<void>;
  purchaseNFT: (nft: any) => Promise<void>;
  isAdmin: () => boolean;
  myNFTs: Array<any>;
  refreshNFTs: () => Promise<void>;
  tokenOptions: Array<{ name: string; symbol: string; mint: string }>;
  selectedToken: { name: string; symbol: string; mint: string };
  setSelectedToken: (token: {
    name: string;
    symbol: string;
    mint: string;
  }) => void;
};

// Create the NFT context
const NFTContext = createContext<NFTContextType | undefined>(undefined);

// Payment token options - add more SPL tokens here as needed
const DEFAULT_TOKEN_OPTIONS = [
  {
    name: "USDC",
    symbol: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Devnet USDC mint address
  },
  {
    name: "USDT",
    symbol: "USDT",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // Devnet USDT mint address
  },
  {
    name: "SOL",
    symbol: "SOL",
    mint: "So11111111111111111111111111111111111111112", // Native SOL mint address
  },
  {
    name: "STRIKE",
    symbol: "STRK",
    mint: "STRKrxm69d5GUeFNXWFzqHnU1mXQrAQgp5MqkHasDRx", // Demo STRIKE token mint address
  },
];

const DEMO_MODE = true; // Set to true for demo purposes

export const NFTProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, connected } = useWallet();
  const { toast } = useToast();

  const [nfts, setNfts] = useState<Array<any>>(MOCK_NFTS);
  const [myNFTs, setMyNFTs] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [collectionAddress, setCollectionAddress] = useState<string | null>(
    null
  );

  // Add token selection state
  const [tokenOptions] = useState(DEFAULT_TOKEN_OPTIONS);
  const [selectedToken, setSelectedToken] = useState(DEFAULT_TOKEN_OPTIONS[0]);

  // Admin test key for testing purposes only
  const ADMIN_PUBLIC_KEY = "7zxFCUmXXT5sGLZy8kECamZs36vPhSWegXhrWLsL7Zt6";

  // Mock admin keypair for demo purposes
  const demoAdminKeypair = Keypair.generate();

  // Helper to check if the connected wallet is an admin
  const isAdmin = () => {
    if (!publicKey) return false;
    return publicKey.toString() === ADMIN_PUBLIC_KEY || true; // Set to true for demo purposes
  };

  // Load NFTs on initial mount
  useEffect(() => {
    // Check for saved collection address
    const savedCollectionAddress = localStorage.getItem("nftCollectionAddress");
    if (savedCollectionAddress) {
      setCollectionAddress(savedCollectionAddress);
    }

    refreshNFTs();
  }, []);

  // Filter my NFTs when publicKey changes
  useEffect(() => {
    if (publicKey) {
      const myNFTs = nfts.filter((nft) => nft.owner === publicKey.toString());
      setMyNFTs(myNFTs);
    } else {
      setMyNFTs([]);
    }
  }, [publicKey, nfts]);

  // Refresh NFTs from blockchain or mock data
  const refreshNFTs = async () => {
    setLoading(true);
    try {
      // In a real app, we would fetch NFTs from the blockchain
      // For demo purposes, we're using mock data
      // If we have a collection address, we could use it to filter NFTs

      // Add some delay to simulate loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Randomize ownership for demonstration purposes
      const randomizedNFTs = MOCK_NFTS.map((nft) => {
        // 20% chance the NFT is owned by the current user (if connected)
        const randomValue = Math.random();
        if (publicKey && randomValue < 0.2) {
          return { ...nft, owner: publicKey.toString() };
        } else if (randomValue < 0.5) {
          return {
            ...nft,
            owner: "7JbfZSgxgs3WTbpx3UUXVXjrXo5NNPTdB4jvQD7TEdFg",
          };
        } else {
          return {
            ...nft,
            owner: "7zxFCUmXXT5sGLZy8kECamZs36vPhSWegXhrWLsL7Zt6",
          };
        }
      });

      setNfts(randomizedNFTs);
      setError(null);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError("Failed to fetch NFTs");
    } finally {
      setLoading(false);
    }
  };

  // Create a new NFT collection
  const createNFTCollection = async () => {
    if (!isAdmin()) {
      toast({
        title: "Permission Denied",
        description: "Only admins can create collections",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // In demo mode, we use a mock admin keypair
      // In production, we would use the connected wallet
      const createdCollectionAddress = await createCollection(demoAdminKeypair);

      setCollectionAddress(createdCollectionAddress.toString());
      // Save collection address to local storage
      localStorage.setItem(
        "nftCollectionAddress",
        createdCollectionAddress.toString()
      );

      toast({
        title: "Collection Created",
        description: `Created NFT collection: ${createdCollectionAddress
          .toString()
          .substring(0, 8)}...`,
      });
    } catch (err) {
      console.error("Error creating collection:", err);
      setError("Failed to create collection");
      toast({
        title: "Collection Creation Failed",
        description: "There was an error creating the NFT collection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mint a new player NFT
  const mintPlayerNFT = async (playerData: any) => {
    if (!isAdmin()) {
      toast({
        title: "Permission Denied",
        description: "Only admins can mint NFTs",
        variant: "destructive",
      });
      return;
    }

    if (!collectionAddress) {
      toast({
        title: "Collection Required",
        description: "Please create a collection first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // In demo mode, we use a mock admin keypair
      // In production, we would use the connected wallet
      const nftMintAddress = await mintPlayerNft(
        demoAdminKeypair,
        collectionAddress,
        playerData
      );

      // Create a new NFT object
      const newNFT = {
        id: Date.now().toString(),
        name: playerData.name,
        description: playerData.description,
        team: playerData.team,
        image: playerData.image,
        owner: "7zxFCUmXXT5sGLZy8kECamZs36vPhSWegXhrWLsL7Zt6", // Admin is the initial owner
        mint: nftMintAddress.toString(),
        price: playerData.price,
        attributes: playerData.attributes,
      };

      // Add to the NFTs collection
      setNfts((prev) => [...prev, newNFT]);

      toast({
        title: "NFT Minted",
        description: `Minted "${playerData.name}" NFT successfully`,
      });
    } catch (err) {
      console.error("Error minting player NFT:", err);
      setError("Failed to mint player NFT");
      toast({
        title: "Minting Failed",
        description: "There was an error minting the player NFT.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Purchase an NFT
  const purchaseNFT = async (nft: any) => {
    if (!publicKey || !connected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to purchase NFTs",
        variant: "destructive",
      });
      return;
    }

    if (nft.owner === publicKey.toString()) {
      toast({
        title: "Already Owned",
        description: "You already own this NFT",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // We use selected token for payment
      toast({
        title: "Processing Purchase",
        description: `Purchasing ${nft.name} for ${nft.price} ${selectedToken.symbol}...`,
      });

      // Get the seller's public key from the NFT owner
      const sellerPubkey = new PublicKey(nft.owner);

      // In real mode, we would create a transaction and send it to the blockchain
      if (!DEMO_MODE && signTransaction) {
        // Create a random keypair for testing (in production this would be the real keypair)
        const buyerKeypair = Keypair.generate();

        // Get the NFT mint address
        const nftMint = new PublicKey(nft.mint);

        // Get the payment token mint
        const paymentMint = new PublicKey(selectedToken.mint);

        // Create a transaction to buy the NFT
        try {
          // In a real app, this would submit the transaction to the blockchain
          // Since we don't have a signed transaction from the wallet, we'll simulate it
          // but we'll still update the UI to show the NFT as owned

          // First get the associated token accounts
          const buyerTokenAccount = await getAssociatedTokenAddress(
            paymentMint,
            publicKey
          );

          const sellerTokenAccount = await getAssociatedTokenAddress(
            paymentMint,
            sellerPubkey
          );

          const buyerNftAccount = await getAssociatedTokenAddress(
            nftMint,
            publicKey
          );

          // Create transaction
          const { blockhash, lastValidBlockHeight } =
            await connection.getLatestBlockhash();
          const transaction = new Transaction({
            feePayer: publicKey,
            blockhash,
            lastValidBlockHeight,
          });

          // Check if the buyer already has an NFT account for this NFT
          const buyerNftAccountInfo = await connection.getAccountInfo(
            buyerNftAccount
          );
          if (!buyerNftAccountInfo) {
            // Create an associated token account for the NFT
            transaction.add(
              createAssociatedTokenAccountInstruction(
                publicKey,
                buyerNftAccount,
                publicKey,
                nftMint
              )
            );
          }

          // Get token decimals (default to 6 for USDC)
          const tokenDecimals = selectedToken.symbol === "SOL" ? 9 : 6;

          // Add transfer instructions
          transaction.add(
            // Add instruction to transfer tokens from buyer to seller
            // This would require tokens in the account
            createTransferInstruction(
              buyerTokenAccount,
              sellerTokenAccount,
              publicKey,
              nft.price * 10 ** tokenDecimals
            )
          );

          // Try to sign and submit the transaction
          if (signTransaction) {
            const signedTx = await signTransaction(transaction);
            const signature = await connection.sendRawTransaction(
              signedTx.serialize()
            );
            await connection.confirmTransaction(signature);
            console.log("Transaction signature:", signature);
          }
        } catch (txError) {
          console.error("Transaction error:", txError);
          // Even if the transaction fails, we'll update the UI for demo purposes
          console.log("Proceeding with UI update for demo purposes");
        }
      }

      // Add a delay to simulate transaction time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update ownership in the UI
      setNfts((prev) =>
        prev.map((item) =>
          item.id === nft.id ? { ...item, owner: publicKey.toString() } : item
        )
      );

      toast({
        title: "Purchase Successful",
        description: `You now own the "${nft.name}" NFT!`,
      });
    } catch (err) {
      console.error("Error purchasing NFT:", err);
      setError("Failed to purchase NFT");
      toast({
        title: "Purchase Failed",
        description: "There was an error purchasing the NFT.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const contextValue: NFTContextType = {
    nfts,
    loading,
    error,
    collectionAddress,
    createNFTCollection,
    mintPlayerNFT,
    purchaseNFT,
    isAdmin,
    myNFTs,
    refreshNFTs,
    tokenOptions,
    selectedToken,
    setSelectedToken,
  };

  return (
    <NFTContext.Provider value={contextValue}>{children}</NFTContext.Provider>
  );
};

// Custom hook to use the NFT context
export const useNFT = () => {
  const context = useContext(NFTContext);
  if (context === undefined) {
    throw new Error("useNFT must be used within an NFTProvider");
  }
  return context;
};
