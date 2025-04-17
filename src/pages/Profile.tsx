
import React, { useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Settings, LogOut, ChevronRight, Key } from "lucide-react";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tab";

const Profile = () => {
  const { user, signOut, isLoading } = useAuth();
  const [activeTab, setActiveTab] = React.useState("Personal Info");

  // If not authenticated, redirect to the landing page
  if (!isLoading && !user) {
    return <Navigate to="/" replace />;
  }

  // Function to get initials from name or email
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get display name or email
  const displayName = user?.user_metadata?.full_name || user?.email || "User";
  const initials = getInitials(displayName);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse text-cricket-lime text-xl">Loading profile...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer>
        <Header title="Profile" />

        <div className="flex flex-col items-center mt-6 mb-8">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="text-2xl bg-cricket-lime text-cricket-dark-green">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        <Tabs
          tabs={["Personal Info", "Account", "Settings"]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-6 space-y-6">
          {activeTab === "Personal Info" && (
            <div className="space-y-4">
              <div className="bg-cricket-medium-green rounded-xl">
                <div className="p-4 border-b border-cricket-dark-green">
                  <h3 className="font-semibold">Basic Information</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Full Name</label>
                    <p>{user?.user_metadata?.full_name || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Email</label>
                    <p>{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Username</label>
                    <p>{user?.user_metadata?.username || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-cricket-medium-green rounded-xl">
                <div className="p-4 border-b border-cricket-dark-green">
                  <h3 className="font-semibold">Cricket Information</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Favorite Team</label>
                    <p>Not set</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Favorite Player</label>
                    <p>Not set</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Account" && (
            <div className="space-y-4">
              <div className="bg-cricket-medium-green rounded-xl">
                <div className="p-4 border-b border-cricket-dark-green">
                  <h3 className="font-semibold">Account Information</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Member Since</label>
                    <p>
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Last Login</label>
                    <p>
                      {user?.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-cricket-medium-green rounded-xl">
                <div className="p-4 border-b border-cricket-dark-green">
                  <h3 className="font-semibold">Security</h3>
                </div>
                <div className="p-4">
                  <Link
                    to="/auth/reset-password"
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-muted-foreground" />
                      <span>Change Password</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Settings" && (
            <div className="space-y-4">
              <div className="bg-cricket-medium-green rounded-xl">
                <div className="p-4 border-b border-cricket-dark-green">
                  <h3 className="font-semibold">API Settings</h3>
                </div>
                <div className="p-4">
                  <Link
                    to="/api-settings"
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-muted-foreground" />
                      <span>Configure Cricket API</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </Link>
                </div>
              </div>

              <div className="bg-cricket-medium-green rounded-xl">
                <div className="p-4 border-b border-cricket-dark-green">
                  <h3 className="font-semibold">App Preferences</h3>
                </div>
                <div className="p-4">
                  <Link to="/settings" className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-muted-foreground" />
                      <span>Customize App</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col mt-8">
            <Button
              variant="outline"
              className="bg-transparent border-red-500 text-red-500 hover:bg-red-500/10"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </PageContainer>
      <Navbar />
    </>
  );
};

export default Profile;
