import React, { useState, useEffect, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import PageLayout from '@/components/layout/PageContainer';

// USDC token addresses for different networks
const USDC_MINT_ADDRESSES = {
  'mainnet-beta': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  'devnet': '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', // Devnet USDC mock address
  'testnet': '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', // Using devnet mock for testnet as well
};

const WalletConnect = () => {
  const { connection } = useConnection();
  const { publicKey, connected, wallet } = useWallet();
  
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Determine which network we're on by checking the connection endpoint
  const network = useMemo(() => {
    const endpoint = connection.rpcEndpoint;
    if (endpoint.includes('devnet')) return 'devnet';
    if (endpoint.includes('testnet')) return 'testnet';
    return 'mainnet-beta';
  }, [connection]);

  // Fetch SOL balance
  const fetchSolBalance = async (walletPublicKey: PublicKey) => {
    try {
      const balance = await connection.getBalance(walletPublicKey);
      // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
      setSolBalance(balance / 1_000_000_000);
    } catch (err) {
      console.error("Error fetching SOL balance:", err);
      setError("Failed to fetch SOL balance");
    }
  };

  // Fetch USDC balance
  const fetchUsdcBalance = async (walletPublicKey: PublicKey) => {
    try {
      // Get the correct USDC mint address based on current network
      const usdcMintAddress = USDC_MINT_ADDRESSES[network];
      const USDC_MINT = new PublicKey(usdcMintAddress);

      // Find all token accounts owned by the wallet
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        walletPublicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      // Find the USDC token account
      const usdcAccount = tokenAccounts.value.find(
        (account) => account.account.data.parsed.info.mint === USDC_MINT.toString()
      );

      if (usdcAccount) {
        // Get balance and adjust for decimals (USDC has 6 decimals)
        const balance = usdcAccount.account.data.parsed.info.tokenAmount.uiAmount;
        setUsdcBalance(balance);
      } else {
        // No USDC account found, balance is 0
        setUsdcBalance(0);
      }
    } catch (err) {
      console.error("Error fetching USDC balance:", err);
      setError("Failed to fetch USDC balance");
    }
  };

  // Refresh all balances
  const refreshBalances = async () => {
    if (publicKey) {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchSolBalance(publicKey),
          fetchUsdcBalance(publicKey)
        ]);
      } catch (err) {
        console.error("Error refreshing balances:", err);
        setError("Failed to refresh balances");
      } finally {
        setLoading(false);
      }
    }
  };

  // Create USDC Token Account
  const createUsdcTokenAccount = async () => {
    if (!publicKey || !wallet) {
      setError("Wallet not connected");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } = await import('@solana/spl-token');
      
      const usdcMintAddress = USDC_MINT_ADDRESSES[network];
      const usdcMint = new PublicKey(usdcMintAddress);
      
      // Get the associated token address for this wallet
      const associatedTokenAddress = await getAssociatedTokenAddress(
        usdcMint,
        publicKey,
        false
      );
      
      // Check if the account already exists
      const accountInfo = await connection.getAccountInfo(associatedTokenAddress);
      
      if (accountInfo !== null) {
        setError("USDC token account already exists!");
        setLoading(false);
        return;
      }
      
      // Create the associated token account instruction
      const createATAInstruction = createAssociatedTokenAccountInstruction(
        publicKey, // payer
        associatedTokenAddress, // associated token account address
        publicKey, // owner
        usdcMint // mint
      );
      
      // Create a new transaction and add the instruction
      const { Transaction } = await import('@solana/web3.js');
      const transaction = new Transaction().add(createATAInstruction);
      
      // Set recent blockhash and fee payer
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
      
      // Sign and send the transaction
      const signedTx = await wallet.adapter.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      // Refresh balances after creating the token account
      await refreshBalances();
      
    } catch (err) {
      console.error("Error creating token account:", err);
      setError(`Failed to create token account: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Request airdrop (only on devnet)
  const requestAirdrop = async () => {
    if (!publicKey) {
      setError("Wallet not connected");
      return;
    }

    if (network !== 'devnet') {
      setError("Airdrops are only available on devnet");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Request 1 SOL airdrop (1 SOL = 1,000,000,000 lamports)
      const signature = await connection.requestAirdrop(
        publicKey,
        1_000_000_000
      );
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      // Refresh SOL balance after airdrop
      await fetchSolBalance(publicKey);
      
    } catch (err) {
      console.error("Error requesting airdrop:", err);
      setError(`Airdrop failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch balances when wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      refreshBalances();
    } else {
      // Reset balances when wallet is disconnected
      setUsdcBalance(null);
      setSolBalance(null);
    }
  }, [connected, publicKey, network]);

  return (
    <PageLayout title="Wallet">
      <div className="wallet-page">
        <div className="wallet-container">
          <h1 className="text-2xl font-bold mb-6">Solana Wallet</h1>
          
          <div className="network-badge mb-4">
            Current Network: <span className="font-semibold">{network}</span>
          </div>
          
          <div className="wallet-connection mb-6">
            <h2 className="text-lg font-semibold mb-2">Connect Wallet</h2>
            <WalletMultiButton />
          </div>
          
          {error && (
            <div className="error-alert mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {connected && publicKey && (
            <div className="wallet-details">
              <div className="address-container mb-4">
                <h2 className="text-lg font-semibold mb-2">Wallet Address</h2>
                <div className="address p-3 bg-gray-100 rounded break-all">
                  {publicKey.toString()}
                </div>
              </div>
              
              <div className="balances-container mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">Balances</h2>
                  <button 
                    onClick={refreshBalances} 
                    disabled={loading}
                    className="refresh-button px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    {loading ? 'Refreshing...' : '↻ Refresh'}
                  </button>
                </div>
                
                <div className="balance-cards grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="balance-card p-4 bg-white border rounded shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">SOL Balance</div>
                    <div className="text-2xl font-bold">
                      {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : 'Loading...'}
                    </div>
                  </div>
                  
                  <div className="balance-card p-4 bg-white border rounded shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">USDC Balance</div>
                    <div className="text-2xl font-bold">
                      {usdcBalance !== null ? `${usdcBalance.toFixed(2)} USDC` : 'Loading...'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="wallet-actions grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={createUsdcTokenAccount} 
                  disabled={loading}
                  className="create-account-button p-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300"
                >
                  Create USDC Token Account
                </button>
                
                {network === 'devnet' && (
                  <button 
                    onClick={requestAirdrop} 
                    disabled={loading}
                    className="airdrop-button p-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
                  >
                    Request SOL Airdrop (1 SOL)
                  </button>
                )}
              </div>
              
              {network === 'devnet' && (
                <div className="devnet-notice mt-6 p-3 bg-blue-100 border border-blue-300 text-blue-800 rounded">
                  <p className="text-sm">
                    <strong>Devnet Notice:</strong> You're currently on Solana's devnet. 
                    Use the airdrop button to get test SOL, and create a USDC token account to view your USDC balance.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default WalletConnect;