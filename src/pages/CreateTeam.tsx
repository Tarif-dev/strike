
import { useState } from 'react';
import { ArrowLeft, Users, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import PlayerCard from '@/components/cricket/PlayerCard';
import { Tabs } from '@/components/ui/tab';
import { players } from '@/data/mockData';
import { PlayerData } from '@/components/cricket/PlayerCard';
import { toast } from '@/hooks/use-toast';

const CreateTeam = () => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [activeTab, setActiveTab] = useState("Batsmen");
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerData[]>([]);
  const [captain, setCaptain] = useState<PlayerData | null>(null);
  const [viceCaptain, setViceCaptain] = useState<PlayerData | null>(null);
  
  // Filter players by type
  const batsmen = players.filter(p => p.position === "Batsman");
  const bowlers = players.filter(p => p.position === "Bowler");
  const allRounders = players.filter(p => p.position === "All-rounder");
  
  const getFilteredPlayers = () => {
    switch (activeTab) {
      case "Batsmen":
        return batsmen;
      case "Bowlers":
        return bowlers;
      case "All-rounders":
        return allRounders;
      default:
        return players;
    }
  };
  
  const filteredPlayers = getFilteredPlayers();
  
  const handlePlayerSelection = (player: PlayerData) => {
    const isAlreadySelected = selectedPlayers.some(p => p.id === player.id);
    
    if (isAlreadySelected) {
      // Deselect player
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
      
      // If player was captain or vice captain, remove that designation
      if (captain?.id === player.id) setCaptain(null);
      if (viceCaptain?.id === player.id) setViceCaptain(null);
    } else {
      // Check if team is already full (11 players)
      if (selectedPlayers.length >= 11) {
        toast({
          title: "Team Full",
          description: "You can only select up to 11 players",
          variant: "destructive"
        });
        return;
      }
      
      // Add player to selected list
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };
  
  const handleCaptainSelection = (player: PlayerData) => {
    // Check if player is already selected
    if (!selectedPlayers.some(p => p.id === player.id)) {
      toast({
        title: "Player Not Selected",
        description: "You need to select this player first",
        variant: "destructive"
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
  
  const handleViceCaptainSelection = (player: PlayerData) => {
    // Check if player is already selected
    if (!selectedPlayers.some(p => p.id === player.id)) {
      toast({
        title: "Player Not Selected",
        description: "You need to select this player first",
        variant: "destructive"
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
  
  const handleCreateTeam = () => {
    // Validate team
    if (!teamName.trim()) {
      toast({
        title: "Team Name Required",
        description: "Please enter a name for your team",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedPlayers.length < 11) {
      toast({
        title: "Incomplete Team",
        description: "You need to select 11 players to create a team",
        variant: "destructive"
      });
      return;
    }
    
    if (!captain) {
      toast({
        title: "Captain Required",
        description: "Please select a captain for your team",
        variant: "destructive"
      });
      return;
    }
    
    if (!viceCaptain) {
      toast({
        title: "Vice Captain Required",
        description: "Please select a vice captain for your team",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would submit this to an API
    toast({
      title: "Team Created!",
      description: `Your team ${teamName} has been created successfully`,
      variant: "default"
    });
    
    // Navigate back to home
    navigate('/');
  };
  
  return (
    <PageContainer className="pb-6">
      <div className="flex justify-between items-center py-4">
        <Link to="/" className="flex items-center gap-1 text-cricket-lime">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        
        <div className="flex items-center gap-1">
          <Users className="w-5 h-5" />
          <span>{selectedPlayers.length}/11</span>
        </div>
      </div>
      
      <h1 className="font-bold text-2xl mb-6">Create New Team</h1>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-muted-foreground mb-1">
            Team Name
          </label>
          <input 
            id="teamName" 
            type="text" 
            placeholder="Enter team name"
            className="w-full px-4 py-2.5 bg-cricket-medium-green text-foreground rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-cricket-lime"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        
        {selectedPlayers.length > 0 && (
          <div className="bg-cricket-medium-green rounded-xl p-4">
            <h2 className="font-semibold mb-3">Selected Players</h2>
            <div className="space-y-3">
              {selectedPlayers.map(player => (
                <div key={player.id} className="flex justify-between items-center pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    {player.image ? (
                      <img src={player.image} alt={player.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 bg-cricket-light-green rounded-full" />
                    )}
                    <div>
                      <span className="font-medium">{player.name}</span>
                      <p className="text-xs text-muted-foreground">{player.position}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className={`px-2 py-1 text-xs rounded ${captain?.id === player.id ? 'bg-cricket-lime text-cricket-dark-green' : 'bg-cricket-light-green text-foreground'}`}
                      onClick={() => handleCaptainSelection(player)}
                    >
                      C
                    </button>
                    <button 
                      className={`px-2 py-1 text-xs rounded ${viceCaptain?.id === player.id ? 'bg-cricket-lime text-cricket-dark-green' : 'bg-cricket-light-green text-foreground'}`}
                      onClick={() => handleViceCaptainSelection(player)}
                    >
                      VC
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Select Players</h2>
            {selectedPlayers.length > 0 && (
              <button 
                className="text-xs text-cricket-lime"
                onClick={() => setSelectedPlayers([])}
              >
                Clear All
              </button>
            )}
          </div>
          
          <Tabs
            tabs={["Batsmen", "Bowlers", "All-rounders"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          
          <div className="mt-4 space-y-3 animate-fade-in">
            {filteredPlayers.map(player => {
              const isSelected = selectedPlayers.some(p => p.id === player.id);
              return (
                <PlayerCard 
                  key={player.id} 
                  player={player} 
                  compact={true} 
                  onClick={() => handlePlayerSelection(player)}
                  selected={isSelected}
                />
              );
            })}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border flex justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">Select 11 players, 1 captain & 1 vice-captain</span>
          </div>
          <button 
            className="px-6 py-2 bg-cricket-lime text-cricket-dark-green rounded-lg font-medium"
            onClick={handleCreateTeam}
          >
            Create Team
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default CreateTeam;
