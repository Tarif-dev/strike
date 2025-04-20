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
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

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
import { players } from "@/data/mockData";

// Team balance constraints
const TEAM_CONSTRAINTS = {
  MAX_PLAYERS: 11,
  MIN_BATSMEN: 3,
  MIN_BOWLERS: 3,
  MIN_ALL_ROUNDERS: 1,
  MAX_FROM_TEAM: 7,
};

const CreateTeam = () => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // States
  const [teamName, setTeamName] = useState("My Fantasy XI");
  const [activeTab, setActiveTab] = useState("All Players");
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
  const handleCreateTeam = () => {
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

    // In a real app, we would submit this to an API
    toast({
      title: "Team Created Successfully!",
      description: `Your team "${teamName}" is ready`,
      variant: "default",
    });

    // Navigate to home or matches page
    setTimeout(() => {
      navigate("/matches");
    }, 1500);
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

      {/* Player selection */}
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

        <div className="space-y-3">
          {filteredPlayers.length === 0 ? (
            <div className="bg-gray-900/80 rounded-xl p-6 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-70" />
              <p>No players found</p>
              <p className="text-sm mt-1">
                Try a different search term or filter
              </p>
            </div>
          ) : (
            filteredPlayers.map((player) => {
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
                  className={`bg-gray-900/80 rounded-xl p-3 transition-all ${
                    isSelected
                      ? "border border-neon-green/50"
                      : constraintError
                      ? "opacity-50"
                      : "border border-transparent hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    {/* Player image and info */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        {player.image ? (
                          <img
                            src={player.image}
                            alt={player.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                        {isCaptain && (
                          <div className="absolute -top-1 -right-1 bg-neon-green text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                            C
                          </div>
                        )}
                        {isViceCaptain && (
                          <div className="absolute -top-1 -right-1 bg-amber-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                            VC
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{player.name}</h3>
                          <img
                            src={player.countryFlag}
                            alt={player.country}
                            className="w-4 h-3"
                          />
                        </div>
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <img
                            src={player.teamLogo}
                            alt={player.team}
                            className="w-4 h-4"
                          />
                          <span>{player.position}</span>
                        </div>
                      </div>
                    </div>

                    {/* Credit points */}
                    <div className="px-3 py-1 rounded-full bg-gray-800/80 mx-2">
                      <span className="text-sm font-medium text-neon-green">
                        {((player.points || 0) / 100).toFixed(1)} Cr
                      </span>
                    </div>

                    {/* Selection and captain buttons */}
                    <div className="flex gap-1">
                      {isSelected ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`rounded-full ${
                              isCaptain
                                ? "bg-neon-green text-black"
                                : "bg-gray-800 text-gray-300"
                            } px-2 min-w-8 h-8`}
                            onClick={() => handleCaptainSelection(player)}
                            title="Captain"
                          >
                            C
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`rounded-full ${
                              isViceCaptain
                                ? "bg-amber-400 text-black"
                                : "bg-gray-800 text-gray-300"
                            } px-2 min-w-8 h-8`}
                            onClick={() => handleViceCaptainSelection(player)}
                            title="Vice Captain"
                          >
                            VC
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full text-red-400 border-red-400/30 hover:bg-red-500/10"
                            onClick={() => handlePlayerSelection(player)}
                            title="Remove Player"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className={`rounded-full ${
                            constraintError
                              ? "text-gray-500 border-gray-700"
                              : "text-neon-green border-neon-green/30 hover:bg-neon-green/10"
                          }`}
                          onClick={() =>
                            !constraintError && handlePlayerSelection(player)
                          }
                          disabled={!!constraintError}
                          title={constraintError || "Add Player"}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Player stats (expandable) */}
                  <div className="mt-2 pl-15">
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs">
                      {player.stats.matches !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Matches</span>
                          <span>{player.stats.matches}</span>
                        </div>
                      )}
                      {player.stats.runs !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Runs</span>
                          <span>{player.stats.runs}</span>
                        </div>
                      )}
                      {player.stats.wickets !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Wickets</span>
                          <span>{player.stats.wickets}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {constraintError && (
                    <div className="mt-2 text-xs text-amber-400 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      <span>{constraintError}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
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
            disabled={selectedPlayers.length === 0}
          >
            Create Team
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default CreateTeam;
