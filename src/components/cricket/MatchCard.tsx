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
  if (
    !match ||
    !match.teams ||
    !match.teams.home ||
    !match.teams.away ||
    !match.tournament
  ) {
    return (
      <Card className="overflow-hidden transition-all p-4">
        <div className="text-center py-4">
          <p className="text-muted-foreground">Match data unavailable</p>
        </div>
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
    prizePool: `₹${Math.floor(Math.random() * 10) + 1}${
      Math.random() > 0.5 ? " Lakh" : " Crore"
    }`,
    entryFees: [49, 99, 499, 999],
    teamsCreated: Math.floor(Math.random() * 100000) + 5000,
    percentageJoined: Math.floor(Math.random() * 70) + 20,
    isHotMatch: Math.random() > 0.7,
  };

  return (
    <Card
      variant="default"
      className="overflow-hidden transition-all hover-effect"
    >
      <div className="bg-card px-4 py-3 flex justify-between items-center border-b border-border/20">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {match.tournament.name}
          </span>
          {match.fantasy?.isHotMatch && (
            <Badge
              variant="outline"
              className="bg-gold-100/10 text-gold-500 border-gold-500/20"
            >
              <Star className="h-3 w-3 mr-1 fill-gold-500" /> Hot
            </Badge>
          )}
        </div>
        <div>
          {isLive && (
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-crimson-red animate-pulse"></span>
              <span className="text-xs font-medium text-crimson-red">LIVE</span>
            </div>
          )}
          {isUpcoming && timeDisplay && (
            <div className="text-xs font-medium bg-muted py-1 px-2.5 rounded-full text-foreground">
              <Clock className="w-3 h-3 inline mr-1" />
              {timeDisplay}
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-muted/50 flex items-center justify-center">
              <img
                src={
                  match.teams.home.logo ||
                  `/team-logos/${match.teams.home.code.toLowerCase()}.png`
                }
                alt={match.teams.home.name}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {match.teams.home.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {match.teams.home.code}
              </p>
              {isCompleted && match.scores?.home && (
                <p className="text-sm text-foreground font-medium mt-1">
                  {match.scores.home}
                </p>
              )}
            </div>
          </div>

          <div className="text-center">
            <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
              VS
            </span>
          </div>

          <div className="flex items-center gap-3 flex-row-reverse text-right">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-muted/50 flex items-center justify-center">
              <img
                src={
                  match.teams.away.logo ||
                  `/team-logos/${match.teams.away.code.toLowerCase()}.png`
                }
                alt={match.teams.away.name}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {match.teams.away.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {match.teams.away.code}
              </p>
              {isCompleted && match.scores?.away && (
                <p className="text-sm text-foreground font-medium mt-1">
                  {match.scores.away}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground mt-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <span>{formattedTime}</span>
          <span className="truncate max-w-[140px]">{match.venue}</span>
        </div>

        {isCompleted && match.result && (
          <div className="mt-4 text-center text-sm bg-muted/40 py-2 rounded-md">
            <span className="text-foreground">{match.result}</span>
          </div>
        )}

        {showFantasyFeatures && !isCompleted && (
          <div className="mt-5 pt-4 border-t border-border/20">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-accent" />
                <span className="font-medium text-foreground">
                  Prize Pool:{" "}
                  <span className="text-accent">{fantasyData.prizePool}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  {fantasyData.teamsCreated.toLocaleString()} teams
                </span>
              </div>
            </div>

            {isUpcoming && (
              <>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Contest filling fast</span>
                  <span>{fantasyData.percentageJoined}% Full</span>
                </div>
                <Progress
                  value={fantasyData.percentageJoined}
                  className="h-1.5 mb-4 bg-muted/30"
                />

                <div className="flex flex-wrap gap-2 mb-4">
                  {fantasyData.entryFees.map((fee, index) => (
                    <div
                      key={index}
                      className="text-xs bg-muted/50 text-foreground px-2.5 py-1 rounded-full"
                    >
                      ₹{fee}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Link to={`/matches/${match.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      {fantasyData.contestCount} Contests
                    </Button>
                  </Link>
                  <Link
                    to={`/teams/create?match=${match.id}`}
                    className="flex-1"
                  >
                    <Button variant="accent" className="w-full" size="sm">
                      Create Team <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {isLive && (
              <div className="flex gap-3">
                <Link to={`/matches/${match.id}`} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    My Contests
                  </Button>
                </Link>
                <Link to={`/matches/${match.id}/live`} className="flex-1">
                  <Button variant="accent" className="w-full" size="sm">
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
