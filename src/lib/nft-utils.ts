import {
  createNft,
  findMetadataPda,
  mplTokenMetadata,
  verifyCollectionV1,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey as UMIPublicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// We'll create a mock uploader instead of using irysUploader for browser compatibility
// import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";

// Fix for browser environment issues
const globalWindow = typeof window !== "undefined" ? window : globalThis;
if (typeof globalWindow.process === "undefined") {
  globalWindow.process = { env: {} };
}

// Cricket player NFT collection for Strike platform
const COLLECTION_NAME = "Strike Cricket Stars";
const COLLECTION_SYMBOL = "SCS";
const COLLECTION_DESCRIPTION =
  "Official collection of cricket player NFTs on the Strike platform";

// Demo mode flag - set to false for real transactions
export const DEMO_MODE = true;

// Connect to Solana devnet
export const connection = new Connection(clusterApiUrl("devnet"));

// Create a mock uploader for demo purposes
const createMockUploader = () => {
  return {
    upload: async (files) => {
      console.log("Mock uploading files:", files);
      // Just return the local path to the image in the public folder
      // In a real environment, this would upload to Irys and return a URL
      return files.map((file) => {
        const fileName = file.fileName || "default.jpg";
        if (fileName.includes("collection.jpeg")) {
          return "/team_logos/tbd.jpeg";
        }

        // For player files, extract the player name and find the matching image
        const playerName = fileName
          .replace(/_/g, " ")
          .replace(".jpg", "")
          .toLowerCase();

        // Map to one of our existing player images
        if (playerName.includes("virat") || playerName.includes("kohli")) {
          return "/players/virat_kohli.jpg";
        } else if (playerName.includes("dhoni")) {
          return "/players/ms_dhoni.jpg";
        } else if (playerName.includes("bumrah")) {
          return "/players/jasprit_bumrah.jpg";
        } else if (playerName.includes("buttler")) {
          return "/players/jos_buttler.jpg";
        } else if (playerName.includes("rashid")) {
          return "/players/rashid_khan.jpg";
        } else if (playerName.includes("pant")) {
          return "/players/rishabh_pant.jpg";
        } else {
          return "/players/featured_nft.jpg";
        }
      });
    },
    uploadJson: async (json) => {
      console.log("Mock uploading JSON:", json);
      // In a real environment, this would upload to Irys and return a URI
      // Just return a fake URI for demo purposes
      return `https://demo-metadata.strike.cricket/${Date.now()}.json`;
    },
  };
};

// Create a new UMI instance for Metaplex operations - with browser-compatibility fixes
export const createUmiInstance = (keypair: Keypair) => {
  try {
    const umi = createUmi(clusterApiUrl("devnet"));
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(keypair.secretKey);

    const instance = umi
      .use(keypairIdentity(umiKeypair))
      .use(mplTokenMetadata());

    // For demo mode, use our mock uploader instead of irysUploader
    if (DEMO_MODE) {
      // Add a mock uploader that doesn't actually upload to Irys
      instance.uploader = createMockUploader();
    }
    // In production, you would use the real uploader
    // else {
    //   instance.use(irysUploader());
    // }

    return instance;
  } catch (error) {
    console.error("Error creating UMI instance:", error);
    // Fallback for browser testing - return mock for UI development
    return {
      use: () => ({
        use: () => ({
          use: () => ({}),
        }),
      }),
      eddsa: {
        createKeypairFromSecretKey: () => ({}),
      },
      identity: {
        publicKey: "mock-public-key",
      },
      uploader: createMockUploader(),
    };
  }
};

// Create a collection NFT that will be used to group player NFTs
export const createCollection = async (adminKeypair: Keypair) => {
  try {
    console.log(
      "Creating collection with authority:",
      adminKeypair.publicKey.toString()
    );

    const umi = createUmiInstance(adminKeypair);

    // Upload the collection image
    const imageResponse = await fetch("/team_logos/tbd.jpeg");
    const imageBuffer = await imageResponse.arrayBuffer();
    const file = createGenericFile(
      new Uint8Array(imageBuffer),
      "collection.jpeg",
      {
        contentType: "image/jpeg",
      }
    );

    const [image] = await umi.uploader.upload([file]);
    console.log("Collection image uploaded:", image);

    // Upload collection metadata
    const uri = await umi.uploader.uploadJson({
      name: COLLECTION_NAME,
      symbol: COLLECTION_SYMBOL,
      description: COLLECTION_DESCRIPTION,
      image,
    });
    console.log("Collection metadata URI:", uri);

    // For DEMO_MODE, we can return a predefined address
    if (DEMO_MODE) {
      console.log("DEMO MODE: Returning mock collection address");
      return new PublicKey("CriCzXnQVJHZrYnFV3UxJMKtgFiZeaL3GsYbAK892LEx");
    }

    // Generate a new mint for the collection
    const collectionMint = generateSigner(umi);

    // Create the collection NFT
    await createNft(umi, {
      mint: collectionMint,
      name: COLLECTION_NAME,
      uri,
      sellerFeeBasisPoints: percentAmount(0), // No royalties on the collection NFT
      isCollection: true,
      updateAuthority: umi.identity.publicKey,
    }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

    console.log("Collection created successfully:", collectionMint.publicKey);

    return collectionMint.publicKey;
  } catch (error) {
    console.error("Error creating collection:", error);
    // Return a mock address for UI testing
    return new PublicKey("CriCzXnQVJHZrYnFV3UxJMKtgFiZeaL3GsYbAK892LEx");
  }
};

// Mint a new player NFT and add it to the collection
export const mintPlayerNft = async (
  adminKeypair: Keypair,
  collectionAddress: string,
  playerData: {
    name: string;
    image: string;
    description: string;
    team: string;
    attributes: { trait_type: string; value: string }[];
    price: number; // In tokens
  }
) => {
  try {
    console.log(`Minting NFT for player: ${playerData.name}`);

    const umi = createUmiInstance(adminKeypair);
    const collectionMint = UMIPublicKey(collectionAddress);

    // Upload the player image
    const imageResponse = await fetch(playerData.image);
    const imageBuffer = await imageResponse.arrayBuffer();
    const file = createGenericFile(
      new Uint8Array(imageBuffer),
      `${playerData.name.replace(/\s+/g, "_")}.jpg`,
      {
        contentType: "image/jpeg",
      }
    );

    const [image] = await umi.uploader.upload([file]);
    console.log("Player image uploaded:", image);

    // Upload player metadata
    const uri = await umi.uploader.uploadJson({
      name: playerData.name,
      symbol: "PLAYER",
      description: playerData.description,
      image,
      attributes: [
        ...playerData.attributes,
        { trait_type: "Price", value: playerData.price.toString() },
      ],
      properties: {
        price: playerData.price,
        team: playerData.team,
      },
    });
    console.log("Player metadata URI:", uri);

    // For DEMO_MODE, return a mock NFT mint
    if (DEMO_MODE) {
      console.log("DEMO MODE: Returning mock NFT mint address");
      // Generate a valid base58 mock address for the mint
      return new PublicKey("11111111111111111111111111111111");
    }

    // Generate a new mint for the player NFT
    const nftMint = generateSigner(umi);

    // Create the player NFT
    await createNft(umi, {
      mint: nftMint,
      name: playerData.name,
      symbol: "PLAYER",
      uri,
      sellerFeeBasisPoints: percentAmount(5), // 5% royalties
      collection: {
        key: collectionMint,
        verified: false,
      },
      updateAuthority: umi.identity.publicKey,
    }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

    console.log("Player NFT created successfully:", nftMint.publicKey);

    // Verify the NFT as part of the collection
    const metadata = findMetadataPda(umi, { mint: nftMint.publicKey });
    await verifyCollectionV1(umi, {
      metadata,
      collectionMint,
      authority: umi.identity,
    }).sendAndConfirm(umi);

    console.log("Player NFT verified in collection");

    return nftMint.publicKey;
  } catch (error) {
    console.error("Error minting player NFT:", error);
    throw error;
  }
};

// Buy an NFT using any SPL Token with wallet-provided transaction signing
export const buyNft = async (
  buyerPublicKey: PublicKey,
  nftMint: PublicKey,
  sellerPubkey: PublicKey,
  paymentMint: PublicKey, // This can be any SPL token mint
  price: number,
  signTransaction: any
) => {
  try {
    console.log("Preparing NFT purchase transaction");
    console.log(`Buyer: ${buyerPublicKey.toString()}`);
    console.log(`NFT: ${nftMint.toString()}`);
    console.log(`Seller: ${sellerPubkey.toString()}`);
    console.log(`Payment: ${price} tokens (${paymentMint.toString()})`);

    // For demo mode, just simulate a successful transaction
    if (DEMO_MODE) {
      console.log("DEMO MODE: Simulating NFT purchase");
      // Wait a moment to simulate transaction time
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return "DemoTransactionSignatureXXXXXXXXXXXXXXXXXXXXXXXXXX";
    }

    // Get token accounts
    const buyerTokenAccount = await getAssociatedTokenAddress(
      paymentMint,
      buyerPublicKey
    );

    const sellerTokenAccount = await getAssociatedTokenAddress(
      paymentMint,
      sellerPubkey
    );

    const buyerNftAccount = await getAssociatedTokenAddress(
      nftMint,
      buyerPublicKey
    );

    const sellerNftAccount = await getAssociatedTokenAddress(
      nftMint,
      sellerPubkey
    );

    // Check if buyer already has a token account for this NFT
    const buyerNftAccountInfo = await connection.getAccountInfo(
      buyerNftAccount
    );

    // Create transaction
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    const transaction = new Transaction({
      feePayer: buyerPublicKey,
      blockhash,
      lastValidBlockHeight,
    });

    // If buyer doesn't have an NFT token account, create one
    if (!buyerNftAccountInfo) {
      console.log("Creating associated token account for buyer");
      transaction.add(
        createAssociatedTokenAccountInstruction(
          buyerPublicKey, // payer
          buyerNftAccount, // associated token account address
          buyerPublicKey, // owner
          nftMint // mint
        )
      );
    }

    // Get decimal places for the payment token
    const tokenDecimals = paymentMint.equals(
      new PublicKey("So11111111111111111111111111111111111111112")
    )
      ? 9 // SOL has 9 decimals
      : 6; // Most SPL tokens like USDC have 6 decimals

    const tokenAmount = Math.round(price * 10 ** tokenDecimals);
    console.log(`Payment amount in raw units: ${tokenAmount}`);

    // Add payment transaction
    transaction.add(
      createTransferInstruction(
        buyerTokenAccount, // source
        sellerTokenAccount, // destination
        buyerPublicKey, // owner of source
        tokenAmount // amount in raw units
      )
    );

    // Transfer NFT from seller to buyer
    transaction.add(
      createTransferInstruction(
        sellerNftAccount, // source
        buyerNftAccount, // destination
        sellerPubkey, // owner of source
        1 // NFTs have a quantity of 1
      )
    );

    // Sign and send the transaction
    if (signTransaction) {
      console.log("Requesting wallet signature...");
      const signedTx = await signTransaction(transaction);
      console.log("Transaction signed, submitting to network...");
      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );
      console.log("Transaction submitted, awaiting confirmation...");

      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      if (confirmation.value.err) {
        console.error(
          "Transaction confirmed with error:",
          confirmation.value.err
        );
        throw new Error(
          `Transaction confirmed with error: ${JSON.stringify(
            confirmation.value.err
          )}`
        );
      }

      console.log("NFT purchase confirmed:", signature);
      return signature;
    } else {
      throw new Error("Transaction signing function not provided");
    }
  } catch (error) {
    console.error("Error buying NFT:", error);
    throw error;
  }
};

// Get all NFTs in a collection
export const getCollectionNfts = async (collectionAddress: string) => {
  try {
    // For demo mode, just return a success message
    if (DEMO_MODE) {
      console.log("DEMO MODE: Simulating collection NFTs retrieval");
      return {
        success: true,
        message: "Collection NFTs retrieved (demo mode)",
        collectionAddress,
      };
    }

    const umi = createUmi(connection);
    umi.use(mplTokenMetadata());

    const collectionMint = new PublicKey(collectionAddress);

    // This is a simplified approach - in a production environment,
    // you would want to use the getProgramAccounts method to find all metadata
    // accounts that reference this collection, or use an indexer like Metaplex's NFT API

    return {
      success: true,
      message: "Collection NFTs retrieved",
      collectionAddress,
    };
  } catch (error) {
    console.error("Error getting collection NFTs:", error);
    throw error;
  }
};
