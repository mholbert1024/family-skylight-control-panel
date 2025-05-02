
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHomeAssistantStore } from '@/services/homeAssistantService';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';

interface HomeAssistantConnectionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const HomeAssistantConnectionDialog: React.FC<HomeAssistantConnectionDialogProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const { config, setConfig, disconnect } = useHomeAssistantStore();
  const [formData, setFormData] = useState({
    baseUrl: config.baseUrl || '',
    accessToken: config.accessToken || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };
  
  // Ensure the URL has a protocol and no trailing /api
  const formatUrl = (url: string): string => {
    if (!url) return '';
    
    // Remove trailing slashes
    let formattedUrl = url.trim().replace(/\/+$/, '');
    
    // Remove /api if it's at the end of the URL 
    if (formattedUrl.endsWith('/api')) {
      formattedUrl = formattedUrl.slice(0, -4);
    }
    
    // If URL doesn't start with http:// or https://, add https://
    if (!formattedUrl.match(/^https?:\/\//i)) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    return formattedUrl;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Check for empty fields
    if (!formData.baseUrl.trim() || !formData.accessToken.trim()) {
      setError('Please provide both URL and access token');
      setIsLoading(false);
      return;
    }
    
    const processedUrl = formatUrl(formData.baseUrl.trim());
    console.log(`Testing connection to: ${processedUrl}/api/`);
    
    try {
      // Test the connection first
      const response = await fetch(`${processedUrl}/api/`, {
        headers: {
          Authorization: `Bearer ${formData.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Connection failed: ${response.status} ${response.statusText}`);
      }
      
      // Check if response is valid JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text.substring(0, 300) + '...');
        throw new Error('Received HTML instead of JSON. Make sure you\'re using the correct Home Assistant URL (not the web interface URL)');
      }
      
      const data = await response.json();
      console.log('Connection successful:', data);
      
      // Save the connection details
      setConfig({
        baseUrl: processedUrl,
        accessToken: formData.accessToken,
        connected: true,
      });
      
      toast({
        title: "Connected",
        description: "Successfully connected to Home Assistant",
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Connection error:', error);
      let errorMessage = 'Failed to connect to Home Assistant. Please check your URL and token.';
      
      if (error instanceof Error) {
        // Provide more helpful messages for common errors
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Connection failed: Network error. This could be due to CORS restrictions. Make sure your Home Assistant instance is accessible from your current network.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDisconnect = () => {
    disconnect();
    setFormData({
      baseUrl: '',
      accessToken: '',
    });
    setError(null);
    toast({
      title: "Disconnected",
      description: "Home Assistant connection removed",
    });
  };
  
  const isConnected = config.connected;
  
  const renderUrlHelp = () => (
    <div className="text-xs text-muted-foreground space-y-1">
      <p>Your Home Assistant URL (http/https will be added if missing)</p>
      <p>Examples:</p>
      <ul className="list-disc list-inside pl-2">
        <li>homeassistant.local:8123</li>
        <li>192.168.1.100:8123</li>
        <li>my-home-assistant.duckdns.org</li>
      </ul>
    </div>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Home Assistant Connection</DialogTitle>
          <DialogDescription>
            Connect your Home Assistant instance to import calendar events and control your home
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="baseUrl">Home Assistant URL</Label>
            <Input
              id="baseUrl"
              name="baseUrl"
              placeholder="homeassistant.local:8123"
              value={formData.baseUrl}
              onChange={handleChange}
              required
            />
            {renderUrlHelp()}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accessToken">Long-Lived Access Token</Label>
            <Input
              id="accessToken"
              name="accessToken"
              type="password"
              value={formData.accessToken}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              Generate from your Home Assistant profile page
            </p>
          </div>
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <DialogFooter className="flex justify-between items-center">
            {isConnected && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Testing Connection...' : 'Connect'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HomeAssistantConnectionDialog;
