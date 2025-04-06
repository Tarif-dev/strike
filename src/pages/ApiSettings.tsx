
import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { cricketApiService } from '@/services/cricketApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const ApiSettings = () => {
  const [apiKey, setApiKey] = useState(cricketApiService.getApiKey() || '');
  const [isCopied, setIsCopied] = useState(false);
  
  // Set initial API key when component loads (your provided key)
  useEffect(() => {
    // If no API key is set, use the provided key
    if (!cricketApiService.getApiKey()) {
      const defaultKey = '3f59916d-078c-44c4-9aed-363e86dd45d1';
      cricketApiService.setApiKey(defaultKey);
      setApiKey(defaultKey);
      toast({
        title: "API Key Set",
        description: "Default Cricket API key has been applied.",
      });
    }
  }, []);

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

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: "API Key Copied",
      description: "API key copied to clipboard",
    });
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
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Cricket API key"
                className="bg-cricket-dark-green border-cricket-light-green flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={copyApiKey}
                className="bg-cricket-dark-green border-cricket-light-green hover:bg-cricket-medium-green"
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Get your API key from <a href="https://cricapi.com" target="_blank" rel="noopener noreferrer" className="text-cricket-lime hover:underline">cricapi.com</a> or <a href="https://cricketdata.org" target="_blank" rel="noopener noreferrer" className="text-cricket-lime hover:underline">cricketdata.org</a>
            </p>
          </div>
          
          <div className="pt-2">
            <Button type="submit" className="bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90">
              Save API Key
            </Button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-cricket-dark-green rounded-lg text-xs flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <p>Current API key: <span className="font-mono font-semibold">{apiKey ? `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}` : "Not set"}</span></p>
        </div>
      </div>
      
      <div className="bg-cricket-medium-green rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">How to Get an API Key</h2>
        
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Visit <a href="https://cricketdata.org" target="_blank" rel="noopener noreferrer" className="text-cricket-lime hover:underline">cricketdata.org</a> or <a href="https://cricapi.com" target="_blank" rel="noopener noreferrer" className="text-cricket-lime hover:underline">cricapi.com</a> and create an account</li>
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
