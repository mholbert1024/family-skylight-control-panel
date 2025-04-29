
import React from 'react';
import { 
  Lightbulb, 
  ThermometerSun, 
  DoorClosed, 
  Warehouse, 
  AlarmClock,
  House,
  Power
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
      
      {/* Mushroom-style cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Lighting controls as mushroom cards */}
        <Card className="relative overflow-hidden group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <button 
            className="absolute top-0 right-0 bottom-0 left-0 z-10"
            onClick={() => toggleDevice('livingRoomLights')}
            aria-label="Toggle Living Room Lights"
          />
          <CardContent className="p-4 flex flex-col items-center">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${deviceStates.livingRoomLights ? 'bg-amber-100' : 'bg-gray-100'}`}>
              <Lightbulb 
                className={`h-6 w-6 ${deviceStates.livingRoomLights ? 'text-amber-500' : 'text-gray-400'}`} 
              />
            </div>
            <h3 className="text-sm font-medium">Living Room</h3>
            <span className="text-xs text-gray-500">{deviceStates.livingRoomLights ? 'On' : 'Off'}</span>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <button 
            className="absolute top-0 right-0 bottom-0 left-0 z-10"
            onClick={() => toggleDevice('kitchenLights')}
            aria-label="Toggle Kitchen Lights"
          />
          <CardContent className="p-4 flex flex-col items-center">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${deviceStates.kitchenLights ? 'bg-amber-100' : 'bg-gray-100'}`}>
              <Lightbulb 
                className={`h-6 w-6 ${deviceStates.kitchenLights ? 'text-amber-500' : 'text-gray-400'}`} 
              />
            </div>
            <h3 className="text-sm font-medium">Kitchen</h3>
            <span className="text-xs text-gray-500">{deviceStates.kitchenLights ? 'On' : 'Off'}</span>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <button 
            className="absolute top-0 right-0 bottom-0 left-0 z-10"
            onClick={() => toggleDevice('bedroomLights')}
            aria-label="Toggle Bedroom Lights"
          />
          <CardContent className="p-4 flex flex-col items-center">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${deviceStates.bedroomLights ? 'bg-amber-100' : 'bg-gray-100'}`}>
              <Lightbulb 
                className={`h-6 w-6 ${deviceStates.bedroomLights ? 'text-amber-500' : 'text-gray-400'}`} 
              />
            </div>
            <h3 className="text-sm font-medium">Bedrooms</h3>
            <span className="text-xs text-gray-500">{deviceStates.bedroomLights ? 'On' : 'Off'}</span>
          </CardContent>
        </Card>

        {/* Front door control */}
        <Card className="relative overflow-hidden group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <button 
            className="absolute top-0 right-0 bottom-0 left-0 z-10"
            onClick={() => toggleDevice('frontDoor', deviceStates.frontDoor === 'locked' ? 'unlocked' : 'locked')}
            aria-label="Toggle Front Door"
          />
          <CardContent className="p-4 flex flex-col items-center">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${deviceStates.frontDoor === 'locked' ? 'bg-green-100' : 'bg-red-100'}`}>
              <DoorClosed 
                className={`h-6 w-6 ${deviceStates.frontDoor === 'locked' ? 'text-green-600' : 'text-red-600'}`} 
              />
            </div>
            <h3 className="text-sm font-medium">Front Door</h3>
            <span className="text-xs text-gray-500 capitalize">{deviceStates.frontDoor}</span>
          </CardContent>
        </Card>

        {/* Garage door control */}
        <Card className="relative overflow-hidden group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <button 
            className="absolute top-0 right-0 bottom-0 left-0 z-10"
            onClick={() => toggleDevice('garageDoor', deviceStates.garageDoor === 'closed' ? 'open' : 'closed')}
            aria-label="Toggle Garage Door"
          />
          <CardContent className="p-4 flex flex-col items-center">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${deviceStates.garageDoor === 'closed' ? 'bg-green-100' : 'bg-red-100'}`}>
              <Warehouse 
                className={`h-6 w-6 ${deviceStates.garageDoor === 'closed' ? 'text-green-600' : 'text-red-600'}`} 
              />
            </div>
            <h3 className="text-sm font-medium">Garage Door</h3>
            <span className="text-xs text-gray-500 capitalize">{deviceStates.garageDoor}</span>
          </CardContent>
        </Card>

        {/* Alarm control */}
        <Card className="relative overflow-hidden group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <button 
            className="absolute top-0 right-0 bottom-0 left-0 z-10"
            onClick={() => toggleDevice('alarm', deviceStates.alarm === 'armed' ? 'disarmed' : 'armed')}
            aria-label="Toggle Alarm"
          />
          <CardContent className="p-4 flex flex-col items-center">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${deviceStates.alarm === 'armed' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <AlarmClock 
                className={`h-6 w-6 ${deviceStates.alarm === 'armed' ? 'text-blue-600' : 'text-gray-400'}`} 
              />
            </div>
            <h3 className="text-sm font-medium">Alarm System</h3>
            <span className="text-xs text-gray-500 capitalize">{deviceStates.alarm}</span>
          </CardContent>
        </Card>

        {/* Climate control */}
        <Card className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full mb-2 bg-orange-100">
              <ThermometerSun className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium">Temperature</h3>
            <div className="flex items-center gap-3 mt-1">
              <button 
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                onClick={() => toggleDevice('temperature', deviceStates.temperature - 1)}
              >
                -
              </button>
              <span className="text-lg font-medium">{deviceStates.temperature}°</span>
              <button 
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                onClick={() => toggleDevice('temperature', deviceStates.temperature + 1)}
              >
                +
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Power toggle */}
        <Card className="relative overflow-hidden group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <button 
            className="absolute top-0 right-0 bottom-0 left-0 z-10"
            onClick={() => {
              toggleDevice('livingRoomLights', false);
              toggleDevice('kitchenLights', false);
              toggleDevice('bedroomLights', false);
            }}
            aria-label="All Lights Off"
          />
          <CardContent className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full mb-2 bg-gray-100">
              <Power className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="text-sm font-medium">All Lights</h3>
            <span className="text-xs text-gray-500">Turn off</span>
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
