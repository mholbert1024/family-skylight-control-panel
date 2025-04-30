
import React from 'react';
import { Button } from '@/components/ui/button';
import { LightbulbOff, Lightbulb, DoorClosed, DoorOpen, Warehouse, AlarmClock, ThermometerSun } from 'lucide-react';

const Footer: React.FC = () => {
  // These would be connected to Home Assistant in a real implementation
  const [lightsOn, setLightsOn] = React.useState(false);
  const [doorLocked, setDoorLocked] = React.useState(true);
  const [garageClosed, setGarageClosed] = React.useState(true);
  const [alarmOn, setAlarmOn] = React.useState(true);
  const [temperature, setTemperature] = React.useState(72);

  return (
    <div className="px-4 py-4 bg-white shadow-sm rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Home Controls</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <Button 
          variant="outline" 
          className={`h-20 w-full flex flex-col items-center justify-center ${lightsOn ? 'bg-amber-100' : ''}`}
          onClick={() => setLightsOn(!lightsOn)}
        >
          {lightsOn ? <Lightbulb className="h-6 w-6 text-amber-500 mb-2" /> : <LightbulbOff className="h-6 w-6 mb-2" />}
          {lightsOn ? 'Lights On' : 'Lights Off'}
        </Button>
        
        <Button 
          variant="outline" 
          className={`h-20 w-full flex flex-col items-center justify-center ${!doorLocked ? 'bg-red-50' : ''}`}
          onClick={() => setDoorLocked(!doorLocked)}
        >
          {doorLocked ? <DoorClosed className="h-6 w-6 text-green-500 mb-2" /> : <DoorOpen className="h-6 w-6 text-red-500 mb-2" />}
          {doorLocked ? 'Door Locked' : 'Door Unlocked'}
        </Button>
        
        <Button 
          variant="outline" 
          className={`h-20 w-full flex flex-col items-center justify-center ${!garageClosed ? 'bg-red-50' : ''}`}
          onClick={() => setGarageClosed(!garageClosed)}
        >
          <Warehouse className={`h-6 w-6 mb-2 ${garageClosed ? 'text-green-500' : 'text-red-500'}`} />
          {garageClosed ? 'Garage Closed' : 'Garage Open'}
        </Button>
        
        <Button 
          variant="outline" 
          className={`h-20 w-full flex flex-col items-center justify-center ${alarmOn ? 'bg-blue-50' : ''}`}
          onClick={() => setAlarmOn(!alarmOn)}
        >
          <AlarmClock className={`h-6 w-6 mb-2 ${alarmOn ? 'text-blue-500' : ''}`} />
          {alarmOn ? 'Alarm Active' : 'Alarm Off'}
        </Button>
        
        <div className="h-20 w-full flex flex-col items-center justify-center bg-gray-50 rounded-md border">
          <ThermometerSun className="h-6 w-6 text-orange-500 mb-1" />
          <div className="flex items-center">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0" 
              onClick={() => setTemperature(prev => prev - 1)}
            >
              -
            </Button>
            <span className="mx-2 text-lg font-medium">{temperature}°</span>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0" 
              onClick={() => setTemperature(prev => prev + 1)}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
