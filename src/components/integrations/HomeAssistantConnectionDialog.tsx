
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHomeAssistantStore } from '@/services/homeAssistantService';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, ExternalLink, Info } from 'lucide-react';

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
  const [showCorsHelp, setShowCorsHelp] = useState(false);
  
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
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Connection failed: Network error. This could be due to CORS restrictions. Make sure your Home Assistant instance is accessible from your current network.';
          // Show CORS help option
          setShowCorsHelp(true);
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
    <>
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
                <div className="flex-1">
                  <span>{error}</span>
                  {showCorsHelp && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-destructive underline"
                      onClick={() => setShowCorsHelp(true)}
                    >
                      View CORS Troubleshooting Tips
                    </Button>
                  )}
                </div>
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
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowCorsHelp(true)}>
                  <Info className="h-4 w-4 mr-1" />
                  Help
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Testing Connection...' : 'Connect'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCorsHelp} onOpenChange={setShowCorsHelp}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>CORS Troubleshooting</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                CORS (Cross-Origin Resource Sharing) prevents websites from making requests to domains other than the one serving the web page. This is a common issue when accessing Home Assistant from external websites.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">Solutions:</h4>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    <strong>Use a CORS proxy</strong> - Not recommended for security reasons
                  </li>
                  <li>
                    <strong>Configure CORS in Home Assistant</strong> - Add this to your configuration.yaml:
                    <pre className="bg-muted p-2 rounded-md text-xs mt-1 overflow-x-auto">
                      http:<br/>
                      &nbsp;&nbsp;cors_allowed_origins:<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;- https://id-preview--0444befb-2656-42a8-b596-b6727c420706.lovable.app
                    </pre>
                    After adding this, restart Home Assistant.
                  </li>
                  <li>
                    <strong>Use Home Assistant Cloud (Nabu Casa)</strong> - This includes remote access with proper CORS configuration
                  </li>
                  <li>
                    <strong>Setup a proxy on your server</strong> - If you have a web server, you can set up a proxy
                  </li>
                </ol>
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="flex items-center" 
                  onClick={() => window.open('https://www.home-assistant.io/integrations/http/#cors_allowed_origins', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Home Assistant CORS Documentation
                </Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HomeAssistantConnectionDialog;
