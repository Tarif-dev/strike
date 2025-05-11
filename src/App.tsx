import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import Matches from "@/pages/Matches";
import MatchDetail from "@/pages/MatchDetail";
import MatchDetails from "@/pages/MatchDetails";
import Players from "@/pages/Players";
import PlayerDetail from "@/pages/PlayerDetail";
import CreateTeam from "@/pages/CreateTeam";
import TeamDetail from "@/pages/TeamDetail";
import Profile from "@/pages/Profile";
import Wallet from "@/pages/Wallet";
import Contests from "@/pages/Contests";
import NFTMarketplace from "@/pages/NFTMarketplace";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import AdminSignup from "@/pages/auth/AdminSignup";
import OtpLogin from "@/pages/auth/OtpLogin";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import AuthCallback from "@/pages/auth/AuthCallback";
import NotFound from "@/pages/NotFound";
import ApiSettings from "@/pages/ApiSettings";
import LandingPage from "@/pages/LandingPage";
import AdminDashboard from "@/pages/admin/Dashboard";
import CreateMatch from "@/pages/admin/CreateMatch";
import { AuthProvider } from "@/contexts/AuthContext";
import { NFTProvider } from "@/contexts/NFTContext";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import AdminRoute from "@/components/layout/AdminRoute";
import React, { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  UnsafeBurnerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
// require('@solana/wallet-adapter-react-ui/styles.css');

// Create a client
const queryClient = new QueryClient();

function App() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new UnsafeBurnerWalletAdapter(),
    ],
    [network]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <BrowserRouter>
              <AuthProvider>
                <NFTProvider>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/signup" element={<Signup />} />
                    <Route
                      path="/auth/admin-signup"
                      element={<AdminSignup />}
                    />
                    <Route path="/auth/otp-login" element={<OtpLogin />} />
                    <Route
                      path="/auth/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route
                      path="/auth/reset-password"
                      element={<ResetPassword />}
                    />
                    <Route path="/auth/callback" element={<AuthCallback />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/home" element={<Home />} />
                      <Route path="/matches" element={<Matches />} />
                      <Route path="/matches/:id" element={<MatchDetails />} />
                      <Route
                        path="/matches/:id/contests"
                        element={<Contests />}
                      />
                      <Route path="/contests/:matchId" element={<Contests />} />
                      <Route path="/players" element={<Players />} />
                      <Route path="/players/:id" element={<PlayerDetail />} />
                      {/* Redirect all leagues routes to matches */}
                      <Route
                        path="/leagues/*"
                        element={<Navigate to="/matches" replace />}
                      />
                      <Route path="/teams/create" element={<CreateTeam />} />
                      <Route path="/teams/:id" element={<TeamDetail />} />
                      <Route path="/wallet" element={<Wallet />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/api-settings" element={<ApiSettings />} />
                      <Route
                        path="/nft-marketplace"
                        element={<NFTMarketplace />}
                      />
                    </Route>

                    {/* Admin routes */}
                    <Route element={<AdminRoute />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route
                        path="/admin/create-match"
                        element={<CreateMatch />}
                      />
                    </Route>

                    {/* Fallback for unknown routes */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </NFTProvider>
              </AuthProvider>
            </BrowserRouter>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
}

export default App;
