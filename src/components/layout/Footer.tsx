
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
    <div className="px-4 py-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Home Controls</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <Button 
          variant="outline" 
          className="h-20 w-full flex flex-col items-center justify-center border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          onClick={() => setLightsOn(!lightsOn)}
        >
          {lightsOn ? (
            <Lightbulb className="h-6 w-6 text-amber-500 mb-2" />
          ) : (
            <LightbulbOff className="h-6 w-6 text-gray-400 dark:text-gray-500 mb-2" />
          )}
          {lightsOn ? 'Lights On' : 'Lights Off'}
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 w-full flex flex-col items-center justify-center border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          onClick={() => setDoorLocked(!doorLocked)}
        >
          {doorLocked ? (
            <DoorClosed className="h-6 w-6 text-green-500 mb-2" />
          ) : (
            <DoorOpen className="h-6 w-6 text-red-500 mb-2" />
          )}
          {doorLocked ? 'Door Locked' : 'Door Unlocked'}
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 w-full flex flex-col items-center justify-center border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          onClick={() => setGarageClosed(!garageClosed)}
        >
          <Warehouse className={`h-6 w-6 mb-2 ${garageClosed ? 'text-green-500' : 'text-red-500'}`} />
          {garageClosed ? 'Garage Closed' : 'Garage Open'}
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 w-full flex flex-col items-center justify-center border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          onClick={() => setAlarmOn(!alarmOn)}
        >
          <AlarmClock className={`h-6 w-6 mb-2 ${alarmOn ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} />
          {alarmOn ? 'Alarm Active' : 'Alarm Off'}
        </Button>
        
        <div className="h-20 w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md border dark:border-gray-700">
          <ThermometerSun className="h-6 w-6 text-orange-500 mb-1" />
          <div className="flex items-center">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0 dark:text-gray-300" 
              onClick={() => setTemperature(prev => prev - 1)}
            >
              -
            </Button>
            <span className="mx-2 text-lg font-medium dark:text-gray-200">{temperature}°</span>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0 dark:text-gray-300" 
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
