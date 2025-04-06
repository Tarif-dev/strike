
import { useState } from 'react';
import { Bell, Settings, Trophy, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';
import { Tabs } from '@/components/ui/tab';
import TeamCard from '@/components/cricket/TeamCard';
import { teams, notifications } from '@/data/mockData';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Teams");
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "Teams":
        return (
          <div className="space-y-4">
            {teams.map(team => (
              <TeamCard key={team.id} team={team} />
            ))}
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
                  <User className="w-8 h-8 text-cricket-lime" />
                </div>
                
                <div>
                  <h2 className="font-bold text-xl">Cricket Fan</h2>
                  <p className="text-sm text-cricket-dark-green/80">@cricketfan123</p>
                </div>
                
                <Link to="/settings" className="ml-auto p-2">
                  <Settings className="w-5 h-5 text-cricket-dark-green" />
                </Link>
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
