
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Clock, Calendar as CalendarIcon, CloudSun } from 'lucide-react';
import { format } from 'date-fns';
import { useFamilyStore } from '@/services/familyService';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ThemeToggle from '../theme/ThemeToggle';
import WeatherForecast from '../weather/WeatherForecast';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'calendar', label: 'Calendar' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'shopping', label: 'Shopping List' },
    { id: 'home', label: 'Home Control' },
  ];

  const { members } = useFamilyStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState({ temp: '72°', condition: 'Sunny' });
  const [showForecast, setShowForecast] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Function to close forecast when clicked outside
  const handleDocumentClick = (e: MouseEvent) => {
    // Check if the click is outside the forecast element
    const forecastElement = document.getElementById('weather-forecast');
    const weatherTrigger = document.getElementById('weather-trigger');
    
    if (forecastElement && 
        !forecastElement.contains(e.target as Node) && 
        weatherTrigger && 
        !weatherTrigger.contains(e.target as Node)) {
      setShowForecast(false);
    }
  };

  // Add document click listener when forecast is shown
  useEffect(() => {
    if (showForecast) {
      document.addEventListener('mousedown', handleDocumentClick);
    } else {
      document.removeEventListener('mousedown', handleDocumentClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [showForecast]);

  return (
    <header className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center">
          {/* Updated time and date with larger time */}
          <div className="flex items-center gap-4">
            <div className="flex items-center text-gray-700 dark:text-gray-200">
              <Clock className="h-5 w-5 mr-1" />
              <span className="text-xl font-bold">{format(currentTime, 'h:mm a')}</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span className="text-md">{format(currentTime, 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
        
        {/* Weather - clickable with forecast popup */}
        <div 
          id="weather-trigger"
          className="flex items-center justify-center text-gray-600 dark:text-gray-300 mx-auto md:mx-0 cursor-pointer relative"
          onClick={() => setShowForecast(!showForecast)}
        >
          <CloudSun className="h-5 w-5 mr-1 text-blue-500" />
          <span className="text-md">{weatherData.temp} | {weatherData.condition}</span>
          
          {showForecast && <WeatherForecast />}
        </div>
        
        <div className="flex items-center justify-end gap-4 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link to="/admin" title="Admin Settings">
              <Settings className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex md:flex-row items-center justify-between">
        <nav className="flex-1">
          <div className="flex space-x-1 overflow-x-auto justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
        
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          {members.map((member) => (
            <Avatar key={member.id} className="h-[2.5rem] w-[2.5rem] border-2" style={{ borderColor: member.color }}>
              <AvatarFallback 
                style={{ backgroundColor: member.color }}
                className="text-white"
              >
                {member.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
