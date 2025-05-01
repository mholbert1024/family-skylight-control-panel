
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
}

// Helper function to ensure URL has a protocol
const ensureProtocol = (url: string): string => {
  if (!url) return '';
  
  if (!url.match(/^https?:\/\//i)) {
    return `https://${url}`;
  }
  
  return url;
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
      
      console.log(`Fetching calendars from ${baseUrl}/api/calendar`);
      
      // Get calendar entities
      const response = await fetch(`${baseUrl}/api/calendar`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch calendar data: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Available calendars:', data);
      
      // Process and normalize Home Assistant calendar events
      const events: CalendarEvent[] = [];
      
      for (const entity of data) {
        const entityId = entity.entity_id;
        console.log(`Fetching events for calendar: ${entityId}`);
        
        // Now fetch events for this calendar entity
        const eventsResponse = await fetch(`${baseUrl}/api/calendars/${entityId}?start=${start}&end=${end}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!eventsResponse.ok) {
          console.error(`Failed to fetch events for ${entityId}: ${eventsResponse.status}`);
          continue;
        }
        
        const entityEvents = await eventsResponse.json();
        console.log(`Received ${entityEvents.length} events for ${entityId}`);
        
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
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error fetching calendar events',
        isLoading: false 
      });
      toast({
        variant: "destructive",
        title: "Calendar Sync Failed",
        description: error instanceof Error ? error.message : 'Failed to fetch calendar events',
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
