
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Test the connection first
      const response = await fetch(`${formData.baseUrl}/api/`, {
        headers: {
          Authorization: `Bearer ${formData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Connection failed: ${response.status}`);
      }
      
      // Save the connection details
      setConfig({
        baseUrl: formData.baseUrl,
        accessToken: formData.accessToken,
        connected: true,
      });
      
      toast({
        title: "Connected",
        description: "Successfully connected to Home Assistant",
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to connect to Home Assistant',
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
              placeholder="http://homeassistant.local:8123"
              value={formData.baseUrl}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-muted-foreground">Include http/https and port if needed</p>
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
