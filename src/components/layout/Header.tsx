
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, CheckSquare, Home, ShoppingCart } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white shadow-sm rounded-lg mb-4">
      <div className="flex flex-col items-center md:items-start">
        <h1 className="text-3xl font-bold">{format(currentTime, 'h:mm a')}</h1>
        <p className="text-muted-foreground">{format(currentTime, 'EEEE, MMMM do, yyyy')}</p>
      </div>
      
      <div className="flex mt-4 md:mt-0 space-x-2 overflow-x-auto pb-2 md:pb-0">
        <Button 
          variant={activeTab === 'calendar' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Calendar
        </Button>
        <Button 
          variant={activeTab === 'tasks' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('tasks')}
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          Tasks
        </Button>
        <Button 
          variant={activeTab === 'shopping' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('shopping')}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Shopping
        </Button>
        <Button 
          variant={activeTab === 'home' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('home')}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>
    </div>
  );
};

export default Header;
