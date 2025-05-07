import { useState, useEffect } from "react";
import {
  Filter,
  ChevronDown,
  Search,
  X,
  CalendarDays,
  Loader2,
  RefreshCw,
  AlertCircle,
  Wallet
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import AdminMatchCard from "@/components/cricket/AdminMatchCard";
import { MatchData } from "@/components/cricket/MatchCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from 'axios';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

/**
 * InitializeMatches - Admin Page
 * 
 * This page allows administrators to fetch match data from the Cricbuzz API
 * and initialize match pools on both the database and blockchain with a 
 * single button click. It handles match filtering, API data transformation,
 * and tracking of already initialized matches.
 * 
 * @see AdminMatchCard for the card component and blockchain integration
 */

// Interface for Cricbuzz API response
interface CricbuzzApiMatch {
  matchInfo: {
    matchId: number;
    seriesId: number;
    seriesName: string;
    matchDesc: string;
    matchFormat: string;
    startDate: string;
    endDate: string;
    state: string;
    status?: string;
    team1: {
      teamId: number;
      teamName: string;
      teamSName: string;
      imageId: number;
    };
    team2: {
      teamId: number;
      teamName: string;
      teamSName: string;
      imageId: number;
    };
    venueInfo: {
      id?: number;
      ground: string;
      city: string;
      timezone: string;
    };
    isTimeAnnounced: boolean;
    stateTitle: string;
    isFantasyEnabled?: boolean;
  };
}

interface CricbuzzApiResponse {
  typeMatches: Array<{
    matchType: string;
    seriesMatches: Array<{
      seriesAdWrapper: {
        seriesId: number;
        seriesName: string;
        matches: CricbuzzApiMatch[];
      };
      adDetail?: Record<string, unknown>;
    }>;
  }>;
}

const options = {
  method: 'GET',
  url: 'https://cricbuzz-cricket.p.rapidapi.com/matches/v1/upcoming',
  headers: {
    'x-rapidapi-key': 'bee2da4a33msh54fad7b338b78d2p19ea73jsndd8333ad3725',
    'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
  }
};

const AdminMatches = () => {
  const { user } = useAuth();
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState("All");
  const [apiMatches, setApiMatches] = useState<MatchData[]>([]);
  const [initializedMatchIds, setInitializedMatchIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch matches from Cricbuzz API
  const fetchApiMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch matches from Cricbuzz API
      const response = await axios.request(options);
      
      if (!response.data) {
        throw new Error("API returned empty response");
      }
      
      // Log the first match for debugging purposes
      if (process.env.NODE_ENV === 'development' && 
          response.data.typeMatches?.[0]?.seriesMatches?.[0]?.seriesAdWrapper?.matches?.[0]) {
        console.log("Sample API match data:", 
          response.data.typeMatches[0].seriesMatches[0].seriesAdWrapper.matches[0].matchInfo);
      }
      
      const cricbuzzData: CricbuzzApiResponse = response.data;
      
      // Check for valid response structure
      if (!cricbuzzData.typeMatches || !Array.isArray(cricbuzzData.typeMatches)) {
        throw new Error("Invalid API response format");
      }
      
      // Transform Cricbuzz API data to MatchData format
      const matches: MatchData[] = [];
      
      cricbuzzData.typeMatches.forEach(matchType => {
        if (!matchType.seriesMatches || !Array.isArray(matchType.seriesMatches)) {
          return; // Skip invalid match types
        }
        
        matchType.seriesMatches.forEach(seriesMatch => {
          if (seriesMatch.seriesAdWrapper) {
            const series = seriesMatch.seriesAdWrapper;
            
            if (!series.matches || !Array.isArray(series.matches)) {
              return; // Skip invalid series
            }
            
            series.matches.forEach(match => {
              if (!match.matchInfo) {
                return; // Skip invalid match
              }
              
              // Getting venue from venue info
              const venue = match.matchInfo.venueInfo 
                ? `${match.matchInfo.venueInfo.ground}, ${match.matchInfo.venueInfo.city}` 
                : "Venue TBD";
              
              // Process start date
              // Cricbuzz API returns a timestamp as a string
              console.log("Match start date:", match.matchInfo.startDate);
            
                
              // Convert to our MatchData format
              const matchData: MatchData = {
                id: match.matchInfo.matchId.toString(),
                teams: {
                  home: {
                    name: match.matchInfo.team1.teamName,
                    code: match.matchInfo.team1.teamSName,
                    logo: `/team_logos/${match.matchInfo.team1.teamSName.toLowerCase()}.jpeg`,
                  },
                  away: {
                    name: match.matchInfo.team2.teamName,
                    code: match.matchInfo.team2.teamSName,
                    logo: `/team_logos/${match.matchInfo.team2.teamSName.toLowerCase()}.jpeg`,
                  }
                },
                tournament: {
                  name: match.matchInfo.seriesName,
                  shortName: match.matchInfo.seriesName.split(' ').map(word => word[0]).join(''),
                },
                venue: venue,
                startTime: match.matchInfo.startDate,
                status: match.matchInfo.state === "In Progress" ? "live" : 
                         match.matchInfo.state === "Complete" ? "completed" : "upcoming",
              };
              
              // Only add T20, ODI and IPL matches
              if (match.matchInfo.matchFormat === "T20" || 
                  match.matchInfo.matchFormat === "ODI" || 
                  match.matchInfo.matchDesc?.includes("IPL") || 
                  match.matchInfo.seriesName?.includes("Indian Premier League 2025")) {
                matches.push(matchData);
              }
            });
          }
        });
      });
      
      setApiMatches(matches);
      
      // Fetch initialized matches
      await fetchInitializedMatches();
      
    } catch (err) {
      console.error("Error fetching API matches:", err);
      setError("Failed to load matches from API");
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch already initialized matches from Supabase
  const fetchInitializedMatches = async () => {
    try {
      const { data, error } = await supabase
        .from("matches")
        .select("match_id, match_details")
        .eq("is_active", true);
        
      if (error) {
        throw error;
      }
      
      // Extract the original match IDs from the match_details JSON
      const matchIds = data.map(match => {
        // Try to get the original match ID from the match_details JSON
        if (match.match_details && match.match_details.id) {
          return match.match_details.id;
        }
        // Fallback to the UUID if the original ID isn't available
        return match.match_id;
      });
      
      setInitializedMatchIds(matchIds);
      
    } catch (err) {
      console.error("Error fetching initialized matches:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load initialized matches"
      });
    }
  };

  // Handle match initialization callback
  const handleMatchInitialized = async (matchId: string) => {
    // Add the match ID to the initialized matches
    setInitializedMatchIds(prev => [...prev, matchId]);
    
    // Refresh the initialized matches list
    await fetchInitializedMatches();
  };
  
  // Refresh matches
  const refreshMatches = async () => {
    setRefreshing(true);
    try {
      await fetchApiMatches();
      toast({
        title: "Refreshed",
        description: "Match list has been updated",
      });
    } catch (err) {
      console.error("Error refreshing matches:", err);
      toast({
        variant: "destructive",
        title: "Refresh Failed",
        description: err instanceof Error ? err.message : "Failed to update match list",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Filter matches based on active tab
  const filteredMatches = apiMatches.filter(match => {
    if (activeTab === "All") return true;
    if (activeTab === "T20" && (match.tournament.name.includes("T20") || match.tournament.name.includes("Twenty20"))) return true;
    if (activeTab === "ODI" && match.tournament.name.includes("ODI")) return true;
    if (activeTab === "IPL" && match.tournament.name.includes("Indian Premier League 2025")) return true;
    return false;
  });

  // Initial data fetch
  useEffect(() => {
    fetchApiMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if user is admin
  if (!user ) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
          <p className="text-gray-400 mb-8">
            You don't have permission to access this page.
          </p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-neon-green hover:bg-neon-green/90 text-black"
          >
            Go Back
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="bg-cricket-dark-green px-4 py-3 flex items-center justify-between shadow-md mb-6">
        <h1 className="text-xl font-bold text-white">Admin Match Pool Initialization</h1>
        <div className="flex items-center gap-3">
          <WalletMultiButton className="bg-neon-green hover:bg-neon-green/90 text-black font-medium shadow-md transition-all duration-200 hover:shadow-lg" />
          <Button
            onClick={refreshMatches}
            variant="ghost"
            className="text-white hover:bg-neon-green/20"
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Match Pool Initialization</h2>
        <p className="text-gray-400">
          Initialize match pools on both the blockchain and database. This operation is required
          before users can create fantasy teams for a match.
        </p>
        
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge className="bg-gray-700 text-white">
            Total API Matches: {apiMatches.length}
          </Badge>
          <Badge className="bg-neon-green text-black">
            Initialized: {initializedMatchIds.length}
          </Badge>
          <Badge className="bg-yellow-600 text-white">
            Pending: {apiMatches.length - initializedMatchIds.length}
          </Badge>
          <Badge className={wallet.connected ? "bg-green-700 text-white" : "bg-red-700 text-white"}>
            Wallet: {wallet.connected ? "Connected" : "Not Connected"}
          </Badge>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4">
        <Tabs defaultValue="All" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-900/70">
            <TabsTrigger value="All">All Matches</TabsTrigger>
            <TabsTrigger value="IPL">IPL</TabsTrigger>
            <TabsTrigger value="T20">T20</TabsTrigger>
            <TabsTrigger value="ODI">ODI</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* API Key warning */}
      <div className="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded-md mb-6">
        <div className="flex items-start">
          <AlertCircle className="text-yellow-500 mr-3 mt-1 w-5 h-5 flex-shrink-0" />
          <div>
            <h4 className="text-yellow-400 font-medium mb-1">API Key Notice</h4>
            <p className="text-sm text-gray-300">
              The application uses a RapidAPI key for Cricbuzz API. For production, please update the API key
              in the code or move it to environment variables. Current key is limited to development use.
            </p>
          </div>
        </div>
      </div>
      
      {/* Wallet connection reminder */}
      {!wallet.connected && (
        <div className="bg-blue-900/30 border border-blue-700/50 p-4 rounded-md mb-6">
          <div className="flex items-start">
            <Wallet className="text-blue-400 mr-3 mt-1 w-5 h-5 flex-shrink-0" />
            <div>
              <h4 className="text-blue-400 font-medium mb-1">Wallet Connection Required</h4>
              <p className="text-sm text-gray-300">
                Please connect your wallet using the "Select Wallet" button in the top-right corner before initializing match pools.
                Blockchain transactions require a connected wallet to sign and execute.
              </p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-neon-green mb-4" />
          <p className="text-gray-400">Loading matches from API...</p>
        </div>
      ) : error ? (
        <Card className="p-8 bg-red-900/20 border-red-900/30">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Matches</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button 
              onClick={refreshMatches}
              className="bg-neon-green hover:bg-neon-green/90 text-black"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </Card>
      ) : filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <CalendarDays className="w-12 h-12 text-gray-500 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No Matches Found</h3>
          <p className="text-gray-400 mb-4">
            There are no matches available for the selected filter.
          </p>
          <Button 
            onClick={refreshMatches}
            className="bg-neon-green hover:bg-neon-green/90 text-black"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Matches
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredMatches.map((match) => (
            <AdminMatchCard
              key={match.id}
              match={match}
              alreadyInitialized={initializedMatchIds.includes(match.id)}
              onInitialize={handleMatchInitialized}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default AdminMatches;
