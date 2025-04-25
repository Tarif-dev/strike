import { ArrowLeft, Database } from "lucide-react";
import { Link } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ApiSettings = () => {
  return (
    <PageContainer>
      <div className="flex justify-between items-center py-4">
        <Link to="/profile" className="flex items-center gap-1 text-neon-green">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Data Settings</h1>

      <Alert className="mb-6 border-neon-green/50 bg-gray-900/80">
        <Database className="h-5 w-5 text-neon-green" />
        <AlertTitle className="text-neon-green">Mock Data Mode</AlertTitle>
        <AlertDescription>
          This application is currently running with mock data only. All cricket
          information displayed is simulated and not from real-time sources.
        </AlertDescription>
      </Alert>

      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Cricket Data Information</h2>

        <div className="space-y-4">
          <p className="text-sm">
            The application is configured to use locally stored mock data
            instead of connecting to external cricket APIs. This ensures
            consistent data for development and testing purposes.
          </p>

          <div className="p-3 bg-gray-800/80 rounded-lg text-xs flex items-center">
            <div className="w-2 h-2 rounded-full bg-neon-green mr-2"></div>
            <p>
              Status:{" "}
              <span className="font-mono font-semibold">Using Mock Data</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Mock Data Information</h2>

        <div className="space-y-2 text-sm">
          <p>The following mock data is available in the application:</p>

          <ul className="list-disc list-inside space-y-2 text-sm pl-2">
            <li>Cricket matches (live, upcoming, and completed)</li>
            <li>Player statistics and information</li>
            <li>Team details and compositions</li>
            <li>Leagues and tournaments</li>
            <li>Fantasy scoring and contests</li>
          </ul>
        </div>

        <div className="mt-6 p-3 bg-gray-800/80 rounded-lg text-xs">
          <p className="font-semibold text-neon-green mb-1">Note:</p>
          <p>
            To integrate real cricket data in the future, you would need to
            implement API services using providers like Cricbuzz, CricAPI, or
            SportsData.
          </p>
        </div>

        <div className="mt-4">
          <Link to="/profile">
            <Button className="bg-neon-green hover:bg-neon-green/90 text-black">
              Return to Profile
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default ApiSettings;
