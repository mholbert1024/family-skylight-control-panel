
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  ThermometerSun, 
  DoorClosed, 
  GarageDoor, 
  AlarmClock,
  House
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HomeView: React.FC = () => {
  // This would connect to Home Assistant in a real implementation
  const [deviceStates, setDeviceStates] = React.useState({
    livingRoomLights: false,
    kitchenLights: true,
    bedroomLights: false,
    frontDoor: 'locked',
    garageDoor: 'closed',
    alarm: 'armed',
    temperature: 72,
    mode: 'home'
  });
  
  const toggleDevice = (device: string, value?: any) => {
    setDeviceStates(prev => ({
      ...prev,
      [device]: value !== undefined ? value : !prev[device]
    }));
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Home Controls</h2>
        <Badge 
          variant={deviceStates.mode === 'home' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => toggleDevice('mode', deviceStates.mode === 'home' ? 'away' : 'home')}
        >
          <House className="h-3 w-3 mr-1" />
          Mode: {deviceStates.mode === 'home' ? 'Home' : 'Away'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lighting controls */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Lighting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button 
                variant={deviceStates.livingRoomLights ? "default" : "outline"}
                className="justify-start h-12"
                onClick={() => toggleDevice('livingRoomLights')}
              >
                <div className={`w-3 h-3 rounded-full mr-3 ${deviceStates.livingRoomLights ? 'bg-amber-400' : 'bg-gray-300'}`}></div>
                Living Room
              </Button>
              
              <Button 
                variant={deviceStates.kitchenLights ? "default" : "outline"}
                className="justify-start h-12"
                onClick={() => toggleDevice('kitchenLights')}
              >
                <div className={`w-3 h-3 rounded-full mr-3 ${deviceStates.kitchenLights ? 'bg-amber-400' : 'bg-gray-300'}`}></div>
                Kitchen
              </Button>
              
              <Button 
                variant={deviceStates.bedroomLights ? "default" : "outline"}
                className="justify-start h-12"
                onClick={() => toggleDevice('bedroomLights')}
              >
                <div className={`w-3 h-3 rounded-full mr-3 ${deviceStates.bedroomLights ? 'bg-amber-400' : 'bg-gray-300'}`}></div>
                Bedrooms
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Security controls */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DoorClosed className="h-5 w-5 mr-2" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button 
                variant="outline"
                className={`justify-start h-12 ${deviceStates.frontDoor === 'locked' ? 'border-green-500 text-green-700 bg-green-50' : 'border-red-500 text-red-700 bg-red-50'}`}
                onClick={() => toggleDevice('frontDoor', deviceStates.frontDoor === 'locked' ? 'unlocked' : 'locked')}
              >
                <DoorClosed className="h-4 w-4 mr-3" />
                Front Door: {deviceStates.frontDoor}
              </Button>
              
              <Button 
                variant="outline"
                className={`justify-start h-12 ${deviceStates.garageDoor === 'closed' ? 'border-green-500 text-green-700 bg-green-50' : 'border-red-500 text-red-700 bg-red-50'}`}
                onClick={() => toggleDevice('garageDoor', deviceStates.garageDoor === 'closed' ? 'open' : 'closed')}
              >
                <GarageDoor className="h-4 w-4 mr-3" />
                Garage Door: {deviceStates.garageDoor}
              </Button>
              
              <Button 
                variant="outline"
                className={`justify-start h-12 ${deviceStates.alarm === 'armed' ? 'border-blue-500 text-blue-700 bg-blue-50' : 'text-gray-700'}`}
                onClick={() => toggleDevice('alarm', deviceStates.alarm === 'armed' ? 'disarmed' : 'armed')}
              >
                <AlarmClock className="h-4 w-4 mr-3" />
                Alarm System: {deviceStates.alarm}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Climate control */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ThermometerSun className="h-5 w-5 mr-2" />
              Climate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center p-2">
              <div className="text-4xl font-bold mb-4">{deviceStates.temperature}°</div>
              <div className="flex gap-4">
                <Button 
                  onClick={() => toggleDevice('temperature', deviceStates.temperature - 1)}
                  variant="outline"
                  size="icon"
                >
                  -
                </Button>
                <Button 
                  onClick={() => toggleDevice('temperature', deviceStates.temperature + 1)}
                  variant="outline"
                  size="icon"
                >
                  +
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Device status overview */}
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Quick Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div className="p-3 bg-gray-50 rounded-md border text-sm">
              <div className="text-muted-foreground mb-1">Front Door</div>
              <div className={deviceStates.frontDoor === 'locked' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {deviceStates.frontDoor.toUpperCase()}
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md border text-sm">
              <div className="text-muted-foreground mb-1">Garage Door</div>
              <div className={deviceStates.garageDoor === 'closed' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {deviceStates.garageDoor.toUpperCase()}
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md border text-sm">
              <div className="text-muted-foreground mb-1">Alarm</div>
              <div className={deviceStates.alarm === 'armed' ? 'text-blue-600 font-medium' : 'text-gray-600 font-medium'}>
                {deviceStates.alarm.toUpperCase()}
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md border text-sm">
              <div className="text-muted-foreground mb-1">Temperature</div>
              <div className="text-orange-600 font-medium">
                {deviceStates.temperature}° F
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeView;
