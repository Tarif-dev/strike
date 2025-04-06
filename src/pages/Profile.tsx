
import { useState, useEffect } from 'react';
import { Bell, Settings, Trophy, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';
import { Tabs } from '@/components/ui/tab';
import TeamCard from '@/components/cricket/TeamCard';
import { teams, notifications } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the profile type
interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Teams");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
          } else {
            setProfile(data);
          }
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "Teams":
        return (
          <div className="space-y-4">
            {teams.length > 0 ? (
              teams.map(team => (
                <TeamCard key={team.id} team={team} />
              ))
            ) : (
              <div className="text-center py-10">
                <Trophy className="w-12 h-12 text-muted mx-auto mb-2" />
                <p className="text-muted-foreground">No teams created yet</p>
                <Link 
                  to="/teams/create" 
                  className="block mx-auto mt-4 bg-cricket-lime text-cricket-dark-green px-4 py-2 rounded-lg max-w-xs"
                >
                  Create Your First Team
                </Link>
              </div>
            )}
          </div>
        );
      
      case "Achievements":
        return (
          <div className="bg-cricket-medium-green rounded-xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Your Achievements</h3>
                <div className="bg-cricket-lime text-cricket-dark-green px-3 py-1 rounded-full text-sm">
                  Level 5
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <div className="bg-cricket-lime p-2 rounded-full text-cricket-dark-green">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">First Place</h4>
                    <p className="text-xs text-muted-foreground">Friends Premier League - Mar 2023</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <div className="bg-cricket-lime p-2 rounded-full text-cricket-dark-green">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Top 1000 Players</h4>
                    <p className="text-xs text-muted-foreground">World Cup Challenge - Jun 2022</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <div className="bg-cricket-lime p-2 rounded-full text-cricket-dark-green">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Created 10 Teams</h4>
                    <p className="text-xs text-muted-foreground">Achievement Unlocked</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "Notifications":
        return (
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl ${
                    notification.read ? "bg-cricket-medium-green" : "bg-cricket-light-green"
                  }`}
                >
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-sm mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <Bell className="w-12 h-12 text-muted mx-auto mb-2" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <>
      <PageContainer>
        <Header title="Profile" showBackButton={false} />
        
        <div className="space-y-6 mt-4">
          <div className="bg-cricket-medium-green rounded-xl overflow-hidden">
            <div className="lime-card p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-cricket-dark-green flex items-center justify-center">
                  {loading ? (
                    <Skeleton className="w-full h-full rounded-full" />
                  ) : profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.username || 'User'} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-cricket-lime" />
                  )}
                </div>
                
                <div>
                  {loading ? (
                    <>
                      <Skeleton className="h-6 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <h2 className="font-bold text-xl">
                        {profile?.full_name || user?.email?.split('@')[0] || 'Cricket Fan'}
                      </h2>
                      <p className="text-sm text-cricket-dark-green/80">
                        @{profile?.username || user?.email?.split('@')[0]?.toLowerCase() || 'user'}
                      </p>
                    </>
                  )}
                </div>
                
                <div className="ml-auto flex items-center gap-2">
                  <Link to="/settings" className="p-2">
                    <Settings className="w-5 h-5 text-cricket-dark-green" />
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="p-2"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-5 h-5 text-cricket-dark-green" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Teams</p>
                <p className="font-bold">{teams.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Leagues</p>
                <p className="font-bold">2</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="font-bold text-cricket-lime">1,856</p>
              </div>
            </div>
          </div>
          
          <Tabs
            tabs={["Teams", "Achievements", "Notifications"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          
          <div className="animate-fade-in">
            {renderTabContent()}
          </div>
        </div>
      </PageContainer>
      
      <Navbar />
    </>
  );
};

export default Profile;
