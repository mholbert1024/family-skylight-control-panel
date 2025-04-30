
import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameDay, getWeeksInMonth } from 'date-fns';
import { EventType } from '@/components/calendar/types/calendarTypes';
import { useTheme } from '@/providers/ThemeProvider';

interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date;
  events: EventType[];
  handleDaySelect: (date: Date) => void;
  handleEventClick: (event: EventType) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  selectedDate,
  events,
  handleDaySelect,
  handleEventClick,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const startDateOfCalendar = startOfWeek(firstDayOfMonth);
  
  // Calculate if we need 5 or 6 weeks to display the month
  const weeksInMonth = getWeeksInMonth(currentDate);
  const rowsNeeded = weeksInMonth > 5 ? 6 : 5;
  
  // Create array of days to fill the calendar grid (5 or 6 weeks)
  const daysToDisplay = Array.from({ length: rowsNeeded * 7 }).map((_, i) => addDays(startDateOfCalendar, i));
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold p-4 dark:text-white">{format(currentDate, 'MMMM yyyy')}</h2>
      
      <div className="grid grid-cols-7 text-center border-b dark:border-gray-700">
        {weekDays.map(day => (
          <div key={day} className="p-2 font-semibold dark:text-white">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {daysToDisplay.map((date, i) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(date, new Date());
          const isSelected = isSameDay(date, selectedDate);
          const dayEvents = events.filter(event => isSameDay(event.date, date));
          const hasEvents = dayEvents.length > 0;
          
          return (
            <div 
              key={i} 
              onClick={() => handleDaySelect(date)}
              className={`h-24 p-1 border-r border-b dark:border-gray-700 last:border-r-0 relative cursor-pointer
                ${!isCurrentMonth ? 'opacity-40 bg-gray-50 dark:bg-gray-700/50' : ''}
                ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                ${isSelected ? 'bg-blue-100 dark:bg-blue-900/40' : ''}
                hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors
              `}
            >
              {/* Date number in the upper right corner */}
              <div className="flex justify-end">
                <div className={`text-md font-medium rounded-full w-7 h-7 flex items-center justify-center
                  ${isToday ? 'bg-blue-500 text-white' : 'dark:text-white'}
                `}>
                  {format(date, 'd')}
                </div>
              </div>
              
              {hasEvents && (
                <div className="mt-1 overflow-hidden max-h-14">
                  {dayEvents.slice(0, 2).map(event => (
                    <div 
                      key={event.id}
                      className="flex items-center text-sm mb-1 cursor-pointer hover:opacity-90 rounded px-1 overflow-hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      {/* Time in grey on the left */}
                      <span className="text-gray-500 dark:text-gray-400 text-xs mr-1 whitespace-nowrap">
                        {event.startTime}
                      </span>
                      
                      {/* Event title with color background */}
                      <div 
                        className={`flex-1 truncate rounded px-1 py-0.5 text-sm font-medium ${
                          isDark ? 'text-black' : 'text-black'
                        }`}
                        style={{ 
                          backgroundColor: event.color
                        }}
                      >
                        {event.title}
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
