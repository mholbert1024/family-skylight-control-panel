
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CalendarView from '@/components/calendar/CalendarView';
import TasksView from '@/components/tasks/TasksView';
import ShoppingListView from '@/components/shopping/ShoppingListView';
import HomeView from '@/components/home/HomeView';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  // Render the active tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return (
          <div className="flex flex-col space-y-4">
            <CalendarView />
            <Footer />
          </div>
        );
      case 'tasks':
        return <TasksView />;
      case 'shopping':
        return <ShoppingListView />;
      case 'home':
        return <HomeView />;
      default:
        return (
          <div className="flex flex-col space-y-4">
            <CalendarView />
            <Footer />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 my-4">
          {renderContent()}
        </div>
        
        {/* Footer moved inside calendar view for calendar tab only */}
        {activeTab !== 'calendar' && <Footer />}
      </div>
    </div>
  );
};

export default Index;
