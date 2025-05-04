import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  Users,
  CalendarDays,
  BarChart3,
  Settings,
  Plus,
  Trophy,
  DollarSign,
  Trash2,
  Edit,
  MoreHorizontal,
  Search,
  ChevronDown,
  AlertTriangle,
  Loader,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PageContainer from "@/components/layout/PageContainer";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="mt-8 space-y-6 px-4">
        {/* Quick action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            className="bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90 h-auto py-6"
            onClick={() => navigate("/admin/create-match")}
          >
            <div className="flex flex-col items-center">
              <Plus className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Create Match</span>
            </div>
          </Button>

          <Button
            className="bg-cricket-dark-green hover:bg-cricket-dark-green/90 h-auto py-6"
            onClick={() => navigate("/matches")}
          >
            <div className="flex flex-col items-center">
              <CalendarDays className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">View Matches</span>
            </div>
          </Button>

          <Button
            className="bg-cricket-dark-green hover:bg-cricket-dark-green/90 h-auto py-6"
            onClick={() => navigate("/players")}
          >
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Manage Players</span>
            </div>
          </Button>
        </div>

        {/* Stats and Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-cricket-medium-green">
            <CardHeader>
              <CardTitle>Match Statistics</CardTitle>
              <CardDescription>
                Overview of matches and participation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active Matches</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Total Teams Created
                  </span>
                  <span className="font-semibold">243</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Average Teams per Match
                  </span>
                  <span className="font-semibold">20.3</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cricket-medium-green">
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
              <CardDescription>Quick management tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Match Management
              </Button>
              <Button className="w-full" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent activity/matches */}
        <Card className="bg-cricket-medium-green">
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
            <CardDescription>
              Recently created or updated matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-cricket-dark-green/40 rounded-md">
                <div>
                  <div className="font-medium">CSK vs MI</div>
                  <div className="text-sm text-muted-foreground">
                    May 15, 2025
                  </div>
                </div>
                <div className="text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  Active
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-cricket-dark-green/40 rounded-md">
                <div>
                  <div className="font-medium">RCB vs KKR</div>
                  <div className="text-sm text-muted-foreground">
                    May 12, 2025
                  </div>
                </div>
                <div className="text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  Active
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-cricket-dark-green/40 rounded-md">
                <div>
                  <div className="font-medium">DC vs SRH</div>
                  <div className="text-sm text-muted-foreground">
                    May 10, 2025
                  </div>
                </div>
                <div className="text-sm bg-gray-500/20 text-gray-400 px-2 py-1 rounded">
                  Completed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AdminDashboard;
