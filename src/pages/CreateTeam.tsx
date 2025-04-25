import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  AlertTriangle,
  Zap,
  Trophy,
  Crown,
  User,
  Filter,
  Search,
  X,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Shield,
  Loader2,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Components
import PageContainer from "@/components/layout/PageContainer";
import PlayerCard, { PlayerData } from "@/components/cricket/PlayerCard";
import { Tabs } from "@/components/ui/tab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Data
import {
  players,
  matches,
  countryFlags,
  extendedPlayers,
} from "@/data/mockData";

// Team balance constraints
const TEAM_CONSTRAINTS = {
  MAX_PLAYERS: 11,
  MIN_BATSMEN: 3,
  MIN_BOWLERS: 3,
  MIN_ALL_ROUNDERS: 1,
  MAX_FROM_TEAM: 7,
};

// Create teams table function
const createTeamsTable = async () => {
  try {
    // Check if table exists using a direct query instead of _database
    const { data, error } = await supabase.from("teams").select("id").limit(1);

    if (error && error.code === "42P01") {
      // Table doesn't exist error code
      console.log("Table doesn't exist, proceeding with creation");

      // Create the teams table via raw SQL query using RPC
      try {
        // We'll skip this approach as it requires additional setup
        console.log(
          "Teams table needs to be created manually through Supabase dashboard"
        );
      } catch (createError) {
        console.error("Error creating teams table:", createError);
      }
    }

    return true;
  } catch (error) {
    console.error("Error with teams table check:", error);
    return false;
  }
};

const CreateTeam = () => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // States
  const [teamName, setTeamName] = useState("My Fantasy XI");
  const [activeTab, setActiveTab] = useState("Batsmen");
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerData[]>([]);
  const [captain, setCaptain] = useState<PlayerData | null>(null);
  const [viceCaptain, setViceCaptain] = useState<PlayerData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTeamPreview, setShowTeamPreview] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [sortBy, setSortBy] = useState("points");
  const [teamValidationError, setTeamValidationError] = useState<string | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  // States for dual team display
  const [selectedMatch, setSelectedMatch] = useState(matches[0]);
  const [homeTeamPlayers, setHomeTeamPlayers] = useState<PlayerData[]>([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState<PlayerData[]>([]);
  const [activeTeamTab, setActiveTeamTab] = useState<"home" | "away">("home");

  // Derived states
  const currentPlayers = selectedPlayers.length;
  const currentBatsmen = selectedPlayers.filter(
    (p) => p.position === "Batsman"
  ).length;
  const currentBowlers = selectedPlayers.filter(
    (p) => p.position === "Bowler"
  ).length;
  const currentAllRounders = selectedPlayers.filter(
    (p) => p.position === "All-rounder"
  ).length;

  // Team balance summary
  const teamBalanceSummary = [
    {
      label: "Batsmen",
      current: currentBatsmen,
      min: TEAM_CONSTRAINTS.MIN_BATSMEN,
      status:
        currentBatsmen >= TEAM_CONSTRAINTS.MIN_BATSMEN ? "valid" : "invalid",
    },
    {
      label: "Bowlers",
      current: currentBowlers,
      min: TEAM_CONSTRAINTS.MIN_BOWLERS,
      status:
        currentBowlers >= TEAM_CONSTRAINTS.MIN_BOWLERS ? "valid" : "invalid",
    },
    {
      label: "All-rounders",
      current: currentAllRounders,
      min: TEAM_CONSTRAINTS.MIN_ALL_ROUNDERS,
      status:
        currentAllRounders >= TEAM_CONSTRAINTS.MIN_ALL_ROUNDERS
          ? "valid"
          : "invalid",
    },
  ];

  // Team credits and balance calculations
  const totalCredits = 100;
  const usedCredits = selectedPlayers.reduce(
    (sum, player) => sum + (player.points || 0) / 100,
    0
  );
  const remainingCredits = totalCredits - usedCredits;

  useEffect(() => {
    validateTeam();
  }, [selectedPlayers, captain, viceCaptain]);

  // Initialize team players when match is selected
  useEffect(() => {
    // Get team-specific players from the extendedPlayers object
    const homeTeam = selectedMatch.teams.home.name;
    const awayTeam = selectedMatch.teams.away.name;

    // Get team code for lookup (lowercased)
    const homeCode = selectedMatch.teams.home.code.toLowerCase();
    const awayCode = selectedMatch.teams.away.code.toLowerCase();

    // Get players from extendedPlayers or fallback to generating players
    const getTeamPlayers = (
      teamCode: string,
      teamName: string,
      teamLogo: string
    ) => {
      // Try to get players from our predefined extendedPlayers
      if (extendedPlayers[teamCode as keyof typeof extendedPlayers]) {
        return extendedPlayers[teamCode as keyof typeof extendedPlayers];
      }

      // Fallback: Generate players if team not in extendedPlayers
      const existingTeamPlayers = players
        .filter((p) => p.team === teamName || p.team.includes(teamName))
        .slice(0, 3);

      // Create balanced team with proper distribution of players
      const positions = ["Batsman", "Bowler", "All-rounder"];
      const distributionNeeded = [
        { position: "Batsman", count: 5 },
        { position: "Bowler", count: 4 },
        { position: "All-rounder", count: 2 },
      ];

      // Count existing players by position
      const existingPositionCounts = {
        Batsman: existingTeamPlayers.filter((p) => p.position === "Batsman")
          .length,
        Bowler: existingTeamPlayers.filter((p) => p.position === "Bowler")
          .length,
        "All-rounder": existingTeamPlayers.filter(
          (p) => p.position === "All-rounder"
        ).length,
      };

      // Generate players to fill the team with proper distribution
      const dummyPlayers: PlayerData[] = [];

      distributionNeeded.forEach(({ position, count }) => {
        const existing =
          existingPositionCounts[
            position as keyof typeof existingPositionCounts
          ];
        const needed = count - existing;

        for (let i = 0; i < needed; i++) {
          const id = `${teamName.toLowerCase()}-${position
            .toLowerCase()
            .replace("-", "")}-${i}`;

          dummyPlayers.push({
            id,
            name: `${teamName} ${position} ${i + 1}`,
            team: teamName,
            teamLogo: teamLogo,
            position,
            country: teamName.includes("India") ? "India" : "International",
            countryFlag: countryFlags.india,
            stats:
              position === "Batsman"
                ? {
                    matches: Math.floor(Math.random() * 50) + 20,
                    runs: Math.floor(Math.random() * 2000) + 500,
                    average: Math.floor(Math.random() * 15) + 30,
                    strikeRate: Math.floor(Math.random() * 20) + 130,
                  }
                : position === "Bowler"
                ? {
                    matches: Math.floor(Math.random() * 40) + 15,
                    wickets: Math.floor(Math.random() * 80) + 20,
                    economy: Math.random() * 2 + 7,
                    average: Math.floor(Math.random() * 10) + 20,
                  }
                : {
                    matches: Math.floor(Math.random() * 45) + 25,
                    runs: Math.floor(Math.random() * 1000) + 300,
                    wickets: Math.floor(Math.random() * 50) + 15,
                    average: Math.floor(Math.random() * 10) + 25,
                    economy: Math.random() * 1.5 + 7.5,
                    strikeRate: Math.floor(Math.random() * 15) + 120,
                  },
            points:
              Math.floor(Math.random() * 200) +
              (position === "Batsman"
                ? 600
                : position === "Bowler"
                ? 550
                : 650),
          });
        }
      });

      return [...existingTeamPlayers, ...dummyPlayers];
    };

    // Get players for both teams using our helper function
    const homeTeamFinal = getTeamPlayers(
      homeCode,
      homeTeam,
      selectedMatch.teams.home.logo
    );
    const awayTeamFinal = getTeamPlayers(
      awayCode,
      awayTeam,
      selectedMatch.teams.away.logo
    );

    setHomeTeamPlayers(homeTeamFinal);
    setAwayTeamPlayers(awayTeamFinal);
  }, [selectedMatch]);

  // Get players based on active tab and search query
  const getFilteredPlayers = () => {
    let filteredPlayers = [...players];

    // Filter by category tab
    if (activeTab === "Batsmen") {
      filteredPlayers = filteredPlayers.filter((p) => p.position === "Batsman");
    } else if (activeTab === "Bowlers") {
      filteredPlayers = filteredPlayers.filter((p) => p.position === "Bowler");
    } else if (activeTab === "All-rounders") {
      filteredPlayers = filteredPlayers.filter(
        (p) => p.position === "All-rounder"
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredPlayers = filteredPlayers.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.team.toLowerCase().includes(query)
      );
    }

    // Sort players
    if (sortBy === "points") {
      filteredPlayers.sort((a, b) => (b.points || 0) - (a.points || 0));
    } else if (sortBy === "name") {
      filteredPlayers.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filteredPlayers;
  };

  // Get team filtered players
  const getTeamFilteredPlayers = () => {
    // Get appropriate team players
    let teamPlayers =
      activeTeamTab === "home" ? [...homeTeamPlayers] : [...awayTeamPlayers];

    // Filter by position tab
    if (activeTab === "Batsmen") {
      teamPlayers = teamPlayers.filter((p) => p.position === "Batsman");
    } else if (activeTab === "Bowlers") {
      teamPlayers = teamPlayers.filter((p) => p.position === "Bowler");
    } else if (activeTab === "All-rounders") {
      teamPlayers = teamPlayers.filter((p) => p.position === "All-rounder");
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      teamPlayers = teamPlayers.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.team.toLowerCase().includes(query)
      );
    }

    // Sort players
    if (sortBy === "points") {
      teamPlayers.sort((a, b) => (b.points || 0) - (a.points || 0));
    } else if (sortBy === "name") {
      teamPlayers.sort((a, b) => a.name.localeCompare(b.name));
    }

    return teamPlayers;
  };

  const homeTeamFilteredPlayers = homeTeamPlayers.filter((player) => {
    if (activeTab === "Batsmen") return player.position === "Batsman";
    if (activeTab === "Bowlers") return player.position === "Bowler";
    if (activeTab === "All-rounders") return player.position === "All-rounder";
    return true;
  });

  const awayTeamFilteredPlayers = awayTeamPlayers.filter((player) => {
    if (activeTab === "Batsmen") return player.position === "Batsman";
    if (activeTab === "Bowlers") return player.position === "Bowler";
    if (activeTab === "All-rounders") return player.position === "All-rounder";
    return true;
  });

  // Old filtered players method (keep for reference/compatibility)
  const filteredPlayers = getFilteredPlayers();

  // Check if adding a player would violate team constraints
  const wouldViolateTeamConstraints = (player: PlayerData) => {
    if (selectedPlayers.length >= TEAM_CONSTRAINTS.MAX_PLAYERS) {
      return "Maximum 11 players allowed";
    }

    // Check team quota
    const teamCount = selectedPlayers.filter(
      (p) => p.team === player.team
    ).length;
    if (teamCount >= TEAM_CONSTRAINTS.MAX_FROM_TEAM) {
      return `Maximum ${TEAM_CONSTRAINTS.MAX_FROM_TEAM} players allowed from same team`;
    }

    // Check if player would exceed credit limit
    const playerCredit = (player.points || 0) / 100;
    if (usedCredits + playerCredit > totalCredits) {
      return "Not enough credits remaining";
    }

    return null;
  };

  // Handle player selection/deselection
  const handlePlayerSelection = (player: PlayerData) => {
    const isAlreadySelected = selectedPlayers.some((p) => p.id === player.id);

    if (isAlreadySelected) {
      // Deselect player
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));

      // If player was captain or vice captain, remove that designation
      if (captain?.id === player.id) setCaptain(null);
      if (viceCaptain?.id === player.id) setViceCaptain(null);
    } else {
      // Check team constraints
      const constraintError = wouldViolateTeamConstraints(player);
      if (constraintError) {
        toast({
          title: "Cannot Add Player",
          description: constraintError,
          variant: "destructive",
        });
        return;
      }

      // Add player to selected list
      setSelectedPlayers([...selectedPlayers, player]);
      toast({
        title: "Player Added",
        description: `${player.name} added to your team`,
        variant: "default",
      });
    }
  };

  // Handle captain selection
  const handleCaptainSelection = (player: PlayerData) => {
    // Player must be selected first
    if (!selectedPlayers.some((p) => p.id === player.id)) {
      toast({
        title: "Player Not Selected",
        description: "You need to select this player first",
        variant: "destructive",
      });
      return;
    }

    // Handle captain/vice captain logic
    if (captain?.id === player.id) {
      // Deselect captain
      setCaptain(null);
    } else if (viceCaptain?.id === player.id) {
      // Player is already vice captain, make them captain and remove vice captain
      setCaptain(player);
      setViceCaptain(null);
    } else {
      // Make player captain
      setCaptain(player);
    }
  };

  // Handle vice captain selection
  const handleViceCaptainSelection = (player: PlayerData) => {
    // Player must be selected first
    if (!selectedPlayers.some((p) => p.id === player.id)) {
      toast({
        title: "Player Not Selected",
        description: "You need to select this player first",
        variant: "destructive",
      });
      return;
    }

    // Handle captain/vice captain logic
    if (viceCaptain?.id === player.id) {
      // Deselect vice captain
      setViceCaptain(null);
    } else if (captain?.id === player.id) {
      // Player is already captain, make them vice captain and remove captain
      setViceCaptain(player);
      setCaptain(null);
    } else {
      // Make player vice captain
      setViceCaptain(player);
    }
  };

  // Validate if team meets all requirements
  const validateTeam = () => {
    if (selectedPlayers.length < TEAM_CONSTRAINTS.MAX_PLAYERS) {
      setTeamValidationError(
        `Select ${TEAM_CONSTRAINTS.MAX_PLAYERS} players (${selectedPlayers.length}/${TEAM_CONSTRAINTS.MAX_PLAYERS})`
      );
      return false;
    }

    if (currentBatsmen < TEAM_CONSTRAINTS.MIN_BATSMEN) {
      setTeamValidationError(
        `Need at least ${TEAM_CONSTRAINTS.MIN_BATSMEN} batsmen (${currentBatsmen}/${TEAM_CONSTRAINTS.MIN_BATSMEN})`
      );
      return false;
    }

    if (currentBowlers < TEAM_CONSTRAINTS.MIN_BOWLERS) {
      setTeamValidationError(
        `Need at least ${TEAM_CONSTRAINTS.MIN_BOWLERS} bowlers (${currentBowlers}/${TEAM_CONSTRAINTS.MIN_BOWLERS})`
      );
      return false;
    }

    if (currentAllRounders < TEAM_CONSTRAINTS.MIN_ALL_ROUNDERS) {
      setTeamValidationError(
        `Need at least ${TEAM_CONSTRAINTS.MIN_ALL_ROUNDERS} all-rounders (${currentAllRounders}/${TEAM_CONSTRAINTS.MIN_ALL_ROUNDERS})`
      );
      return false;
    }

    if (!captain) {
      setTeamValidationError("Select a captain");
      return false;
    }

    if (!viceCaptain) {
      setTeamValidationError("Select a vice captain");
      return false;
    }

    setTeamValidationError(null);
    return true;
  };

  // Handle team creation
  const handleCreateTeam = async () => {
    // Validate team name
    if (!teamName.trim()) {
      toast({
        title: "Team Name Required",
        description: "Please enter a name for your team",
        variant: "destructive",
      });
      return;
    }

    // Validate team
    if (!validateTeam()) {
      toast({
        title: "Team Requirements Not Met",
        description: teamValidationError || "Please check your team selection",
        variant: "destructive",
      });
      return;
    }

    // Verify user authentication
    if (!user || !user.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a team",
        variant: "destructive",
      });
      navigate("/auth/login", { state: { from: location.pathname } });
      return;
    }

    try {
      // Start saving process
      setIsSaving(true);

      console.log("Creating team with user:", user.id);

      // Create match details object - keep only necessary data
      const matchDetails = {
        match_id: selectedMatch.id,
        tournament: selectedMatch.tournament.name,
        venue: selectedMatch.venue,
        date: selectedMatch.startTime,
        teams: {
          home: {
            name: selectedMatch.teams.home.name,
            code: selectedMatch.teams.home.code,
            logo: selectedMatch.teams.home.logo,
          },
          away: {
            name: selectedMatch.teams.away.name,
            code: selectedMatch.teams.away.code,
            logo: selectedMatch.teams.away.logo,
          },
        },
      };

      // Create sanitized player objects (remove circular references)
      const sanitizedPlayers = selectedPlayers.map((player) => ({
        id: player.id,
        name: player.name,
        position: player.position,
        team: player.team,
        teamLogo: player.teamLogo || null,
        image: player.image || null,
        points: player.points || 0,
        country: player.country || null,
      }));

      // Create team object to store in database
      const teamData = {
        user_id: user.id,
        team_name: teamName,
        match_id: selectedMatch.id,
        players: sanitizedPlayers,
        captain_id: captain?.id || "",
        vice_captain_id: viceCaptain?.id || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        total_points: 0,
        match_details: matchDetails,
      };

      console.log("Saving team data to Supabase");

      // Need to make sure the current user has RLS permissions
      // First, request the current user's auth status to ensure tokens are fresh
      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        throw new Error("Authentication required. Please log in again.");
      }

      // Save team to Supabase
      const { data, error } = await supabase
        .from("teams")
        .insert(teamData)
        .select();

      console.log("Supabase response:", { data, error });

      // Handle completion
      setIsSaving(false);

      if (error) {
        console.error("Supabase error details:", error);

        // Special handling for RLS policy violations
        if (error.code === "42501" || error.message?.includes("policy")) {
          throw new Error(
            `Row-level security policy violation. Make sure you have proper permission to create teams.`
          );
        }

        throw new Error(`Database error: ${error.message || error.code}`);
      }

      // Show success notification
      toast({
        title: "Team Created Successfully!",
        description: `Your team "${teamName}" is ready`,
        variant: "default",
      });

      // Navigate to matches page
      setTimeout(() => {
        navigate("/matches");
      }, 1500);
    } catch (error) {
      setIsSaving(false);
      console.error("Error creating team:", error);

      toast({
        title: "Failed to Create Team",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedPlayers([]);
    setCaptain(null);
    setViceCaptain(null);
    toast({
      title: "Team Cleared",
      description: "All player selections have been cleared",
      variant: "default",
    });
  };

  // Generate player count badge
  const renderPlayerCountBadge = (count: number, max: number) => {
    const isFull = count >= max;
    return (
      <Badge variant={isFull ? "destructive" : "secondary"} className="ml-auto">
        {count}/{max}
      </Badge>
    );
  };

  return (
    <PageContainer className="pb-24 pt-4 relative">
      {/* Header with back button */}
      <div className="flex justify-between items-center mb-4">
        <Link to="/matches" className="flex items-center gap-1 text-neon-green">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-gray-900/70">
            <Zap className="w-3 h-3 mr-1 text-neon-green" />
            <span className="text-neon-green">
              {remainingCredits.toFixed(1)} Cr
            </span>
          </Badge>

          <Badge
            variant={
              currentPlayers < TEAM_CONSTRAINTS.MAX_PLAYERS
                ? "default"
                : "destructive"
            }
          >
            <Users className="w-3 h-3 mr-1" />
            <span>
              {selectedPlayers.length}/{TEAM_CONSTRAINTS.MAX_PLAYERS}
            </span>
          </Badge>
        </div>
      </div>

      {/* Match selection - Moved to top */}
      <div className="mb-6 bg-gray-900/80 backdrop-blur-sm rounded-xl p-4">
        <h2 className="font-semibold mb-3 text-lg">Match</h2>
        <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-800/60 rounded-lg">
          <div className="flex flex-col items-center mb-3 md:mb-0">
            <img
              src={selectedMatch.teams.home.logo}
              alt={selectedMatch.teams.home.name}
              className="w-16 h-16 mb-2"
            />
            <span className="font-medium text-lg">
              {selectedMatch.teams.home.name}
            </span>
            <span className="text-sm text-gray-400">
              {selectedMatch.teams.home.code}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-neon-green font-bold mb-1">VS</div>
            <div className="text-xs text-gray-400 mb-1">
              {selectedMatch.venue}
            </div>
            <div className="text-xs bg-neon-green/20 text-neon-green px-2 py-1 rounded-full">
              {selectedMatch.tournament.name}
            </div>
          </div>

          <div className="flex flex-col items-center mt-3 md:mt-0">
            <img
              src={selectedMatch.teams.away.logo}
              alt={selectedMatch.teams.away.name}
              className="w-16 h-16 mb-2"
            />
            <span className="font-medium text-lg">
              {selectedMatch.teams.away.name}
            </span>
            <span className="text-sm text-gray-400">
              {selectedMatch.teams.away.code}
            </span>
          </div>
        </div>
      </div>

      {/* Team name and progress */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-bold text-xl">Create Your Team</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTeamPreview(!showTeamPreview)}
            className="text-neon-green"
          >
            {showTeamPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>

        <div className="mb-4">
          <Input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="bg-gray-800/50 border-neon-green/30 focus:border-neon-green/70"
            placeholder="Team Name"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">Team Progress</span>
            <span
              className={`${
                currentPlayers === TEAM_CONSTRAINTS.MAX_PLAYERS
                  ? "text-neon-green"
                  : "text-gray-300"
              }`}
            >
              {currentPlayers}/{TEAM_CONSTRAINTS.MAX_PLAYERS} Players
            </span>
          </div>

          <Progress
            value={(currentPlayers / TEAM_CONSTRAINTS.MAX_PLAYERS) * 100}
            className="h-2 bg-gray-800"
          />
        </div>

        {/* Team balance summary */}
        <div className="flex justify-between mt-4 text-sm">
          {teamBalanceSummary.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-gray-400">{item.label}</div>
              <div
                className={
                  item.status === "valid" ? "text-neon-green" : "text-gray-300"
                }
              >
                {item.current}/{item.min}+
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show team preview when toggle is enabled */}
      <AnimatePresence>
        {showTeamPreview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4">
              <h2 className="font-semibold mb-3">Team Preview</h2>

              {selectedPlayers.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No players selected yet</p>
                  <p className="text-sm">Start building your team below</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Group players by position */}
                  {["Batsman", "All-rounder", "Bowler"].map((position) => {
                    const positionPlayers = selectedPlayers.filter(
                      (p) => p.position === position
                    );
                    if (positionPlayers.length === 0) return null;

                    return (
                      <div key={position} className="space-y-2">
                        <h3 className="text-sm text-gray-400">
                          {position}s ({positionPlayers.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {positionPlayers.map((player) => (
                            <div
                              key={player.id}
                              className={`bg-gray-800/60 rounded-lg p-2 flex items-center gap-2 relative ${
                                captain?.id === player.id
                                  ? "border border-neon-green"
                                  : viceCaptain?.id === player.id
                                  ? "border border-amber-400"
                                  : ""
                              }`}
                            >
                              {player.image ? (
                                <img
                                  src={player.image}
                                  alt={player.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                  <User className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                              <div className="overflow-hidden">
                                <div className="font-medium truncate">
                                  {player.name}
                                </div>
                                <div className="text-xs text-gray-400 truncate">
                                  {player.team}
                                </div>
                              </div>

                              {captain?.id === player.id && (
                                <Badge className="absolute top-0 right-0 bg-neon-green text-black">
                                  C
                                </Badge>
                              )}
                              {viceCaptain?.id === player.id && (
                                <Badge className="absolute top-0 right-0 bg-amber-400 text-black">
                                  VC
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and filter section */}
      <div className="mb-4 relative">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              className="pl-9 bg-gray-900/70"
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setSearchQuery("")}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setFilterExpanded(!filterExpanded)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <AnimatePresence>
          {filterExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-900/80 rounded-lg mt-2 p-3">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">
                      Sort By
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant={sortBy === "points" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("points")}
                        className={
                          sortBy === "points"
                            ? "bg-neon-green text-gray-900"
                            : ""
                        }
                      >
                        Points
                      </Button>
                      <Button
                        variant={sortBy === "name" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("name")}
                        className={
                          sortBy === "name" ? "bg-neon-green text-gray-900" : ""
                        }
                      >
                        Name
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tab navigation */}
      <div className="mb-4">
        <Tabs
          tabs={["All Players", "Batsmen", "Bowlers", "All-rounders"]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Team tabs for dual selection */}
      <div className="mb-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-1">
          <Button
            variant={activeTeamTab === "home" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTeamTab("home")}
            className={
              activeTeamTab === "home" ? "bg-neon-green text-black" : ""
            }
          >
            <img
              src={selectedMatch.teams.home.logo}
              alt={selectedMatch.teams.home.name}
              className="w-5 h-5 mr-1"
            />
            {selectedMatch.teams.home.code}
          </Button>
          <Button
            variant={activeTeamTab === "away" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTeamTab("away")}
            className={
              activeTeamTab === "away" ? "bg-neon-green text-black" : ""
            }
          >
            <img
              src={selectedMatch.teams.away.logo}
              alt={selectedMatch.teams.away.name}
              className="w-5 h-5 mr-1"
            />
            {selectedMatch.teams.away.code}
          </Button>
        </div>
      </div>

      {/* Player selection section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Select Players</h2>
          {selectedPlayers.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelections}
              className="text-red-400 hover:text-red-300"
            >
              Clear All
            </Button>
          )}
        </div>

        {activeTeamTab === "home" ? (
          /* Home Team Players */
          <div className="bg-gray-900/80 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <img
                src={selectedMatch.teams.home.logo}
                alt={selectedMatch.teams.home.name}
                className="w-6 h-6"
              />
              <h3 className="font-medium">{selectedMatch.teams.home.name}</h3>
              <Badge variant="outline" className="ml-auto">
                11 Players
              </Badge>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {homeTeamFilteredPlayers.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  <p>No players match the filter</p>
                </div>
              ) : (
                homeTeamFilteredPlayers.map((player) => {
                  const isSelected = selectedPlayers.some(
                    (p) => p.id === player.id
                  );
                  const isCaptain = captain?.id === player.id;
                  const isViceCaptain = viceCaptain?.id === player.id;
                  const constraintError = !isSelected
                    ? wouldViolateTeamConstraints(player)
                    : null;

                  return (
                    <div
                      key={player.id}
                      className={`bg-gray-800/60 rounded-lg p-2 transition-all ${
                        isSelected
                          ? "border border-neon-green/50"
                          : constraintError
                          ? "opacity-50"
                          : "border border-transparent hover:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="relative">
                            {player.image ? (
                              <img
                                src={player.image}
                                alt={player.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            {isCaptain && (
                              <div className="absolute -top-1 -right-1 bg-neon-green text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                C
                              </div>
                            )}
                            {isViceCaptain && (
                              <div className="absolute -top-1 -right-1 bg-amber-400 text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                VC
                              </div>
                            )}
                          </div>

                          <div className="overflow-hidden">
                            <div className="font-medium text-sm truncate">
                              {player.name}
                            </div>
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                              <span className="truncate">
                                {player.position}
                              </span>
                              <span className="text-gray-600">•</span>
                              <span className="text-xs text-neon-green">
                                {((player.points || 0) / 100).toFixed(1)} Cr
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex ml-1">
                          {isSelected ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-full text-red-400 border-red-400/30 hover:bg-red-500/10"
                              onClick={() => handlePlayerSelection(player)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className={`h-7 w-7 p-0 rounded-full ${
                                constraintError
                                  ? "text-gray-500 border-gray-700"
                                  : "text-neon-green border-neon-green/30"
                              }`}
                              onClick={() =>
                                !constraintError &&
                                handlePlayerSelection(player)
                              }
                              disabled={!!constraintError}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex gap-1 mt-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`rounded-full ${
                              isCaptain
                                ? "bg-neon-green text-black"
                                : "bg-gray-700 text-gray-300"
                            } px-2 h-6 text-xs`}
                            onClick={() => handleCaptainSelection(player)}
                          >
                            Captain
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`rounded-full ${
                              isViceCaptain
                                ? "bg-amber-400 text-black"
                                : "bg-gray-700 text-gray-300"
                            } px-2 h-6 text-xs`}
                            onClick={() => handleViceCaptainSelection(player)}
                          >
                            Vice Captain
                          </Button>
                        </div>
                      )}

                      {constraintError && (
                        <div className="mt-1 text-xs text-amber-400 flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          <span className="truncate">{constraintError}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* Away Team Players */
          <div className="bg-gray-900/80 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <img
                src={selectedMatch.teams.away.logo}
                alt={selectedMatch.teams.away.name}
                className="w-6 h-6"
              />
              <h3 className="font-medium">{selectedMatch.teams.away.name}</h3>
              <Badge variant="outline" className="ml-auto">
                11 Players
              </Badge>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {awayTeamFilteredPlayers.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  <p>No players match the filter</p>
                </div>
              ) : (
                awayTeamFilteredPlayers.map((player) => {
                  const isSelected = selectedPlayers.some(
                    (p) => p.id === player.id
                  );
                  const isCaptain = captain?.id === player.id;
                  const isViceCaptain = viceCaptain?.id === player.id;
                  const constraintError = !isSelected
                    ? wouldViolateTeamConstraints(player)
                    : null;

                  return (
                    <div
                      key={player.id}
                      className={`bg-gray-800/60 rounded-lg p-2 transition-all ${
                        isSelected
                          ? "border border-neon-green/50"
                          : constraintError
                          ? "opacity-50"
                          : "border border-transparent hover:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="relative">
                            {player.image ? (
                              <img
                                src={player.image}
                                alt={player.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            {isCaptain && (
                              <div className="absolute -top-1 -right-1 bg-neon-green text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                C
                              </div>
                            )}
                            {isViceCaptain && (
                              <div className="absolute -top-1 -right-1 bg-amber-400 text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                VC
                              </div>
                            )}
                          </div>

                          <div className="overflow-hidden">
                            <div className="font-medium text-sm truncate">
                              {player.name}
                            </div>
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                              <span className="truncate">
                                {player.position}
                              </span>
                              <span className="text-gray-600">•</span>
                              <span className="text-xs text-neon-green">
                                {((player.points || 0) / 100).toFixed(1)} Cr
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex ml-1">
                          {isSelected ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-full text-red-400 border-red-400/30 hover:bg-red-500/10"
                              onClick={() => handlePlayerSelection(player)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className={`h-7 w-7 p-0 rounded-full ${
                                constraintError
                                  ? "text-gray-500 border-gray-700"
                                  : "text-neon-green border-neon-green/30"
                              }`}
                              onClick={() =>
                                !constraintError &&
                                handlePlayerSelection(player)
                              }
                              disabled={!!constraintError}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex gap-1 mt-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`rounded-full ${
                              isCaptain
                                ? "bg-neon-green text-black"
                                : "bg-gray-700 text-gray-300"
                            } px-2 h-6 text-xs`}
                            onClick={() => handleCaptainSelection(player)}
                          >
                            Captain
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`rounded-full ${
                              isViceCaptain
                                ? "bg-amber-400 text-black"
                                : "bg-gray-700 text-gray-300"
                            } px-2 h-6 text-xs`}
                            onClick={() => handleViceCaptainSelection(player)}
                          >
                            Vice Captain
                          </Button>
                        </div>
                      )}

                      {constraintError && (
                        <div className="mt-1 text-xs text-amber-400 flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          <span className="truncate">{constraintError}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Team validation errors */}
      {teamValidationError && (
        <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-3 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <p className="text-sm text-red-400">{teamValidationError}</p>
        </div>
      )}

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-md border-t border-gray-800 p-4 z-40">
        <div className="container max-w-md mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Selected</p>
            <p className="font-bold text-neon-green">
              {selectedPlayers.length}/{TEAM_CONSTRAINTS.MAX_PLAYERS} Players
            </p>
          </div>

          <Button
            onClick={handleCreateTeam}
            className="bg-neon-green hover:bg-neon-green/90 text-gray-900 font-semibold px-6"
            disabled={selectedPlayers.length === 0 || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Create Team"
            )}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default CreateTeam;
