
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bell, BellOff } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { matches, players } from '@/data/mockData';
import { useState } from 'react';
import { Tabs } from '@/components/ui/tab';
import PlayerCard from '@/components/cricket/PlayerCard';

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Info");
  const [isNotifyOn, setIsNotifyOn] = useState(false);
  
  // Find match by ID
  const match = matches.find(m => m.id === id);
  
  // For the demo, we'll just take some random players from our mock data
  const homeTeamPlayers = players.slice(0, 5);
  const awayTeamPlayers = players.slice(5, 10);
  
  if (!match) {
    return (
      <PageContainer>
        <div className="text-center py-10">
          <h2 className="text-xl font-bold mb-2">Match Not Found</h2>
          <Link to="/matches" className="text-cricket-lime">Back to Matches</Link>
        </div>
      </PageContainer>
    );
  }
  
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';
  const toggleNotification = () => setIsNotifyOn(!isNotifyOn);
  
  return (
    <PageContainer className="pb-6">
      <div className="flex justify-between items-center py-4">
        <Link to="/matches" className="flex items-center gap-1 text-cricket-lime">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        
        <button 
          onClick={toggleNotification}
          className="p-2 rounded-full bg-cricket-medium-green"
        >
          {isNotifyOn ? (
            <Bell className="w-5 h-5 text-cricket-lime" />
          ) : (
            <BellOff className="w-5 h-5" />
          )}
        </button>
      </div>
      
      <div className="lime-card mb-6">
        <div className="text-xs text-cricket-dark-green/80 mb-2">
          {match.tournament}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-14 h-14 mb-2" />
            <h3 className="font-bold text-lg">{match.homeTeam.shortName}</h3>
          </div>
          
          <div className="text-center">
            {isLive && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse block mb-2">LIVE</span>}
            {isCompleted ? (
              <span className="text-cricket-dark-green font-medium text-lg mb-1 block">vs</span>
            ) : (
              <span className="text-cricket-dark-green font-medium text-lg mb-1 block">vs</span>
            )}
            <span className="text-xs text-cricket-dark-green/80">{match.date} • {match.time}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-14 h-14 mb-2" />
            <h3 className="font-bold text-lg">{match.awayTeam.shortName}</h3>
          </div>
        </div>
        
        {isLive && match.homeScore && (
          <div className="mt-4 flex justify-between text-cricket-dark-green">
            <div className="font-medium">{match.homeScore}</div>
            <div className="font-medium">{match.awayScore || "Yet to bat"}</div>
          </div>
        )}
        
        {isCompleted && match.result && (
          <div className="mt-4 text-center text-cricket-dark-green font-medium">
            {match.result}
          </div>
        )}
      </div>
      
      <Tabs
        tabs={["Info", "Scorecard", "Players", "Stats"]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      <div className="mt-4 animate-fade-in">
        {activeTab === "Info" && (
          <div className="space-y-5">
            <div className="bg-cricket-medium-green rounded-xl p-4">
              <h3 className="font-semibold mb-3">Match Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue</span>
                  <span>{match.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{match.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span>{match.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tournament</span>
                  <span>{match.tournament}</span>
                </div>
              </div>
            </div>
            
            {(isLive || isCompleted) && (
              <div className="bg-cricket-medium-green rounded-xl p-4">
                <h3 className="font-semibold mb-3">Match Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Toss</span>
                    <span>{match.homeTeam.name} won the toss and elected to bat</span>
                  </div>
                  {isCompleted && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Result</span>
                      <span className="text-cricket-lime">{match.result}</span>
                    </div>
                  )}
                  {isLive && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Rate</span>
                      <span>8.2 RPO</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "Scorecard" && (
          <div className="space-y-5">
            {(isLive || isCompleted) ? (
              <>
                <div className="bg-cricket-medium-green rounded-xl p-4">
                  <h3 className="font-semibold mb-3">{match.homeTeam.name}</h3>
                  <div className="space-y-2">
                    {homeTeamPlayers.map((player, index) => (
                      <div key={player.id} className="flex justify-between pb-2 border-b border-border">
                        <div>
                          <span className="font-medium">{player.name}</span>
                          {index === 0 && <span className="text-xs text-cricket-lime ml-1">batting</span>}
                          {index === 1 && <span className="text-xs text-red-400 ml-1">out</span>}
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{Math.floor(Math.random() * 70)}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({Math.floor(Math.random() * 40 + 10)})
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between mt-4 font-semibold">
                      <span>Total</span>
                      <span>{isLive ? match.homeScore?.split(' ')[0] : "176/4 (20)"}</span>
                    </div>
                  </div>
                </div>
                
                {isCompleted && (
                  <div className="bg-cricket-medium-green rounded-xl p-4">
                    <h3 className="font-semibold mb-3">{match.awayTeam.name}</h3>
                    <div className="space-y-2">
                      {awayTeamPlayers.map((player, index) => (
                        <div key={player.id} className="flex justify-between pb-2 border-b border-border">
                          <div>
                            <span className="font-medium">{player.name}</span>
                            {index === 3 && <span className="text-xs text-red-400 ml-1">out</span>}
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{Math.floor(Math.random() * 60)}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({Math.floor(Math.random() * 30 + 10)})
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between mt-4 font-semibold">
                        <span>Total</span>
                        <span>{isCompleted ? match.awayScore?.split(' ')[0] : "Yet to bat"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Match hasn't started yet</p>
                <p className="mt-2 text-sm text-cricket-lime">
                  Scorecard will be available when the match begins
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "Players" && (
          <div className="space-y-5">
            <div className="bg-cricket-medium-green rounded-xl p-4">
              <h3 className="font-semibold mb-3">{match.homeTeam.name}</h3>
              <div className="space-y-3">
                {homeTeamPlayers.map(player => (
                  <Link key={player.id} to={`/players/${player.id}`}>
                    <PlayerCard player={player} compact={true} />
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="bg-cricket-medium-green rounded-xl p-4">
              <h3 className="font-semibold mb-3">{match.awayTeam.name}</h3>
              <div className="space-y-3">
                {awayTeamPlayers.map(player => (
                  <Link key={player.id} to={`/players/${player.id}`}>
                    <PlayerCard player={player} compact={true} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "Stats" && (
          <div className="space-y-5">
            {(isLive || isCompleted) ? (
              <>
                <div className="bg-cricket-medium-green rounded-xl p-4">
                  <h3 className="font-semibold mb-3">Top Performers</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Most Runs</span>
                      <div className="flex justify-between pb-2 border-b border-border">
                        <div className="flex items-center gap-2">
                          <img src={players[0].image} alt={players[0].name} className="w-8 h-8 rounded-full" />
                          <span className="font-medium">{players[0].name}</span>
                        </div>
                        <span className="font-medium">63 (42)</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Most Wickets</span>
                      <div className="flex justify-between pb-2 border-b border-border">
                        <div className="flex items-center gap-2">
                          <img src={players[2].image} alt={players[2].name} className="w-8 h-8 rounded-full" />
                          <span className="font-medium">{players[2].name}</span>
                        </div>
                        <span className="font-medium">3/24</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Best Strike Rate</span>
                      <div className="flex justify-between pb-2 border-b border-border">
                        <div className="flex items-center gap-2">
                          <img src={players[1].image} alt={players[1].name} className="w-8 h-8 rounded-full" />
                          <span className="font-medium">{players[1].name}</span>
                        </div>
                        <span className="font-medium">175.0</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Best Economy</span>
                      <div className="flex justify-between pb-2 border-border">
                        <div className="flex items-center gap-2">
                          <img src={players[8].image} alt={players[8].name} className="w-8 h-8 rounded-full" />
                          <span className="font-medium">{players[8].name}</span>
                        </div>
                        <span className="font-medium">5.75</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-cricket-medium-green rounded-xl p-4">
                  <h3 className="font-semibold mb-3">Match Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Runs</span>
                      <span>{isCompleted ? "350" : "102"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Wickets</span>
                      <span>{isCompleted ? "12" : "3"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Run Rate</span>
                      <span>{isCompleted ? "8.75" : "8.2"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sixes</span>
                      <span>{isCompleted ? "14" : "5"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fours</span>
                      <span>{isCompleted ? "28" : "9"}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Match hasn't started yet</p>
                <p className="mt-2 text-sm text-cricket-lime">
                  Statistics will be available when the match begins
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default MatchDetail;
