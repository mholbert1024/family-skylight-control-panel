
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
  
  // Ensure the URL has a protocol
  const ensureProtocol = (url: string): string => {
    if (!url) return '';
    
    // If URL doesn't start with http:// or https://, add https://
    if (!url.match(/^https?:\/\//i)) {
      return `https://${url}`;
    }
    
    return url;
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
    
    const processedUrl = ensureProtocol(formData.baseUrl.trim());
    console.log(`Testing connection to: ${processedUrl}/api/`);
    
    try {
      // Test the connection first
      const response = await fetch(`${processedUrl}/api/`, {
        headers: {
          Authorization: `Bearer ${formData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Connection failed: ${response.status} ${response.statusText}`);
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
      setError(error instanceof Error 
        ? error.message 
        : 'Failed to connect to Home Assistant. Please check your URL and token.');
      
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error instanceof Error 
          ? error.message 
          : 'Failed to connect to Home Assistant',
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
            <p className="text-xs text-muted-foreground">
              Your Home Assistant URL (http/https will be added if missing)
            </p>
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
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
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
