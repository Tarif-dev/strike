
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trophy, TrendingUp, Calendar, Medal } from "lucide-react";
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';
import MatchCard from '@/components/cricket/MatchCard';
import TeamCard from '@/components/cricket/TeamCard';
import PlayerCard from '@/components/cricket/PlayerCard';
import { Tabs } from '@/components/ui/tab';
import { matches, teams, players, notifications } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeTab, setActiveTab] = useState("Matches");
  const { user } = useAuth();
  
  // Filter matches by status ensuring the status matches the expected type
  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');
  
  const myTeams = teams;
  const topPlayers = players.sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 3);
  const unreadNotifications = notifications.filter(n => !n.read);
  
  useEffect(() => {
    // Show notification toast if there are unread notifications
    if (unreadNotifications.length > 0) {
      toast({
        title: `${unreadNotifications.length} New Notifications`,
        description: unreadNotifications[0].message,
        duration: 3000,
      });
    }
  }, []);

  return (
    <>
      <PageContainer>
        <Header />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-cricket-dark-green via-cricket-medium-green to-cricket-dark-green rounded-xl overflow-hidden mt-2 mb-8">
          <div className="p-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-cricket-lime">
              Dream Cricket Fantasy
            </h1>
            <p className="text-foreground/90 mb-6">
              Build your dream team and compete in fantasy cricket leagues
            </p>
            
            {user ? (
              <Link to="/teams/create">
                <Button className="bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90">
                  <Plus className="mr-2 h-4 w-4" /> Create Your Team
                </Button>
              </Link>
            ) : (
              <div className="space-x-3">
                <Link to="/auth/login">
                  <Button className="bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button variant="outline" className="border-cricket-lime text-cricket-lime hover:bg-cricket-medium-green">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-cricket-medium-green border-none">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <TrendingUp className="h-6 w-6 text-cricket-lime mb-2" />
              <p className="text-lg font-bold">15M+</p>
              <p className="text-xs text-muted-foreground">Players</p>
            </CardContent>
          </Card>
          
          <Card className="bg-cricket-medium-green border-none">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Calendar className="h-6 w-6 text-cricket-lime mb-2" />
              <p className="text-lg font-bold">500+</p>
              <p className="text-xs text-muted-foreground">Matches</p>
            </CardContent>
          </Card>
          
          <Card className="bg-cricket-medium-green border-none">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Medal className="h-6 w-6 text-cricket-lime mb-2" />
              <p className="text-lg font-bold">₹10Cr</p>
              <p className="text-xs text-muted-foreground">Total Prizes</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="space-y-6">          
          <Tabs
            tabs={["Matches", "My Teams", "Players"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          
          <div className="space-y-4 animate-fade-in">
            {activeTab === "Matches" && (
              <>
                {liveMatches.length > 0 && (
                  <>
                    <h3 className="font-semibold text-cricket-lime flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                      Live Matches
                    </h3>
                    {liveMatches.map(match => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </>
                )}
                
                <h3 className="font-semibold text-cricket-lime">Upcoming Matches</h3>
                {upcomingMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </>
            )}
            
            {activeTab === "My Teams" && (
              <>
                {user ? (
                  myTeams.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {myTeams.map(team => (
                        <TeamCard key={team.id} team={team} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Trophy className="w-12 h-12 text-muted mx-auto mb-2" />
                      <p className="text-muted-foreground">You haven't created any teams yet</p>
                      <Link 
                        to="/teams/create" 
                        className="block mx-auto mt-4 bg-cricket-lime text-cricket-dark-green px-4 py-2 rounded-lg max-w-xs"
                      >
                        Create Your First Team
                      </Link>
                    </div>
                  )
                ) : (
                  <div className="text-center py-10">
                    <Trophy className="w-12 h-12 text-muted mx-auto mb-2" />
                    <p className="text-muted-foreground">Sign in to create and manage your teams</p>
                    <Link 
                      to="/auth/login" 
                      className="block mx-auto mt-4 bg-cricket-lime text-cricket-dark-green px-4 py-2 rounded-lg max-w-xs"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </>
            )}
            
            {activeTab === "Players" && (
              <>
                <h3 className="font-semibold text-cricket-lime">Top Performers</h3>
                <div className="grid grid-cols-1 gap-4">
                  {topPlayers.map(player => (
                    <PlayerCard key={player.id} player={player} compact={true} />
                  ))}
                </div>
                <Link 
                  to="/players" 
                  className="block text-center text-cricket-lime underline mt-2"
                >
                  View All Players
                </Link>
              </>
            )}
          </div>
          
          {/* League Section */}
          <div className="mt-8 bg-cricket-medium-green rounded-xl overflow-hidden">
            <div className="bg-cricket-light-green p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Featured League</h3>
                <Link to="/leagues" className="text-sm text-cricket-lime">View All</Link>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-semibold">IPL Fantasy League</h4>
                  <p className="text-sm text-muted-foreground">14,726 participants</p>
                </div>
                <div className="bg-cricket-lime text-cricket-dark-green px-3 py-1 rounded-full text-sm font-medium">
                  ₹1,000,000
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Apr 5 - May 28, 2025</span>
                <Link 
                  to="/leagues/l1" 
                  className="text-cricket-lime"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
      
      <Navbar />
    </>
  );
};

export default Index;
