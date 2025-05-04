import {
  Calendar,
  Trophy,
  Users,
  Clock,
  ArrowRight,
  Star,
  Zap,
  AlertCircle,
  Info,
  Plus,
  LineChart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface MatchData {
  id: string;
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
  result?: string;
  scores?: {
    home?: string;
    away?: string;
  };
  fantasy?: {
    contestCount: number;
    prizePool: string;
    entryFees: number[];
    teamsCreated: number;
    percentageJoined: number;
    megaContestPrize?: string;
    isHotMatch?: boolean;
  };
}

interface MatchCardProps {
  match: MatchData;
  showFantasyFeatures?: boolean;
  className?: string;
  featured?: boolean;
}

export default function MatchCard({
  match,
  showFantasyFeatures = false,
  className,
  featured = false,
}: MatchCardProps) {
  const navigate = useNavigate();

  if (
    !match ||
    !match.teams ||
    !match.teams.home ||
    !match.teams.away ||
    !match.tournament
  ) {
    return (
      <Card
        className={cn(
          "overflow-hidden bg-gray-900/80 border-gray-800",
          className
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-center py-8 text-gray-400">
            <AlertCircle className="w-5 h-5 mr-2 opacity-70" />
            <p>Match data unavailable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isLive = match.status === "live";
  const isCompleted = match.status === "completed";
  const isUpcoming = match.status === "upcoming";

  const matchDate = new Date(match.startTime || Date.now());
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  const formattedTime = matchDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const now = new Date();
  const timeUntilMatch = matchDate.getTime() - now.getTime();
  const hoursUntilMatch = Math.floor(timeUntilMatch / (1000 * 60 * 60));
  let timeDisplay = "";

  if (isLive) {
    timeDisplay = "LIVE";
  } else if (isCompleted) {
    timeDisplay = "Completed";
  } else if (hoursUntilMatch < 24) {
    timeDisplay = `${hoursUntilMatch}h left`;
  } else {
    const daysLeft = Math.floor(hoursUntilMatch / 24);
    timeDisplay = `${daysLeft}d left`;
  }

  const fantasyData = match.fantasy || {
    contestCount: Math.floor(Math.random() * 50) + 10,
    prizePool: `${Math.floor(Math.random() * 10) + 1}${
      Math.random() > 0.5 ? "00" : "000"
    } USDC`,
    entryFees: [49, 99, 499, 999],
    teamsCreated: Math.floor(Math.random() * 100000) + 5000,
    percentageJoined: Math.floor(Math.random() * 70) + 20,
    isHotMatch: Math.random() > 0.7,
  };

  // Animation variants for hover effects
  const cardVariants = {
    hover: { y: -5, transition: { duration: 0.2 } },
  };

  return (
    <motion.div whileHover={cardVariants.hover} className={cn(className)}>
      <Card
        className={cn(
          "relative overflow-hidden border transition-colors",
          featured
            ? "border-neon-green/40 bg-gradient-to-br from-gray-900 to-gray-950"
            : "border-gray-800 bg-gray-900/80",
          "backdrop-blur-md"
        )}
      >
        {/* Live status indicator or hot match indicator */}
        {(isLive || match.fantasy?.isHotMatch) && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent" />
        )}

        {/* Tournament & Status Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800/50">
          <div className="flex items-center gap-2">
            {match.fantasy?.isHotMatch && (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-1.5 py-0.5">
                <Zap className="h-3 w-3 mr-1 text-amber-400 fill-amber-400/20" />{" "}
                Hot Match
              </Badge>
            )}
            <span className="text-sm font-medium text-gray-300">
              {match.tournament.name}
            </span>
          </div>

          {/* Status indicator */}
          <div>
            {isLive && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-2">
                <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
                LIVE
              </Badge>
            )}
            {isUpcoming && timeDisplay && (
              <Badge className="bg-gray-800 text-gray-300 border-gray-700">
                <Clock className="w-3 h-3 mr-1.5 text-neon-green" />
                {timeDisplay}
              </Badge>
            )}
            {isCompleted && (
              <Badge className="bg-gray-800 text-gray-400 border-gray-700/50">
                Completed
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="relative">
            {/* VS indicator in the center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-10 h-10 rounded-full bg-gray-800/90 backdrop-blur-sm flex items-center justify-center border border-gray-700/50 shadow-lg">
                <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-blue-400">
                  VS
                </span>
              </div>
            </div>

            {/* Teams Container */}
            <div className="flex items-center justify-between mb-6 relative z-0">
              {/* Home Team */}
              <div className="flex-1">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-800/80 p-0.5 flex items-center justify-center mb-3 shadow-lg">
                    <img
                      src={match.teams.home.logo || `/placeholder.svg`}
                      alt={match.teams.home.name}
                      className="w-12 h-12 object-contain rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-white mb-1 text-center">
                    {match.teams.home.code}
                  </h3>
                  <p className="text-xs text-gray-400 text-center max-w-[100px] truncate">
                    {match.teams.home.name}
                  </p>

                  {/* Score for home team */}
                  {isLive || isCompleted ? (
                    <div className="mt-2 text-center">
                      <span
                        className={cn(
                          "text-sm font-medium px-3 py-1 rounded-full",
                          isLive
                            ? "bg-neon-green/10 text-neon-green"
                            : "bg-gray-800 text-white"
                        )}
                      >
                        {match.scores?.home || "Yet to bat"}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Away Team */}
              <div className="flex-1">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-800/80 p-0.5 flex items-center justify-center mb-3 shadow-lg">
                    <img
                      src={match.teams.away.logo || `/placeholder.svg`}
                      alt={match.teams.away.name}
                      className="w-12 h-12 object-contain rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-white mb-1 text-center">
                    {match.teams.away.code}
                  </h3>
                  <p className="text-xs text-gray-400 text-center max-w-[100px] truncate">
                    {match.teams.away.name}
                  </p>

                  {/* Score for away team */}
                  {isLive || isCompleted ? (
                    <div className="mt-2 text-center">
                      <span
                        className={cn(
                          "text-sm font-medium px-3 py-1 rounded-full",
                          isLive
                            ? "bg-neon-green/10 text-neon-green"
                            : "bg-gray-800 text-white"
                        )}
                      >
                        {match.scores?.away || "Yet to bat"}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Match info and venue */}
            <div className="flex items-center justify-between bg-gray-800/30 py-2 px-3 rounded-lg text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-gray-500" />
                <span>{formattedDate}</span>
              </div>
              <span>•</span>
              <span>{formattedTime}</span>
              <span>•</span>
              <div className="truncate max-w-[120px]">{match.venue}</div>
            </div>

            {/* Match result for completed matches */}
            {isCompleted && match.result && (
              <div className="mt-3 text-center bg-gray-800/50 border border-gray-800/80 py-2 px-3 rounded-lg">
                <span className="text-sm text-gray-300">{match.result}</span>
              </div>
            )}

            {/* Fantasy features */}
            {showFantasyFeatures && !isCompleted && (
              <div className="mt-4 pt-4 border-t border-gray-800/50">
                {/* Prize Pool and Teams */}
                <div className="flex justify-between mb-3">
                  <div className="flex items-start gap-2">
                    <Trophy className="h-5 w-5 text-neon-green mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-400 mb-0.5">
                        Prize Pool
                      </div>
                      <div className="text-neon-green font-bold">
                        {fantasyData.prizePool}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-400 mb-0.5">Teams</div>
                      <div className="text-white font-medium">
                        {fantasyData.teamsCreated.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Entry fees chips */}
                {isUpcoming && (
                  <>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {fantasyData.entryFees.map((fee, index) => (
                        <div
                          key={index}
                          className="text-xs bg-gray-800/70 text-white font-medium px-2.5 py-1 rounded-full border border-gray-700/50"
                        >
                          {fee} USDC
                        </div>
                      ))}
                    </div>

                    {/* Contest filling progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-400">Contest filling</span>
                        <span
                          className={cn(
                            fantasyData.percentageJoined > 80
                              ? "text-red-400"
                              : fantasyData.percentageJoined > 50
                              ? "text-amber-400"
                              : "text-neon-green"
                          )}
                        >
                          {fantasyData.percentageJoined}% Full
                        </span>
                      </div>
                      <Progress
                        value={fantasyData.percentageJoined}
                        className="h-1.5 bg-gray-800/80"
                      />
                    </div>
                  </>
                )}

                {/* Action buttons */}
                {isUpcoming && (
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/matches/${match.id}`)}
                    >
                      <Info className="w-4 h-4 mr-1" />
                      Match Details
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 bg-neon-green text-black hover:bg-neon-green/90"
                      onClick={() =>
                        navigate(`/teams/create?match=${match.id}`)
                      }
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Create Team
                    </Button>
                  </div>
                )}

                {isLive && (
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/matches/${match.id}`)}
                    >
                      <Info className="w-4 h-4 mr-1" />
                      Match Details
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold"
                      onClick={() => navigate(`/matches/${match.id}/live`)}
                    >
                      Live Score <Zap className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* For completed matches, replace the old button section */}
            {isCompleted && (
              <div className="flex gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/matches/${match.id}`)}
                >
                  <Info className="w-4 h-4 mr-1" />
                  Match Details
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/matches/${match.id}`)}
                >
                  <LineChart className="w-4 h-4 mr-1" />
                  Match Summary
                </Button>
              </div>
            )}

            {/* "Featured" tag for featured matches */}
            {featured && (
              <div className="absolute -top-1 -right-12 rotate-45 bg-neon-green px-10 py-1 text-xs font-bold text-black shadow-lg">
                FEATURED
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
