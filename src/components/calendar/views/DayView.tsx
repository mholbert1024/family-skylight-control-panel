
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { EventType } from '@/components/calendar/types/calendarTypes';

interface DayViewProps {
  selectedDate: Date;
  events: EventType[];
  handleEventClick: (event: EventType) => void;
}

const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  events,
  handleEventClick,
}) => {
  const todaysEvents = events.filter(event => 
    isSameDay(event.date, selectedDate)
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">{format(selectedDate, 'MMMM d, yyyy')}</h2>
      
      <div className="space-y-2">
        {todaysEvents.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No events scheduled for this day</p>
        ) : (
          todaysEvents.map(event => (
            <div 
              key={event.id} 
              className="p-3 rounded-md cursor-pointer hover:opacity-90"
              style={{ 
                backgroundColor: event.color
              }}
              onClick={() => handleEventClick(event)}
            >
              <div className="font-semibold text-black">{event.title}</div>
              <div className="text-sm text-black opacity-90">{event.startTime} - {event.endTime}</div>
              <div className="text-sm text-black opacity-90">{event.person}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DayView;
