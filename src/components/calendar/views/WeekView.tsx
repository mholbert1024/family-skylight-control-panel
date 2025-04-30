
import React from 'react';
import { format, addDays, startOfWeek, addWeeks, isSameDay } from 'date-fns';
import { EventType } from '@/components/calendar/types/calendarTypes';

interface WeekViewProps {
  currentDate: Date;
  selectedDate: Date;
  events: EventType[];
  handleDaySelect: (date: Date) => void;
  handleEventClick: (event: EventType) => void;
  handleNextWeek: () => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  selectedDate,
  events,
  handleDaySelect,
  handleEventClick,
  handleNextWeek,
}) => {
  const startDate = startOfWeek(currentDate);
  
  // Create the 7-day grid with 4 days on top and 3 days on bottom
  const topRowDates = Array.from({ length: 4 }).map((_, i) => addDays(startDate, i));
  const bottomRowDates = Array.from({ length: 3 }).map((_, i) => addDays(startDate, i + 4));
  const nextWeekStart = addWeeks(startDate, 1);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Week view header with column layout - 4 columns on top */}
      <div className="grid grid-cols-4">
        {topRowDates.map((date, i) => {
          const isToday = isSameDay(date, new Date());
          const dayEvents = events.filter(event => isSameDay(event.date, date));
          
          return (
            <div 
              key={i} 
              className={`p-3 text-left border-r dark:border-gray-700 last:border-r-0 ${
                isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => handleDaySelect(date)}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold dark:text-white">{format(date, 'EEE')}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{format(date, 'd')}</span>
              </div>
              <div className="text-xs text-gray-400">{dayEvents.length} events</div>
            </div>
          );
        })}
      </div>
      
      {/* Week view content with events - 4 columns */}
      <div className="grid grid-cols-4 min-h-[250px] max-h-[300px] border-b dark:border-gray-700">
        {topRowDates.map((date, i) => {
          const dayEvents = events.filter(event => isSameDay(event.date, date));
          const isToday = isSameDay(date, new Date());
          const isSelectedDay = isSameDay(date, selectedDate);
          
          return (
            <div 
              key={i} 
              onClick={() => handleDaySelect(date)}
              className={`border-r dark:border-gray-700 last:border-r-0 flex flex-col ${
                isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              } ${
                isSelectedDay ? 'bg-blue-100 dark:bg-blue-900/40' : ''
              }`}
            >
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {dayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(event => (
                  <div 
                    key={event.id} 
                    className="p-2 rounded text-black cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: event.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                  >
                    <div className="text-xs opacity-75">{event.startTime} - {event.endTime}</div>
                    <div className="font-medium">{event.title}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Bottom row - 3 columns + next week info */}
      <div className="grid grid-cols-4">
        {bottomRowDates.map((date, i) => {
          const isToday = isSameDay(date, new Date());
          const dayEvents = events.filter(event => isSameDay(event.date, date));
          
          return (
            <div 
              key={i} 
              className={`p-3 text-left border-r dark:border-gray-700 ${
                isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => handleDaySelect(date)}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold dark:text-white">{format(date, 'EEE')}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{format(date, 'd')}</span>
              </div>
              <div className="text-xs text-gray-400">{dayEvents.length} events</div>
            </div>
          );
        })}
        
        {/* Next week preview cell */}
        <div 
          className="p-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50" 
          onClick={handleNextWeek}
        >
          <div className="text-lg font-bold dark:text-white">Next Week</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {format(nextWeekStart, 'MMM d')} - {format(addDays(nextWeekStart, 6), 'MMM d')}
          </div>
        </div>
      </div>
      
      {/* Bottom row event content - 3 columns + next week */}
      <div className="grid grid-cols-4 min-h-[250px] max-h-[300px]">
        {bottomRowDates.map((date, i) => {
          const dayEvents = events.filter(event => isSameDay(event.date, date));
          const isToday = isSameDay(date, new Date());
          const isSelectedDay = isSameDay(date, selectedDate);
          
          return (
            <div 
              key={i} 
              onClick={() => handleDaySelect(date)}
              className={`border-r dark:border-gray-700 flex flex-col ${
                isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              } ${
                isSelectedDay ? 'bg-blue-100 dark:bg-blue-900/40' : ''
              }`}
            >
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {dayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(event => (
                  <div 
                    key={event.id} 
                    className="p-2 rounded text-black cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: event.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                  >
                    <div className="text-xs opacity-75">{event.startTime} - {event.endTime}</div>
                    <div className="font-medium">{event.title}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Next week preview content */}
        <div 
          className="p-2 bg-gray-50 dark:bg-gray-700/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={handleNextWeek}
        >
          {/* This cell can be used to show preview of next week's events */}
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            Click to view next week
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;
