
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, CloudRain, Sun, CloudSnow, CloudLightning, X } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface WeatherForecastProps {
  onClose: () => void;
}

// Mock weather data - this would come from a weather API in real implementation
const mockWeatherData = [
  { 
    date: new Date(), 
    condition: 'Sunny',
    highTemp: 78,
    lowTemp: 62,
    precipitation: '0%'
  },
  { 
    date: addDays(new Date(), 1), 
    condition: 'Partly Cloudy',
    highTemp: 76,
    lowTemp: 60,
    precipitation: '10%'
  },
  { 
    date: addDays(new Date(), 2), 
    condition: 'Rain',
    highTemp: 68,
    lowTemp: 58,
    precipitation: '80%'
  },
  { 
    date: addDays(new Date(), 3), 
    condition: 'Cloudy',
    highTemp: 72,
    lowTemp: 61,
    precipitation: '30%'
  },
  { 
    date: addDays(new Date(), 4), 
    condition: 'Sunny',
    highTemp: 80,
    lowTemp: 65,
    precipitation: '0%'
  },
  { 
    date: addDays(new Date(), 5), 
    condition: 'Partly Cloudy',
    highTemp: 75,
    lowTemp: 63,
    precipitation: '20%'
  },
  { 
    date: addDays(new Date(), 6), 
    condition: 'Sunny',
    highTemp: 79,
    lowTemp: 64,
    precipitation: '0%'
  }
];

const WeatherIcon: React.FC<{ condition: string }> = ({ condition }) => {
  switch (condition.toLowerCase()) {
    case 'rain':
      return <CloudRain className="h-6 w-6 text-blue-500" />;
    case 'sunny':
      return <Sun className="h-6 w-6 text-yellow-500" />;
    case 'snow':
      return <CloudSnow className="h-6 w-6 text-slate-300" />;
    case 'thunderstorm':
      return <CloudLightning className="h-6 w-6 text-purple-500" />;
    case 'partly cloudy':
    case 'cloudy':
    default:
      return <CloudSun className="h-6 w-6 text-blue-500" />;
  }
};

const WeatherForecast: React.FC<WeatherForecastProps> = ({ onClose }) => {
  return (
    <Card className="absolute top-full mt-2 right-0 z-50 w-72 shadow-lg p-0 bg-white dark:bg-gray-800">
      <CardHeader className="pb-2 px-4 pt-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base">7-Day Weather Forecast</CardTitle>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <X className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent className="px-3 py-2">
        <div className="space-y-3">
          {mockWeatherData.map((day, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <WeatherIcon condition={day.condition} />
                <div>
                  <p className="text-sm font-medium dark:text-gray-200">
                    {index === 0 ? 'Today' : format(day.date, 'EEE')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {format(day.date, 'MMM d')}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium dark:text-gray-200">
                  {day.highTemp}° / {day.lowTemp}°
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {day.precipitation} precip
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
