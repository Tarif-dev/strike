import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Matches from "@/pages/Matches";
import MatchDetail from "@/pages/MatchDetail";
import Players from "@/pages/Players";
import PlayerDetail from "@/pages/PlayerDetail";
import Leagues from "@/pages/Leagues";
import LeagueDetail from "@/pages/LeagueDetail";
import CreateTeam from "@/pages/CreateTeam";
import TeamDetail from "@/pages/TeamDetail";
import Profile from "@/pages/Profile";
import Wallet from "@/pages/Wallet";
import Contests from "@/pages/Contests";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import OtpLogin from "@/pages/auth/OtpLogin";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import AuthCallback from "@/pages/auth/AuthCallback";
import NotFound from "@/pages/NotFound";
import ApiSettings from "@/pages/ApiSettings";
import LandingPage from "@/pages/LandingPage";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Landing page as the root */}
            <Route path="/" element={<LandingPage />} />

            {/* Main app routes */}
            <Route path="/home" element={<Index />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/matches/:id" element={<MatchDetail />} />
            <Route path="/matches/:id/contests" element={<Contests />} />
            <Route path="/contests/:matchId" element={<Contests />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players/:id" element={<PlayerDetail />} />
            <Route path="/leagues" element={<Leagues />} />
            <Route path="/leagues/:id" element={<LeagueDetail />} />
            <Route path="/teams/create" element={<CreateTeam />} />
            <Route path="/teams/:id" element={<TeamDetail />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/api-settings" element={<ApiSettings />} />

            {/* Authentication routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/otp-login" element={<OtpLogin />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
