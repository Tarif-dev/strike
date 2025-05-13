import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Users,
  AlertTriangle,
  Zap,
  Trophy,
  Crown,
  User,
  Filter,
  X,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Shield,
  Loader2,
  FileKey,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import InitialsAvatar from "@/components/common/InitialsAvatar";
import { useSupabaseMatch } from "@/hooks/useSupabaseMatch";
import ZkCompressionTeamCreator from "@/components/common/ZkCompressionTeamCreator";
import ZkCompressionPlayerBadge from "@/components/common/ZkCompressionPlayerBadge";
import MagicBlockTeamCreator from "@/components/common/MagicBlockTeamCreator";
import CompactTechFeatureCards from "@/components/common/CompactTechFeatureCards";

// Components
import PageContainer from "@/components/layout/PageContainer";
import PlayerCard, { PlayerData } from "@/components/cricket/PlayerCard";
import EnhancedPlayerCard from "@/components/cricket/EnhancedPlayerCard";
import { Tabs } from "@/components/ui/tab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// External libraries
import axios from "axios";

// Define country flags directly to avoid dependency on mockData
const countryFlags = {
  india: "🇮🇳",
  australia: "🇦🇺",
  england: "🇬🇧",
  southAfrica: "🇿🇦",
  westIndies: "🏝️",
  newZealand: "🇳🇿",
  pakistan: "🇵🇰",
  sriLanka: "🇱🇰",
  afghanistan: "🇦🇫",
  bangladesh: "🇧🇩",
  ireland: "🇮🇪",
  scotland: "🇬🇧",
  uae: "🇦🇪",
  zimbabwe: "🇿🇼",
  netherlands: "🇳🇱",
  generic: "🏏",
};

// Cricbuzz API types
import {
  CricbuzzResponse,
  PlayerDetail,
  FantasyPlayer,
  PlayerRole,
  SelectedPlayer,
  Team,
} from "@/types/cricbuzz";
import { get } from "http";

// Team balance constraints
const TEAM_CONSTRAINTS = {
  MAX_PLAYERS: 11,
  MIN_BATSMEN: 3,
  MIN_BOWLERS: 3,
  MIN_ALL_ROUNDERS: 1,
  MAX_FROM_TEAM: 7,
};

// Helper function to map player role from API to our enum
const mapPlayerRole = (
  role: string | undefined,
  keeper: boolean
): PlayerRole => {
  if (keeper) {
    return PlayerRole.WICKET_KEEPER;
  }
  if (!role) {
    return PlayerRole.BATSMAN; // Default to batsman if role is undefined
  }

  const roleUpper = role.toUpperCase();
  if (roleUpper.includes("ALLROUNDER") || roleUpper.includes("ROUND")) {
    return PlayerRole.ALL_ROUNDER;
  }
  if (roleUpper.includes("BAT")) {
    return PlayerRole.BATSMAN;
  }
  if (roleUpper.includes("BOWL")) {
    return PlayerRole.BOWLER;
  }

  return PlayerRole.BATSMAN; // Default fallback
};

// Convert PlayerRole enum to the display position
const getPositionFromRole = (role: PlayerRole): string => {
  switch (role) {
    case PlayerRole.WICKET_KEEPER:
      return "Batsman"; // WK is also a batsman in our UI
    case PlayerRole.BATSMAN:
      return "Batsman";
    case PlayerRole.BOWLER:
      return "Bowler";
    case PlayerRole.ALL_ROUNDER:
      return "All-rounder";
    default:
      return "Batsman";
  }
};

// Generate random points for players based on their role and captain status
const generatePlayerPoints = (
  role: PlayerRole,
  isCaptain: boolean = false
): number => {
  // Base points by role
  let basePoints = 0;
  switch (role) {
    case PlayerRole.WICKET_KEEPER:
      basePoints = Math.floor(Math.random() * 200) + 700; // 700-900
      break;
    case PlayerRole.BATSMAN:
      basePoints = Math.floor(Math.random() * 200) + 600; // 600-800
      break;
    case PlayerRole.BOWLER:
      basePoints = Math.floor(Math.random() * 200) + 550; // 550-750
      break;
    case PlayerRole.ALL_ROUNDER:
      basePoints = Math.floor(Math.random() * 200) + 650; // 650-850
      break;
    default:
      basePoints = Math.floor(Math.random() * 200) + 600; // 600-800
  }

  // Apply captain bonus (10% extra points)
  if (isCaptain) {
    basePoints = Math.floor(basePoints * 1.1);
  }

  return basePoints;
};

const CreateTeam = () => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get("match");
  const {
    match: supabaseMatch,
    loading: matchLoading,
    error: matchError,
  } = useSupabaseMatch(matchId);

  // States for Cricbuzz API data
  const [cricbuzzData, setCricbuzzData] = useState<CricbuzzResponse | null>(
    null
  );
  const [loadingCricbuzzData, setLoadingCricbuzzData] = useState<boolean>(true);
  const [cricbuzzError, setCricbuzzError] = useState<string | null>(null);

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
  const [apiError, setApiError] = useState<string | null>(null);

  // Helper for consistent team logo paths
  const getTeamLogoPath = useCallback((teamCode: string): string => {
    // Make sure we have a valid team code
    if (!teamCode) return "/team_logos/tbd.jpeg";

    // Normalize team code to lowercase
    const normalizedCode = teamCode.toLowerCase();

    // Check if file exists, otherwise fallback
    return `/team_logos/${normalizedCode}.jpeg`;
  }, []);

  // Function to get player image URL with fallback
  const getPlayerImageUrl = useCallback(
    (playerId: number, faceImageId: number | undefined) => {
      // First try to find a local image (mostly for famous players)
      const knownPlayerImages: Record<string, string> = {
        "1413": "/players/virat_kohli.jpg",
        "265": "/players/ms_dhoni.jpg",
        "969": "/players/jasprit_bumrah.jpg",
        "509": "/players/rashid_khan.jpg",
        "1446": "/players/rishabh_pant.jpg",
        "1706": "/players/jos_buttler.jpg",
        // Add more known players as needed
      };

      // Check if we have a local image for this player
      if (knownPlayerImages[playerId.toString()]) {
        return knownPlayerImages[playerId.toString()];
      }

      // Otherwise, try to use the Cricbuzz image if we have a faceImageId

      // Fallback to placeholder
      return "/placeholder.svg";
    },
    []
  );

  // States for team players
  const [homeTeamPlayers, setHomeTeamPlayers] = useState<PlayerData[]>([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState<PlayerData[]>([]);
  const [activeTeamTab, setActiveTeamTab] = useState<"home" | "away">("home");

  // Function to fetch data from Cricbuzz API
  const getTeamInfo = useCallback(async () => {
    if (!matchId) return;

    setLoadingCricbuzzData(true);
    try {
      const options = {
        method: "GET",
        url: `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}`,
        headers: {
          "x-rapidapi-key":
            "bee2da4a33msh54fad7b338b78d2p19ea73jsndd8333ad3725",
          "x-rapidapi-host": "cricbuzz-cricket.p.rapidapi.com",
        },
      };
      const response = await axios.request(options);
      console.log("Cricbuzz API response:", response.data);
      setCricbuzzData(response.data);
      setLoadingCricbuzzData(false);
    } catch (error) {
      console.error("Error fetching Cricbuzz data:", error);
      setCricbuzzError(
        error instanceof Error ? error.message : "Failed to fetch match data"
      );
      setLoadingCricbuzzData(false);
    }
  }, [matchId]); // Add matchId as a dependency

  // Process Cricbuzz API data and convert to PlayerData format
  const processMatchData = useCallback(
    (data: CricbuzzResponse) => {
      if (!data || !data.matchInfo) {
        console.error("Invalid match info data");
        setApiError("Missing match information data");
        return;
      }

      try {
        const team1 = data.matchInfo.team1;
        const team2 = data.matchInfo.team2;
        const venueInfo = data.venueInfo;

        console.log(
          `Processing team data: ${team1.name} vs ${team2.name} at ${venueInfo.ground}`
        );

        // Convert team 1 players to our format - filter out substitutes
        const team1Players: PlayerData[] = team1.playerDetails.map((player) => {
          const playerRole = mapPlayerRole(player.role, player.keeper);
          const points = generatePlayerPoints(playerRole, player.captain);

          return {
            id: player.id.toString(),
            name: player.name,
            fullName: player.fullName || player.name,
            team: team1.name,
            teamLogo: getTeamLogoPath(team1.shortName),
            position: getPositionFromRole(playerRole),
            captain: player.captain,
            wicketkeeper: player.keeper,
            country: "International", // Default
            countryFlag: countryFlags.india, // Default
            stats: {
              matches: 0,
              battingStyle: player.battingStyle || "Unknown",
              bowlingStyle: player.bowlingStyle || "N/A",
              role: player.role || getPositionFromRole(playerRole),
            },
            playerImageUrl: getPlayerImageUrl(player.id, player.faceImageId),
            points: points,
            selected: false,
          };
        });

        // Convert team 2 players to our format - filter out substitutes
        const team2Players: PlayerData[] = team2.playerDetails.map((player) => {
          const playerRole = mapPlayerRole(player.role, player.keeper);
          const points = generatePlayerPoints(playerRole, player.captain);

          return {
            id: player.id.toString(),
            name: player.name,
            fullName: player.fullName || player.name,
            team: team2.name,
            teamLogo: getTeamLogoPath(team2.shortName),
            position: getPositionFromRole(playerRole),
            captain: player.captain,
            wicketkeeper: player.keeper,
            country: "International", // Default
            countryFlag: countryFlags.india, // Default
            stats: {
              matches: 0,
              battingStyle: player.battingStyle || "Unknown",
              bowlingStyle: player.bowlingStyle || "N/A",
              role: player.role || getPositionFromRole(playerRole),
            },
            playerImageUrl: getPlayerImageUrl(player.id, player.faceImageId),
            points: points,
            selected: false,
          };
        });

        console.log(
          `Processed ${team1Players.length} players for ${team1.name}`
        );
        console.log(
          `Processed ${team2Players.length} players for ${team2.name}`
        );

        // Update state with the processed player data
        setHomeTeamPlayers(team1Players);
        setAwayTeamPlayers(team2Players);
        setApiError(null);
      } catch (error) {
        console.error("Error processing match data:", error);
        // Fallback to mock data or display an error
        setApiError(
          error instanceof Error ? error.message : "Error processing match data"
        );
        toast({
          title: "Error Processing Match Data",
          description:
            "There was an error processing the match data. Using fallback data.",
          variant: "destructive",
        });
        // You could set fallback data here if needed
      }
    },
    [toast, getPlayerImageUrl, getTeamLogoPath]
  );

  // Effect to fetch Cricbuzz API data
  useEffect(() => {
    getTeamInfo();
  }, [getTeamInfo]); // Add getTeamInfo as a dependency

  // Effect to process Cricbuzz data when it changes
  useEffect(() => {
    if (cricbuzzData) {
      processMatchData(cricbuzzData);
    }
  }, [cricbuzzData, processMatchData]);

  // Derived states for player categories
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

  // Validate if team meets all requirements
  const validateTeam = useCallback(() => {
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
  }, [
    selectedPlayers.length,
    currentBatsmen,
    currentBowlers,
    currentAllRounders,
    captain,
    viceCaptain,
  ]);

  // Effect to validate team when selections change
  useEffect(() => {
    validateTeam();
  }, [validateTeam]);

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

  // Initialize team players from Supabase match if no Cricbuzz data
  useEffect(() => {
    if (!supabaseMatch || cricbuzzData) return;

    // Get team names and codes from the selected match
    const homeTeamName = supabaseMatch.teams.home.name;
    const homeTeamCode = supabaseMatch.teams.home.code;
    const awayTeamName = supabaseMatch.teams.away.name;
    const awayTeamCode = supabaseMatch.teams.away.code;

    console.log(
      "No Cricbuzz data available - creating default players for teams:",
      homeTeamName,
      awayTeamName
    );

    // Create default players for both teams
    const defaultHomePlayers = createDefaultPlayers(
      homeTeamName,
      homeTeamCode,
      supabaseMatch.teams.home.logo
    );
    setHomeTeamPlayers(defaultHomePlayers);

    const defaultAwayPlayers = createDefaultPlayers(
      awayTeamName,
      awayTeamCode,
      supabaseMatch.teams.away.logo
    );
    setAwayTeamPlayers(defaultAwayPlayers);

    // Display a toast notification to inform user about using generated data
    toast({
      title: "Using Generated Player Data",
      description:
        "Couldn't retrieve player data from Cricbuzz API. Using generated player data instead.",
      variant: "default",
    });
  }, [supabaseMatch, cricbuzzData, toast]);

  // Helper function to create default players if none are found
  const createDefaultPlayers = (
    teamName: string,
    teamCode: string,
    teamLogo: string
  ): PlayerData[] => {
    const positions = ["Batsman", "Bowler", "All-rounder"];
    const defaultPlayers: PlayerData[] = [];

    // Number of players to create for each position
    const playerCounts = {
      Batsman: 5,
      Bowler: 4,
      "All-rounder": 2,
    };

    // Player name templates
    const firstNames = [
      "Alex",
      "Chris",
      "Sam",
      "Jordan",
      "Taylor",
      "Morgan",
      "Riley",
      "Jamie",
      "Casey",
      "Drew",
      "Quinn",
      "Max",
      "Rowan",
      "Blake",
      "Avery",
      "Cameron",
    ];

    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Patel",
      "Kumar",
      "Singh",
      "Khan",
      "Ali",
      "Brown",
      "Davis",
      "Wilson",
      "Anderson",
      "Thompson",
      "Mitchell",
      "Watson",
      "Lee",
    ];

    // Get a random name that will be consistent for the same team and position
    const getPlayerName = (
      teamCode: string,
      position: string,
      index: number
    ): { name: string; fullName: string } => {
      const firstNameIndex =
        (teamCode.charCodeAt(0) + position.charCodeAt(0) + index) %
        firstNames.length;
      const lastNameIndex =
        (teamCode.charCodeAt(1) + position.charCodeAt(1) + index) %
        lastNames.length;

      const firstName = firstNames[firstNameIndex];
      const lastName = lastNames[lastNameIndex];

      return {
        name: `${firstName} ${lastName.charAt(0)}.`,
        fullName: `${firstName} ${lastName}`,
      };
    };

    // Generate players for each position
    for (const position of positions) {
      const count = playerCounts[position as keyof typeof playerCounts];

      for (let i = 1; i <= count; i++) {
        const playerId = `${teamCode.toLowerCase()}-${position.toLowerCase()}-${i}`;
        const playerNameInfo = getPlayerName(teamCode, position, i);

        // Create a player with default stats based on position
        const player: PlayerData = {
          id: playerId,
          name: playerNameInfo.name,
          fullName: playerNameInfo.fullName,
          team: teamName,
          teamLogo: teamLogo || `/team_logos/${teamCode.toLowerCase()}.jpeg`,
          position: position,
          country: "International",
          countryFlag: countryFlags.generic,
          stats: {
            matches: Math.floor(Math.random() * 40) + 20,
            role: position,
            battingStyle:
              position === "Batsman" ? "Right Handed Bat" : "Right Handed Bat",
            bowlingStyle:
              position === "Bowler"
                ? "Right Arm Fast"
                : position === "All-rounder"
                  ? "Right Arm Medium"
                  : "N/A",
          },
          points: generatePlayerPoints(
            position === "Batsman"
              ? PlayerRole.BATSMAN
              : position === "Bowler"
                ? PlayerRole.BOWLER
                : PlayerRole.ALL_ROUNDER
          ),
          selected: false,
          playerImageUrl: "/placeholder.svg",
        };

        // Add batting stats for batsmen and all-rounders
        if (position === "Batsman" || position === "All-rounder") {
          player.stats.runs =
            Math.floor(Math.random() * (position === "Batsman" ? 2000 : 1000)) +
            500;
          player.stats.average = Math.floor(Math.random() * 15) + 30;
          player.stats.strikeRate = Math.floor(Math.random() * 20) + 130;
        }

        // Add bowling stats for bowlers and all-rounders
        if (position === "Bowler" || position === "All-rounder") {
          player.stats.wickets =
            Math.floor(Math.random() * (position === "Bowler" ? 80 : 50)) + 20;
          player.stats.economy =
            Math.random() * (position === "Bowler" ? 2 : 1.5) + 7;
        }

        // Randomly add a wicketkeeper (only to batsmen)
        if (position === "Batsman" && i === 1) {
          player.wicketkeeper = true;
        }

        // Randomly add a captain (usually a batsman or all-rounder)
        if (
          (position === "Batsman" && i === 2) ||
          (position === "All-rounder" && i === 1)
        ) {
          player.captain = true;
        }

        defaultPlayers.push(player);
      }
    }

    return defaultPlayers;
  };

  // Filter players based on active tab, role and search query
  const homeTeamFilteredPlayers = homeTeamPlayers.filter((player) => {
    // Don't filter players in "All Players" tab
    if (activeTab === "All Players") {
      // just apply search if present
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          player.name?.toLowerCase().includes(query) ||
          player.fullName?.toLowerCase().includes(query) ||
          player.stats?.role?.toLowerCase().includes(query) ||
          player.stats?.battingStyle?.toLowerCase().includes(query) ||
          player.team?.toLowerCase().includes(query)
        );
      }
      return true;
    }

    // Filter by position/role
    if (activeTab === "Batsmen" && player.position !== "Batsman") return false;
    if (activeTab === "Bowlers" && player.position !== "Bowler") return false;
    if (activeTab === "All-rounders" && player.position !== "All-rounder")
      return false;

    // Filter by search query if present
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      return (
        player.name?.toLowerCase().includes(query) ||
        player.fullName?.toLowerCase().includes(query) ||
        player.stats?.role?.toLowerCase().includes(query) ||
        player.stats?.battingStyle?.toLowerCase().includes(query) ||
        player.team?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const awayTeamFilteredPlayers = awayTeamPlayers.filter((player) => {
    // Don't filter players in "All Players" tab
    if (activeTab === "All Players") {
      // just apply search if present
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          player.name?.toLowerCase().includes(query) ||
          player.fullName?.toLowerCase().includes(query) ||
          player.stats?.role?.toLowerCase().includes(query) ||
          player.stats?.battingStyle?.toLowerCase().includes(query) ||
          player.team?.toLowerCase().includes(query)
        );
      }
      return true;
    }

    // Filter by position/role
    if (activeTab === "Batsmen" && player.position !== "Batsman") return false;
    if (activeTab === "Bowlers" && player.position !== "Bowler") return false;
    if (activeTab === "All-rounders" && player.position !== "All-rounder")
      return false;

    // Filter by search query if present
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      return (
        player.name?.toLowerCase().includes(query) ||
        player.fullName?.toLowerCase().includes(query) ||
        player.stats?.role?.toLowerCase().includes(query) ||
        player.stats?.battingStyle?.toLowerCase().includes(query) ||
        player.team?.toLowerCase().includes(query)
      );
    }

    return true;
  });

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

    // Get match info for database - prefer Cricbuzz data if available
    const matchDetails = cricbuzzData
      ? {
          match_id: String(cricbuzzData.matchInfo.matchId),
          tournament: cricbuzzData.matchInfo.series.name,
          venue: cricbuzzData.venueInfo.ground,
          date: new Date(
            cricbuzzData.matchInfo.matchStartTimestamp
          ).toISOString(),
          match_format: cricbuzzData.matchInfo.matchFormat,
          city: cricbuzzData.venueInfo.city,
          country: cricbuzzData.venueInfo.country,
          teams: {
            home: {
              id: String(cricbuzzData.matchInfo.team1.id),
              name: cricbuzzData.matchInfo.team1.name,
              code: cricbuzzData.matchInfo.team1.shortName,
              logo: getTeamLogoPath(cricbuzzData.matchInfo.team1.shortName),
              players_count: cricbuzzData.matchInfo.team1.playerDetails.length,
            },
            away: {
              id: String(cricbuzzData.matchInfo.team2.id),
              name: cricbuzzData.matchInfo.team2.name,
              code: cricbuzzData.matchInfo.team2.shortName,
              logo: getTeamLogoPath(cricbuzzData.matchInfo.team2.shortName),
              players_count: cricbuzzData.matchInfo.team2.playerDetails.length,
            },
          },
          toss_winner: cricbuzzData.matchInfo.state?.includes("won the toss")
            ? cricbuzzData.matchInfo.state.split(" won the toss")[0]
            : null,
          toss_decision: cricbuzzData.matchInfo.state?.includes("elected to")
            ? cricbuzzData.matchInfo.state.includes("bat")
              ? "bat"
              : "bowl"
            : null,
          status: cricbuzzData.matchInfo.status,
        }
      : supabaseMatch
        ? {
            match_id: String(supabaseMatch.id),
            tournament: supabaseMatch.tournament.name,
            venue: supabaseMatch.venue,
            date: supabaseMatch.startTime,
            teams: {
              home: {
                name: supabaseMatch.teams.home.name,
                code: supabaseMatch.teams.home.code,
                logo: supabaseMatch.teams.home.logo,
              },
              away: {
                name: supabaseMatch.teams.away.name,
                code: supabaseMatch.teams.away.code,
                logo: supabaseMatch.teams.away.logo,
              },
            },
          }
        : null;

    if (!matchDetails) {
      toast({
        title: "Match Info Missing",
        description: "Unable to find match details. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Start saving process
      setIsSaving(true);

      // Show a loading toast
      toast({
        title: "Creating Team",
        description: "Saving your team to the database...",
        variant: "default",
      });

      console.log("Creating team with user:", user.id);

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

      console.log("Sanitized players:", sanitizedPlayers);

      // Create team object to store in database
      const teamData = {
        user_id: user.id,
        team_name: teamName,
        match_id: matchDetails.match_id,
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
  const getInitials = (name: string) => {
    const names = name.split(" ");
    let result = "";
    for (let i = 0; i < names.length; i++) {
      result += names[i][0].toLowerCase();
    }
    return result;
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

  // Determine which match info to display (Cricbuzz or Supabase)
  const activeMatchInfo = cricbuzzData
    ? {
        teams: {
          home: {
            name: cricbuzzData.matchInfo.team1.name,
            code: cricbuzzData.matchInfo.team1.shortName,
            logo: getTeamLogoPath(cricbuzzData.matchInfo.team1.shortName),
          },
          away: {
            name: cricbuzzData.matchInfo.team2.name,
            code: cricbuzzData.matchInfo.team2.shortName,
            logo: getTeamLogoPath(cricbuzzData.matchInfo.team2.shortName),
          },
        },
        venue: cricbuzzData.venueInfo.ground,
        tournament: {
          name: cricbuzzData.matchInfo.series.name,
        },
      }
    : supabaseMatch;

  // Enhanced player data display with improved styling
  const PlayerDataDisplay = ({ player }: { player: PlayerData }) => {
    return (
      <div className="overflow-hidden">
        <div className="font-medium text-sm truncate">{player.name}</div>
        {player.fullName && player.fullName !== player.name && (
          <div className="text-xs text-gray-500 truncate">
            {player.fullName}
          </div>
        )}
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <span className="truncate">{player.position}</span>
          <span className="text-gray-600">•</span>
          <span className="text-xs text-neon-green">
            {((player.points || 0) / 100).toFixed(1)} Cr
          </span>
        </div>
        {player.stats?.battingStyle && (
          <div className="text-xs text-gray-500 mt-1">
            Batting:{" "}
            <span className="text-gray-400">{player.stats.battingStyle}</span>
            {player.stats.bowlingStyle &&
              player.stats.bowlingStyle !== "N/A" && (
                <span className="ml-1">
                  • Bowl:{" "}
                  <span className="text-gray-400">
                    {player.stats.bowlingStyle}
                  </span>
                </span>
              )}
          </div>
        )}
        {player.captain && (
          <div className="text-xs text-amber-400 mt-0.5">Team Captain</div>
        )}
        {player.wicketkeeper && (
          <div className="text-xs text-blue-400 mt-0.5">Wicketkeeper</div>
        )}
      </div>
    );
  };

  return (
    <PageContainer className="pb-24 pt-4 relative">
      {/* Tech features showcase */}
      <div className="mb-6">
        <CompactTechFeatureCards />
      </div>

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

      {/* ZK Compression Team Creator */}
      <div className="mb-4">
        <ZkCompressionTeamCreator
          teamSize={selectedPlayers.length}
          maxCapacity={TEAM_CONSTRAINTS.MAX_PLAYERS}
        />
      </div>

      {/* MagicBlock Team Creator */}
      <div className="mb-6">
        <MagicBlockTeamCreator
          teamSize={selectedPlayers.length}
          maxCapacity={TEAM_CONSTRAINTS.MAX_PLAYERS}
        />
      </div>

      {/* Match selection - Moved to top */}
      <div className="mb-6 bg-gray-900/80 backdrop-blur-sm rounded-xl p-4">
        <h2 className="font-semibold mb-3 text-lg">Match</h2>
        {matchLoading || loadingCricbuzzData ? (
          <div className="text-center py-6 text-gray-400">
            <Loader2 className="w-6 h-6 mx-auto animate-spin" />
            <p>Loading match details...</p>
          </div>
        ) : cricbuzzError ? (
          <div className="text-center py-6 text-red-400">
            <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
            <p>Failed to load match details</p>
            <p className="text-sm">{matchError || cricbuzzError}</p>
          </div>
        ) : (
          activeMatchInfo && (
            <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-800/60 rounded-lg">
              <div className="flex flex-col items-center mb-3 md:mb-0">
                <img
                  src={
                    activeMatchInfo?.teams?.home?.logo ||
                    getTeamLogoPath(activeMatchInfo?.teams?.home?.code)
                  }
                  alt={activeMatchInfo?.teams?.home?.name}
                  className="w-16 h-16 mb-2"
                  onError={(e) => {
                    e.currentTarget.src = "/team_logos/tbd.jpeg";
                  }}
                />
                <span className="font-medium text-lg">
                  {activeMatchInfo.teams.home.name}
                </span>
                <span className="text-sm text-gray-400">
                  {activeMatchInfo.teams.home.code}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-neon-green font-bold mb-1">VS</div>
                <div className="text-xs text-gray-400 mb-1">
                  {activeMatchInfo.venue}
                </div>
                <div className="text-xs bg-neon-green/20 text-neon-green px-2 py-1 rounded-full">
                  {activeMatchInfo.tournament.name}
                </div>
              </div>

              <div className="flex flex-col items-center mt-3 md:mt-0">
                <img
                  src={
                    activeMatchInfo?.teams?.away?.logo ||
                    getTeamLogoPath(activeMatchInfo?.teams?.away?.code)
                  }
                  alt={activeMatchInfo?.teams?.away?.name}
                  className="w-16 h-16 mb-2"
                  onError={(e) => {
                    e.currentTarget.src = "/team_logos/tbd.jpeg";
                  }}
                />
                <span className="font-medium text-lg">
                  {activeMatchInfo.teams.away.name}
                </span>
                <span className="text-sm text-gray-400">
                  {activeMatchInfo.teams.away.code}
                </span>
              </div>
            </div>
          )
        )}
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
                                <InitialsAvatar name={player.name} size="md" />
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
            <Input
              className="bg-gray-900/70"
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
            {activeMatchInfo && (
              <img
                src={
                  activeMatchInfo?.teams?.home?.logo ||
                  getTeamLogoPath(activeMatchInfo?.teams?.home?.code)
                }
                alt={activeMatchInfo?.teams?.home?.name}
                className="w-5 h-5 mr-1"
                onError={(e) => {
                  e.currentTarget.src = "/team_logos/tbd.jpeg";
                }}
              />
            )}
            {activeMatchInfo?.teams.home.code || "Home"}
          </Button>
          <Button
            variant={activeTeamTab === "away" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTeamTab("away")}
            className={
              activeTeamTab === "away" ? "bg-neon-green text-black" : ""
            }
          >
            {activeMatchInfo && (
              <img
                src={
                  activeMatchInfo?.teams?.away?.logo ||
                  getTeamLogoPath(activeMatchInfo?.teams?.away?.code)
                }
                alt={activeMatchInfo?.teams?.away?.name}
                className="w-5 h-5 mr-1"
                onError={(e) => {
                  e.currentTarget.src = "/team_logos/tbd.jpeg";
                }}
              />
            )}
            {activeMatchInfo?.teams.away.code || "Away"}
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
              {activeMatchInfo && (
                <img
                  src={
                    activeMatchInfo?.teams?.home?.logo ||
                    getTeamLogoPath(activeMatchInfo?.teams?.home?.code)
                  }
                  alt={activeMatchInfo?.teams?.home?.name}
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.src = "/team_logos/tbd.jpeg";
                  }}
                />
              )}
              <h3 className="font-medium">
                {activeMatchInfo?.teams.home.name || "Home Team"}
              </h3>
              <Badge variant="outline" className="ml-auto">
                {homeTeamPlayers.length} Players
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
                              <InitialsAvatar name={player.name} size="md" />
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
              {activeMatchInfo && (
                <img
                  src={
                    activeMatchInfo?.teams?.away?.logo ||
                    getTeamLogoPath(activeMatchInfo?.teams?.away?.code)
                  }
                  alt={activeMatchInfo?.teams?.away?.name}
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.src = "/team_logos/tbd.jpeg";
                  }}
                />
              )}
              <h3 className="font-medium">
                {activeMatchInfo?.teams.away.name || "Away Team"}
              </h3>
              <Badge variant="outline" className="ml-auto">
                {awayTeamPlayers.length} Players
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
                              <InitialsAvatar name={player.name} size="md" />
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
