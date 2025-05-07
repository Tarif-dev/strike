import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageContainer from "@/components/layout/PageContainer";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Edit,
  Loader2,
  Search,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Match data type matching MatchData in MatchCard.tsx
interface MatchData {
  id: string;
  match_id: string;
  teams: {
    home: {
      name: string;
      code: string;
      logo: string;
    };
    away: {
      name: string;
      code: string;
      logo: string;
    };
  };
  tournament: {
    name: string;
    shortName: string;
  };
  venue: string;
  startTime: string;
  status: "upcoming" | "live" | "completed";
  result: string | null;
  scores: {
    home: string | null;
    away: string | null;
  };
  fantasy: {
    contestCount: number;
    prizePool: string;
    entryFees: number[];
    teamsCreated: number;
    percentageJoined: number;
    isHotMatch: boolean;
  };
}

// Team data structure
interface TeamData {
  id: string;
  user_id: string;
  team_name: string;
  match_id: string;
  players: any;
  captain_id: string;
  vice_captain_id: string;
  created_at: string;
  updated_at: string;
  total_points: number | null;
  match_details: any;
  user_details?: {
    email: string;
    username?: string;
  };
}


const ManageMatches = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<MatchData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [teamsForMatch, setTeamsForMatch] = useState<TeamData[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch all matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        
        // Fetch matches from Supabase
        const { data, error } = await supabase
          .from("matches")
          .select("*")
          .order("registration_end_time", { ascending: false });

        if (error) {
          throw error;
        }

        // Transform the data to match the MatchData interface
        const transformedMatches: MatchData[] = data.map((match: any) => {
          // Parse match_details JSON if it exists
          const matchDetails = match.match_details || {};
           
          // Determine match status based on dates and is_finalized flag
          const now = new Date();
          const startTime =
            matchDetails.startTime || match.registration_end_time;
          const matchDate = new Date(startTime);
          const matchEndEstimate = new Date(matchDate);
          matchEndEstimate.setHours(matchEndEstimate.getHours() + 4); // Estimate match duration as 4 hours

          let status: "upcoming" | "live" | "completed" = "upcoming";

          if (match.is_finalized) {
            status = "completed";
          } else if (now >= matchDate && now <= matchEndEstimate) {
            status = "live";
          } else if (now > matchEndEstimate) {
            status = "completed";
          }

          return {
            id: match.match_id,
            match_id: matchDetails.id,
            teams: matchDetails.teams || {
              home: { name: "TBD", code: "TBD", logo: "/team_logos/tbd.jpeg" },
              away: { name: "TBD", code: "TBD", logo: "/team_logos/tbd.jpeg" },
            },
            tournament: matchDetails.tournament || {
              name: "Cricket Fantasy League",
              shortName: "CFL",
            },
            venue: matchDetails.venue || "TBD",
            startTime: startTime,
            status: status,
            result: matchDetails.result || null,
            scores: matchDetails.scores || { home: null, away: null },
            fantasy: matchDetails.fantasy || {
              contestCount: 30,
              prizePool: "5,000 USDC",
              entryFees: [49, 99, 499, 999],
              teamsCreated: 0,
              percentageJoined: 0,
              isHotMatch: match.is_active,
            },
          };
        });

        setMatches(transformedMatches);
        setFilteredMatches(transformedMatches);
      } catch (error: any) {
        console.error("Error fetching matches:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch matches",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

    // Set up real-time subscription to matches table
    const subscription = supabase
      .channel("matches_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        () => fetchMatches()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Filter matches based on search query and active tab
  useEffect(() => {
    if (matches.length === 0) return;

    let filtered = [...matches];
    
    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(match => match.status === activeTab);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        match =>
          match.teams.home.name.toLowerCase().includes(query) ||
          match.teams.away.name.toLowerCase().includes(query) ||
          match.teams.home.code.toLowerCase().includes(query) ||
          match.teams.away.code.toLowerCase().includes(query) ||
          match.id.toLowerCase().includes(query)
      );
    }
    
    setFilteredMatches(filtered);
  }, [matches, searchQuery, activeTab]);

  // Fetch teams for a specific match
  const fetchTeamsForMatch = async (matchId: string) => {
    try {
      setLoadingTeams(true);
      
      // Fetch teams from the teams table
      const { data, error } = await supabase
        .from("teams")
        .select("*, user_details:user_id(email, username)")
        .eq("match_id", matchId)
        .order("total_points", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setTeamsForMatch(data || []);
    } catch (error: any) {
      console.error("Error fetching teams:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch teams",
      });
    } finally {
      setLoadingTeams(false);
    }
  };

  // Update match status
  const updateMatchStatus = async (newStatus: "upcoming" | "live" | "completed") => {
    if (!selectedMatch) return;
    
    try {
      setUpdatingStatus(true);
      
      const matchId = selectedMatch.id;
      
      // Determine what fields to update based on the new status
      const updateData: any = {};
      
      // Always update the match_details object with new status
      const { data: matchData, error: fetchError } = await supabase
        .from("matches")
        .select("*")
        .eq("match_id", matchId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const matchDetails = { ...matchData.match_details };
      matchDetails.status = newStatus;
      updateData.match_details = matchDetails;
      
      // For completed matches, set is_finalized to true
      if (newStatus === "completed") {
        updateData.is_finalized = true;
      }
      
      // Update the match in Supabase
      const { error } = await supabase
        .from("matches")
        .update(updateData)
        .eq("match_id", matchId);
      
      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: `Match status changed to ${newStatus}`,
      });
      
      // Update the selected match in state
      const updatedMatch = { ...selectedMatch, status: newStatus };
      setSelectedMatch(updatedMatch);
      
      // Update the matches list
      const updatedMatches = matches.map(match => 
        match.id === matchId ? updatedMatch : match
      );
      setMatches(updatedMatches);
      
    } catch (error: any) {
      console.error("Error updating match status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update match status",
      });
    } finally {
      setUpdatingStatus(false);
      setShowUpdateDialog(false);
    }
  };

  // View match teams and manage scoring
  const viewMatchDetails = (match: MatchData) => {
    setSelectedMatch(match);
    fetchTeamsForMatch(match.id);
    navigate(`/admin/match/${match.id}/${match.match_id}`);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "upcoming":
        return (
          <div className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
            Upcoming
          </div>
        );
      case "live":
        return (
          <div className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
            Live
          </div>
        );
      case "completed":
        return (
          <div className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400">
            Completed
          </div>
        );
      default:
        return (
          <div className="px-2 py-1 rounded text-xs bg-gray-500/20 text-gray-400">
            {status}
          </div>
        );
    }
  };

  return (
    <PageContainer>
      <div className="mt-8 space-y-6 px-4 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Manage Matches</h1>
            <p className="text-muted-foreground">
              View and manage cricket fantasy matches
            </p>
          </div>
          <Button 
            onClick={() => navigate("/admin/create-match")}
            className="bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90"
          >
            Create New Match
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search matches..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Matches</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex justify-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-cricket-lime" />
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="text-center p-10 bg-cricket-dark-green/40 rounded-md">
                <p>No matches found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMatches.map((match) => (
                  <Card 
                    key={match.id} 
                    className="bg-cricket-medium-green hover:bg-cricket-medium-green/90 transition-colors cursor-pointer"
                    onClick={() => viewMatchDetails(match)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-3 md:mb-0">
                          <div className="flex items-center">
                            <div className="w-12 h-12 flex items-center justify-center">
                              <img 
                                src={match.teams.home.logo} 
                                alt={match.teams.home.name}
                                className="w-10 h-10 object-contain"
                              />
                            </div>
                            <span className="mx-2 text-xl font-semibold">vs</span>
                            <div className="w-12 h-12 flex items-center justify-center">
                              <img 
                                src={match.teams.away.logo} 
                                alt={match.teams.away.name}
                                className="w-10 h-10 object-contain"
                              />
                            </div>
                          </div>
                          
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {match.teams.home.code} vs {match.teams.away.code}
                            </span>
                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                              <CalendarDays className="h-3 w-3" />
                              {match.startTime ? format(new Date(match.startTime), 'dd MMM yyyy, HH:mm') : 'TBD'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs">
                            <Users className="h-3 w-3" />
                            <span>{match.fantasy.teamsCreated}</span>
                          </div>

                          <StatusBadge status={match.status} />

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="p-1 h-8 bg-cricket-dark-green border-cricket-dark-green" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMatch(match);
                                  setShowUpdateDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Status Update Dialog */}
      <AlertDialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <AlertDialogContent className="bg-cricket-dark-green border-cricket-medium-green">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Match Status</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedMatch && (
                <div className="py-2">
                  <p className="mb-2">
                    {selectedMatch.teams.home.name} vs {selectedMatch.teams.away.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Current status: <span className="font-medium text-cricket-lime">{selectedMatch.status}</span>
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => updateMatchStatus("upcoming")}
              disabled={updatingStatus || selectedMatch?.status === "upcoming"}
            >
              <Clock className="mr-2 h-4 w-4" />
              Set as Upcoming
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => updateMatchStatus("live")}
              disabled={updatingStatus || selectedMatch?.status === "live"}
            >
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Set as Live
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => updateMatchStatus("completed")}
              disabled={updatingStatus || selectedMatch?.status === "completed"}
            >
              <Trophy className="mr-2 h-4 w-4 text-amber-500" />
              Set as Completed
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updatingStatus}>Cancel</AlertDialogCancel>
            {updatingStatus && (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};

export default ManageMatches;
