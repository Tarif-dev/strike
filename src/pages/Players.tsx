import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import PlayerCard from "@/components/cricket/PlayerCard";
import { Tabs } from "@/components/ui/tab";
import { usePlayers } from "@/hooks/useCricketData";

const Players = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { players, loading, error } = usePlayers();

  const batsmen = players.filter((p) => p.position === "Batsman");
  const bowlers = players.filter((p) => p.position === "Bowler");
  const allRounders = players.filter((p) => p.position === "All-rounder");

  const getFilteredPlayers = () => {
    let filteredPlayers;

    switch (activeTab) {
      case "Batsmen":
        filteredPlayers = batsmen;
        break;
      case "Bowlers":
        filteredPlayers = bowlers;
        break;
      case "All-rounders":
        filteredPlayers = allRounders;
        break;
      default:
        filteredPlayers = players;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return filteredPlayers.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.team.toLowerCase().includes(query) ||
          p.country.toLowerCase().includes(query)
      );
    }

    return filteredPlayers;
  };

  const filteredPlayers = getFilteredPlayers();

  return (
    <>
      <PageContainer>
        <div className="space-y-6 mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search players..."
              className="w-full px-4 py-2.5 bg-cricket-medium-green text-foreground rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-cricket-lime"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs
            tabs={["All", "Batsmen", "Bowlers", "All-rounders"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-cricket-lime animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">Error loading players</p>
              <p className="text-muted-foreground text-sm mt-2">
                Check your API settings
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player) => (
                  <Link key={player.id} to={`/players/${player.id}`}>
                    <PlayerCard player={player} compact={true} />
                  </Link>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No players found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </PageContainer>

      <Navbar />
    </>
  );
};

export default Players;
