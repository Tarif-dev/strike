
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { cricketApiService } from '@/services/cricketApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const ApiSettings = () => {
  const [apiKey, setApiKey] = useState(cricketApiService.getApiKey() || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      cricketApiService.setApiKey(apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your Cricket API key has been saved. Refresh pages to see live data.",
      });
    } else {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
    }
  };
  
  return (
    <PageContainer>
      <div className="flex justify-between items-center py-4">
        <Link to="/profile" className="flex items-center gap-1 text-cricket-lime">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">API Settings</h1>
      
      <div className="bg-cricket-medium-green rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Cricket API Configuration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block mb-2 text-sm font-medium">
              Cricket API Key
            </label>
            <Input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Cricket API key"
              className="bg-cricket-dark-green border-cricket-light-green"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Get your API key from <a href="https://cricapi.com" target="_blank" rel="noopener noreferrer" className="text-cricket-lime hover:underline">cricapi.com</a>
            </p>
          </div>
          
          <div className="pt-2">
            <Button type="submit" className="bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90">
              Save API Key
            </Button>
          </div>
        </form>
      </div>
      
      <div className="bg-cricket-medium-green rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">How to Get an API Key</h2>
        
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Visit <a href="https://cricapi.com" target="_blank" rel="noopener noreferrer" className="text-cricket-lime hover:underline">cricapi.com</a> and create an account</li>
          <li>Subscribe to a plan (they offer free tiers with limited requests)</li>
          <li>Once registered, navigate to your dashboard</li>
          <li>Copy your API key and paste it in the field above</li>
          <li>Click Save to start using live cricket data</li>
        </ol>
        
        <div className="mt-6 p-3 bg-cricket-dark-green rounded-lg text-xs">
          <p className="font-semibold text-cricket-lime mb-1">Note:</p>
          <p>The app will fall back to mock data if the API key is invalid or if API requests fail.</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default ApiSettings;
