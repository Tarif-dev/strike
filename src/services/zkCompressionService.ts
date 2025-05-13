import {
  LightSystemProgram,
  Rpc,
  confirmTx,
  createRpc,
} from "@lightprotocol/stateless.js";
import { createMint, mintTo, transfer } from "@lightprotocol/compressed-token";
import { Keypair, PublicKey } from "@solana/web3.js";

// Default RPC endpoint for localnet testing
// You can switch to devnet later by changing these endpoints
const DEFAULT_RPC_ENDPOINT = "http://localhost:8899";
const DEFAULT_COMPRESSION_RPC_ENDPOINT = "http://localhost:8784";
const DEFAULT_PROVER_ENDPOINT = "http://localhost:3001";

// For devnet
// const DEVNET_RPC_ENDPOINT = "https://devnet.helius-rpc.com?api-key=<api_key>";
// const DEVNET_COMPRESSION_RPC_ENDPOINT = DEVNET_RPC_ENDPOINT;
// const DEVNET_PROVER_ENDPOINT = DEVNET_RPC_ENDPOINT;

// Create RPC connection
export const createZkRpcConnection = (
  rpcEndpoint = DEFAULT_RPC_ENDPOINT,
  compressionRpcEndpoint = DEFAULT_COMPRESSION_RPC_ENDPOINT,
  proverEndpoint = DEFAULT_PROVER_ENDPOINT
): Rpc => {
  return createRpc(rpcEndpoint, compressionRpcEndpoint, proverEndpoint);
};

// Create a new compressed token mint
export const createCompressedTokenMint = async (
  connection: Rpc,
  payer: Keypair,
  decimals = 9
): Promise<{
  mint: PublicKey;
  transactionSignature: string;
}> => {
  try {
    const { mint, transactionSignature } = await createMint(
      connection,
      payer,
      payer.publicKey,
      decimals
    );

    return { mint, transactionSignature };
  } catch (error) {
    console.error("Error creating compressed token mint:", error);
    throw error;
  }
};

// Mint compressed tokens to a wallet
export const mintCompressedTokens = async (
  connection: Rpc,
  payer: Keypair,
  mint: PublicKey,
  destination: PublicKey,
  amount: number
): Promise<string> => {
  try {
    const mintToTxId = await mintTo(
      connection,
      payer,
      mint,
      destination,
      payer,
      amount
    );

    return mintToTxId;
  } catch (error) {
    console.error("Error minting compressed tokens:", error);
    throw error;
  }
};

// Transfer compressed tokens between wallets
export const transferCompressedTokens = async (
  connection: Rpc,
  payer: Keypair,
  mint: PublicKey,
  amount: number,
  source: Keypair,
  destination: PublicKey
): Promise<string> => {
  try {
    const transferTxId = await transfer(
      connection,
      payer,
      mint,
      amount,
      source,
      destination
    );

    return transferTxId;
  } catch (error) {
    console.error("Error transferring compressed tokens:", error);
    throw error;
  }
};

// Get token balance for a wallet
export const getCompressedTokenBalance = async (
  connection: Rpc,
  owner: PublicKey,
  mint: PublicKey
): Promise<number> => {
  const { items } = await connection.getCompressedTokenAccountsByOwner(owner);

  const mintStr = mint.toBase58();
  const relevant = items.filter((item) => item.parsed.mint === mint);
  if (relevant.length === 0) return 0;
  const totalRaw = relevant.reduce((sum, item) => sum + item.parsed.amount, 0);
  // Adjust for 9 decimals
  return totalRaw / 10 ** 9;
};
// Request airdrop of SOL for testing
export const requestAirdrop = async (
  connection: Rpc,
  pubkey: PublicKey,
  amount = 10e9
): Promise<string> => {
  try {
    // For local testing
    const signature = await connection.requestAirdrop(pubkey, amount);
    await confirmTx(connection, signature);
    return signature;
  } catch (error) {
    console.error("Error requesting airdrop:", error);
    throw error;
  }
};

// Get connection status and indexer health
export const getConnectionStatus = async (
  connection: Rpc
): Promise<{ slot: number; health: any }> => {
  try {
    // For demo purposes, we'll use simplified logic
    // In a real implementation, you would use the proper Light Protocol methods
    const slot = await connection.getSlot();

    // Mock health data for demo
    const health = { status: "healthy" };

    return { slot, health };
  } catch (error) {
    console.error("Error getting connection status:", error);
    throw error;
  }
};

// Generate a new keypair
export const generateWalletKeypair = (): Keypair => {
  return Keypair.generate();
};

// Store keypair in local storage
export const storeKeypair = (name: string, keypair: Keypair): void => {
  try {
    localStorage.setItem(
      `zk-compression-${name}`,
      JSON.stringify({
        publicKey: keypair.publicKey.toBase58(),
        privateKey: Array.from(keypair.secretKey),
      })
    );
  } catch (error) {
    console.error("Error storing keypair:", error);
    throw error;
  }
};

// Retrieve keypair from local storage
export const getStoredKeypair = (name: string): Keypair | null => {
  try {
    const keypairData = localStorage.getItem(`zk-compression-${name}`);
    if (keypairData) {
      const { privateKey } = JSON.parse(keypairData);
      return Keypair.fromSecretKey(new Uint8Array(privateKey));
    }
    return null;
  } catch (error) {
    console.error("Error retrieving keypair:", error);
    return null;
  }
};

// Get public key from local storage
export const getStoredPublicKey = (name: string): PublicKey | null => {
  try {
    const keypairData = localStorage.getItem(`zk-compression-${name}`);
    if (keypairData) {
      const { publicKey } = JSON.parse(keypairData);
      return new PublicKey(publicKey);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving public key:", error);
    return null;
  }
};
