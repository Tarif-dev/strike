import {
  LightSystemProgram,
  Rpc,
  confirmTx,
  createRpc,
} from "@lightprotocol/stateless.js";
import { createMint, mintTo, transfer } from "@lightprotocol/compressed-token";
import { Keypair, PublicKey } from "@solana/web3.js";

const DEFAULT_RPC_ENDPOINT = "http://localhost:8899";
const DEFAULT_COMPRESSION_RPC_ENDPOINT = "http://localhost:8784";
const DEFAULT_PROVER_ENDPOINT = "http://localhost:3001";

export const createZkRpcConnection = (
  rpcEndpoint = DEFAULT_RPC_ENDPOINT,
  compressionRpcEndpoint = DEFAULT_COMPRESSION_RPC_ENDPOINT,
  proverEndpoint = DEFAULT_PROVER_ENDPOINT
): Rpc => {
  return createRpc(rpcEndpoint, compressionRpcEndpoint, proverEndpoint);
};

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
  return totalRaw / 10 ** 9;
};
export const requestAirdrop = async (
  connection: Rpc,
  pubkey: PublicKey,
  amount = 10e9
): Promise<string> => {
  try {
    const signature = await connection.requestAirdrop(pubkey, amount);
    await confirmTx(connection, signature);
    return signature;
  } catch (error) {
    console.error("Error requesting airdrop:", error);
    throw error;
  }
};

export const getConnectionStatus = async (
  connection: Rpc
): Promise<{ slot: number; health: any }> => {
  try {
    const slot = await connection.getSlot();

    const health = { status: "healthy" };

    return { slot, health };
  } catch (error) {
    console.error("Error getting connection status:", error);
    throw error;
  }
};

export const generateWalletKeypair = (): Keypair => {
  return Keypair.generate();
};

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
