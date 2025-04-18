import { Calendar, Trophy, Users, Clock, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  // Fantasy-specific data
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
}

export default function MatchCard({
  match,
  showFantasyFeatures = false,
}: MatchCardProps) {
  // Check if match data is properly structured
  if (
    !match ||
    !match.teams ||
    !match.teams.home ||
    !match.teams.away ||
    !match.tournament
  ) {
    // Return a placeholder or loading state when data is malformed
    return (
      <Card className="overflow-hidden border-neon-green/20 bg-dark-gray/80 hover:border-neon-green/40 transition-all p-4">
        <div className="text-center py-4">
          <p className="text-neon-green/60">Match data unavailable</p>
        </div>
      </Card>
    );
  }

  const isLive = match.status === "live";
  const isCompleted = match.status === "completed";
  const isUpcoming = match.status === "upcoming";

  // Format date and time - add defensive check
  const matchDate = new Date(match.startTime || Date.now());
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  const formattedTime = matchDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate time until match
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

  // Default fantasy data for display if not provided
  const fantasyData = match.fantasy || {
    contestCount: Math.floor(Math.random() * 50) + 10,
    prizePool: `₹${Math.floor(Math.random() * 10) + 1}${
      Math.random() > 0.5 ? " Lakh" : " Crore"
    }`,
    entryFees: [49, 99, 499, 999],
    teamsCreated: Math.floor(Math.random() * 100000) + 5000,
    percentageJoined: Math.floor(Math.random() * 70) + 20,
    isHotMatch: Math.random() > 0.7,
  };

  return (
    <Card className="overflow-hidden border-neon-green/20 bg-dark-gray/80 hover:border-neon-green/40 transition-all">
      <div className="bg-gradient-to-r from-deep-black to-dark-gray px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neon-green">
            {match.tournament.name}
          </span>
          {match.fantasy?.isHotMatch && (
            <Badge className="bg-neon-green/20 text-neon-green border-neon-green/20">
              <Star className="h-3 w-3 mr-1 fill-neon-green" /> Hot
            </Badge>
          )}
        </div>
        <div>
          {isLive && (
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse"></span>
              <span className="text-xs font-medium text-neon-green">LIVE</span>
            </div>
          )}
          {isUpcoming && timeDisplay && (
            <div className="text-xs font-medium bg-deep-black py-1 px-2 rounded-full text-neon-green">
              <Clock className="w-3 h-3 inline mr-1" />
              {timeDisplay}
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-deep-black flex items-center justify-center border border-neon-green/20">
              <img
                src={
                  match.teams.home.logo ||
                  `/team-logos/${match.teams.home.code.toLowerCase()}.png`
                }
                alt={match.teams.home.name}
                className="w-10 h-10"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <div>
              <p className="font-bold text-neon-green">
                {match.teams.home.name}
              </p>
              <p className="text-sm text-neon-green/60">
                {match.teams.home.code}
              </p>
              {isCompleted && match.scores?.home && (
                <p className="text-sm text-neon-green font-medium">
                  {match.scores.home}
                </p>
              )}
            </div>
          </div>

          <div className="text-center">
            <span className="text-xs bg-neon-green/20 text-neon-green px-3 py-1 rounded-full font-medium">
              VS
            </span>
          </div>

          <div className="flex items-center gap-3 flex-row-reverse text-right">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-deep-black flex items-center justify-center border border-neon-green/20">
              <img
                src={
                  match.teams.away.logo ||
                  `/team-logos/${match.teams.away.code.toLowerCase()}.png`
                }
                alt={match.teams.away.name}
                className="w-10 h-10"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <div>
              <p className="font-bold text-neon-green">
                {match.teams.away.name}
              </p>
              <p className="text-sm text-neon-green/60">
                {match.teams.away.code}
              </p>
              {isCompleted && match.scores?.away && (
                <p className="text-sm text-neon-green font-medium">
                  {match.scores.away}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-neon-green/60 mt-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <span>{formattedTime}</span>
          <span className="truncate max-w-[140px]">{match.venue}</span>
        </div>

        {isCompleted && match.result && (
          <div className="mt-3 text-center text-sm bg-deep-black/80 py-2 rounded-lg">
            <span className="text-neon-green">{match.result}</span>
          </div>
        )}

        {/* Fantasy cricket features */}
        {showFantasyFeatures && !isCompleted && (
          <div className="mt-4 pt-4 border-t border-neon-green/20">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-neon-green" />
                <span className="font-medium text-neon-green">
                  Prize Pool:{" "}
                  <span className="neon-text">{fantasyData.prizePool}</span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-neon-green/60" />
                <span className="text-neon-green/60 text-sm">
                  {fantasyData.teamsCreated.toLocaleString()} teams
                </span>
              </div>
            </div>

            {isUpcoming && (
              <>
                <div className="flex items-center justify-between text-xs text-neon-green/60 mb-1">
                  <span>Contest filling fast</span>
                  <span>{fantasyData.percentageJoined}% Full</span>
                </div>
                <Progress
                  value={fantasyData.percentageJoined}
                  className="h-1.5 mb-3 bg-deep-black [&>div]:bg-neon-green"
                />

                <div className="flex flex-wrap gap-2 mb-4">
                  {fantasyData.entryFees.map((fee, index) => (
                    <div
                      key={index}
                      className="text-xs bg-deep-black text-neon-green px-2 py-1 rounded-full"
                    >
                      ₹{fee}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Link to={`/matches/${match.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-neon-green/40 text-neon-green hover:bg-neon-green/10"
                      size="sm"
                    >
                      {fantasyData.contestCount} Contests
                    </Button>
                  </Link>
                  <Link
                    to={`/teams/create?match=${match.id}`}
                    className="flex-1"
                  >
                    <Button
                      className="w-full bg-neon-green text-deep-black hover:bg-neon-green-light"
                      size="sm"
                    >
                      Create Team <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {isLive && (
              <div className="flex gap-2">
                <Link to={`/matches/${match.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-neon-green/40 text-neon-green hover:bg-neon-green/10"
                    size="sm"
                  >
                    My Contests
                  </Button>
                </Link>
                <Link to={`/matches/${match.id}/live`} className="flex-1">
                  <Button
                    className="w-full bg-neon-green hover:bg-neon-green-light text-deep-black"
                    size="sm"
                  >
                    Live Score
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
