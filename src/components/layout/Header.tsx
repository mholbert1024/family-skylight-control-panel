
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Settings, Clock, Calendar as CalendarIcon, CloudSun } from 'lucide-react';
import { format } from 'date-fns';
import { useFamilyStore } from '@/services/familyService';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ThemeToggle from '../theme/ThemeToggle';

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
  const [weather, setWeather] = useState({ temp: '72°', condition: 'Sunny' });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

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
        
        {/* Centered weather */}
        <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 mx-auto md:mx-0">
          <CloudSun className="h-5 w-5 mr-1 text-blue-500" />
          <span className="text-md">{weather.temp} | {weather.condition}</span>
        </div>
        
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            {members.map((member) => (
              <Avatar key={member.id} className="h-8 w-8 border-2" style={{ borderColor: member.color }}>
                <AvatarFallback 
                  style={{ backgroundColor: member.color }}
                  className="text-white"
                >
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Admin
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      <nav className="mt-4">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="whitespace-nowrap"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
