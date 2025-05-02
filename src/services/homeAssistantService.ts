
import { create } from 'zustand';
import { toast } from '@/components/ui/use-toast';

interface HomeAssistantConfig {
  baseUrl: string;
  accessToken: string;
  connected: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location?: string;
  description?: string;
  color?: string;
}

interface HomeAssistantStore {
  config: HomeAssistantConfig;
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  setConfig: (config: Partial<HomeAssistantConfig>) => void;
  fetchCalendarEvents: (startDate: Date, endDate: Date) => Promise<void>;
  disconnect: () => void;
  testConnection: () => Promise<boolean>;
}

// Helper function to ensure URL has a protocol
const ensureProtocol = (url: string): string => {
  if (!url) return '';
  
  if (!url.match(/^https?:\/\//i)) {
    return `https://${url}`;
  }
  
  return url;
};

// Helper function to validate response is JSON
const validateJsonResponse = async (response: Response, errorContext: string): Promise<any> => {
  const contentType = response.headers.get('content-type');
  
  // Check if the content type indicates JSON
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error(`Received non-JSON response for ${errorContext}:`, text.substring(0, 300) + '...');
    throw new Error(`Expected JSON response but received ${contentType || 'unknown content type'} for ${errorContext}. Your Home Assistant instance may be returning a web page instead of API data. Please verify the URL is correct and points to your Home Assistant API, not the web interface.`);
  }
  
  try {
    return await response.json();
  } catch (error) {
    console.error(`Failed to parse JSON for ${errorContext}:`, error);
    throw new Error(`Failed to parse JSON response for ${errorContext}. Please verify your Home Assistant API is functioning correctly.`);
  }
};

export const useHomeAssistantStore = create<HomeAssistantStore>((set, get) => ({
  config: {
    baseUrl: localStorage.getItem('ha_baseUrl') || '',
    accessToken: localStorage.getItem('ha_accessToken') || '',
    connected: Boolean(localStorage.getItem('ha_connected') || false),
  },
  events: [],
  isLoading: false,
  error: null,
  
  setConfig: (newConfig) => {
    const updatedConfig = { ...get().config, ...newConfig };
    
    // Ensure baseUrl has protocol
    if (updatedConfig.baseUrl) {
      updatedConfig.baseUrl = ensureProtocol(updatedConfig.baseUrl);
    }
    
    // Save to localStorage
    localStorage.setItem('ha_baseUrl', updatedConfig.baseUrl);
    localStorage.setItem('ha_accessToken', updatedConfig.accessToken);
    localStorage.setItem('ha_connected', String(updatedConfig.connected));
    
    set({ config: updatedConfig });
  },
  
  testConnection: async () => {
    const { baseUrl, accessToken } = get().config;
    
    if (!baseUrl || !accessToken) {
      set({ error: 'Missing URL or access token' });
      return false;
    }
    
    try {
      // Make sure baseUrl doesn't end with a slash
      const apiUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      
      const response = await fetch(`${apiUrl}/api/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Connection failed: ${response.status} ${response.statusText || 'Unknown error'}`);
      }
      
      await validateJsonResponse(response, 'API test');
      return true;
    } catch (error) {
      console.error('Test connection error:', error);
      
      let errorMessage = 'Connection test failed';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch')) {
          errorMessage = 'Network error - CORS restrictions may be blocking access. Configure CORS in your Home Assistant instance.';
        }
      }
      
      set({ error: errorMessage });
      return false;
    }
  },
  
  fetchCalendarEvents: async (startDate: Date, endDate: Date) => {
    const { baseUrl, accessToken, connected } = get().config;
    
    if (!connected || !baseUrl || !accessToken) {
      set({ error: 'Home Assistant not connected. Please configure connection first.' });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      // Format dates for API query
      const start = startDate.toISOString();
      const end = endDate.toISOString();
      
      // Make sure baseUrl doesn't end with a slash
      const apiUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      console.log(`Fetching calendars from ${apiUrl}/api/calendar`);
      
      // Get calendar entities
      const response = await fetch(`${apiUrl}/api/calendar`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const statusText = response.statusText || '';
        throw new Error(`Failed to fetch calendar data: ${response.status} ${statusText}`);
      }
      
      // Validate and parse JSON response
      const data = await validateJsonResponse(response, 'calendar entities');
      console.log('Available calendars:', data);
      
      // Process and normalize Home Assistant calendar events
      const events: CalendarEvent[] = [];
      
      if (!Array.isArray(data)) {
        throw new Error('Unexpected response format: calendar data is not an array');
      }
      
      for (const entity of data) {
        if (!entity.entity_id) {
          console.warn('Encountered calendar entity without entity_id', entity);
          continue;
        }
        
        const entityId = entity.entity_id;
        console.log(`Fetching events for calendar: ${entityId}`);
        
        // Now fetch events for this calendar entity
        const eventsResponse = await fetch(`${apiUrl}/api/calendars/${entityId}?start=${start}&end=${end}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        if (!eventsResponse.ok) {
          console.error(`Failed to fetch events for ${entityId}: ${eventsResponse.status}`);
          continue;
        }
        
        // Validate and parse JSON response
        const entityEvents = await validateJsonResponse(eventsResponse, `calendar ${entityId}`);
        console.log(`Received ${entityEvents.length} events for ${entityId}`);
        
        if (!Array.isArray(entityEvents)) {
          console.warn(`Unexpected response format for ${entityId}: events not an array`);
          continue;
        }
        
        // Transform Home Assistant events to our app format
        for (const event of entityEvents) {
          events.push({
            id: event.uid || `${entityId}-${event.start}`,
            title: event.summary || 'Untitled Event',
            start: new Date(event.start),
            end: new Date(event.end),
            allDay: event.all_day || false,
            location: event.location,
            description: event.description,
            // You can assign colors based on calendar entity or leave it for the app to decide
            color: entity.attributes?.color || '#9b87f5',
          });
        }
      }
      
      set({ events, isLoading: false });
      toast({
        title: "Calendar Synced",
        description: `Loaded ${events.length} events from Home Assistant`,
      });
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      
      let errorMessage = 'Unknown error fetching calendar events';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide more specific error messages for CORS issues
        if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch')) {
          errorMessage = 'Network error - CORS restrictions may be blocking access to Home Assistant. Configure CORS in your Home Assistant instance.';
        }
      }
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      
      toast({
        variant: "destructive",
        title: "Calendar Sync Failed",
        description: errorMessage,
      });
    }
  },
  
  disconnect: () => {
    localStorage.removeItem('ha_baseUrl');
    localStorage.removeItem('ha_accessToken');
    localStorage.removeItem('ha_connected');
    
    set({
      config: {
        baseUrl: '',
        accessToken: '',
        connected: false,
      },
      events: [],
    });
    
    toast({
      title: "Disconnected",
      description: "Home Assistant connection removed",
    });
  },
}));
