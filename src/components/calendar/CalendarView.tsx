
import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, startOfMonth, endOfMonth, addMonths, subMonths, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useFamilyStore } from '@/services/familyService';

import DayView from './views/DayView';
import WeekView from './views/WeekView';
import MonthView from './views/MonthView';
import AddEventDialog from './dialogs/AddEventDialog';
import EditEventDialog from './dialogs/EditEventDialog';
import { EventType, defaultEventFormData } from './types/calendarTypes';

// Mock calendar data - this would come from Google Calendar/CalDAV in real implementation
const mockEvents = [
  { 
    id: 1, 
    title: 'Soccer Practice', 
    date: new Date(), 
    startTime: '15:30', 
    endTime: '17:00', 
    person: 'Grayson', 
    category: 'sports',
    color: '#9b87f5' 
  },
  { 
    id: 2, 
    title: 'Dentist Appointment', 
    date: new Date(), 
    startTime: '10:00', 
    endTime: '11:00', 
    person: 'Mom', 
    category: 'health',
    color: '#D3E4FD' 
  },
  { 
    id: 3, 
    title: 'Work Meeting', 
    date: addDays(new Date(), 1), 
    startTime: '14:00', 
    endTime: '15:00', 
    person: 'Mom', 
    category: 'work',
    color: '#D3E4FD' 
  },
  { 
    id: 4, 
    title: 'School Project', 
    date: addDays(new Date(), 2), 
    startTime: '09:00', 
    endTime: '12:00', 
    person: 'Dad', 
    category: 'education',
    color: '#FFDEE2' 
  }
];

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [events, setEvents] = useState<EventType[]>(mockEvents);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const { members } = useFamilyStore();
  const [newEvent, setNewEvent] = useState(defaultEventFormData());

  // Initialize with first family member if available
  React.useEffect(() => {
    if (members.length > 0 && !newEvent.person) {
      setNewEvent(prev => ({
        ...prev, 
        person: members[0].name,
        color: members[0].color
      }));
    }
  }, [members]);

  const handleAddEvent = () => {
    const eventDate = parseISO(newEvent.date); 
    const memberColor = getColorForPerson(newEvent.person);
    
    const event = {
      id: events.length + 1,
      title: newEvent.title,
      date: eventDate,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      person: newEvent.person,
      category: newEvent.category,
      color: memberColor
    };
    
    setEvents([...events, event]);
    setIsAddEventOpen(false);
    setNewEvent({
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      person: members.length > 0 ? members[0].name : '',
      category: 'general',
      color: members.length > 0 ? members[0].color : '#9b87f5'
    });
    
    toast({
      title: "Event Added",
      description: `${event.title} has been added to the calendar.`,
    });
  };

  const handleEditEvent = () => {
    if (!selectedEvent) return;
    
    let eventDate;
    try {
      eventDate = typeof selectedEvent.date === 'string' 
        ? parseISO(selectedEvent.date) 
        : selectedEvent.date;
    } catch (error) {
      console.error("Date parsing error:", error);
      eventDate = new Date();
    }
    
    const memberColor = getColorForPerson(selectedEvent.person);
    
    const updatedEvents = events.map(event => 
      event.id === selectedEvent.id 
        ? {
            ...selectedEvent,
            date: eventDate,
            color: memberColor
          }
        : event
    );
    
    setEvents(updatedEvents);
    setIsEditEventOpen(false);
    setSelectedEvent(null);
    
    toast({
      title: "Event Updated",
      description: `${selectedEvent.title} has been updated.`,
    });
  };
  
  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    
    const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
    setEvents(updatedEvents);
    setIsEditEventOpen(false);
    setSelectedEvent(null);
    
    toast({
      title: "Event Deleted",
      description: `${selectedEvent.title} has been removed from the calendar.`,
    });
  };

  const handleEventClick = (event: EventType) => {
    setSelectedEvent({
      ...event,
      date: event.date instanceof Date ? format(event.date, 'yyyy-MM-dd') : event.date
    });
    setIsEditEventOpen(true);
  };

  const getColorForPerson = (personName: string) => {
    const member = members.find(m => m.name === personName);
    return member ? member.color : '#9b87f5'; // Default color if not found
  };
  
  // Handle selecting a specific day
  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    setView('day');
  };
  
  // Handle week change
  const handleNextWeek = () => {
    setCurrentDate(prev => addWeeks(prev, 1));
  };
  
  // Handle person change in events
  const handlePersonChange = (person: string) => {
    const memberColor = getColorForPerson(person);
    setNewEvent({
      ...newEvent,
      person,
      color: memberColor
    });
  };

  // Navigation functions
  const previousPeriod = () => {
    switch (view) {
      case 'day':
        setCurrentDate(prev => addDays(prev, -1));
        setSelectedDate(prev => addDays(prev, -1));
        break;
      case 'week':
        setCurrentDate(prev => subWeeks(prev, 1));
        break;
      case 'month':
        setCurrentDate(prev => subMonths(prev, 1));
        break;
    }
  };
  
  const nextPeriod = () => {
    switch (view) {
      case 'day':
        setCurrentDate(prev => addDays(prev, 1));
        setSelectedDate(prev => addDays(prev, 1));
        break;
      case 'week':
        setCurrentDate(prev => addWeeks(prev, 1));
        break;
      case 'month':
        setCurrentDate(prev => addMonths(prev, 1));
        break;
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <Button variant="ghost" size="sm" onClick={() => {
            setCurrentDate(new Date());
            setSelectedDate(new Date());
          }}>
            Today
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="icon" onClick={previousPeriod}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" onClick={nextPeriod}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex space-x-1">
          <Button 
            variant={view === 'day' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('day')}
          >
            Day
          </Button>
          <Button 
            variant={view === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('week')}
          >
            Week
          </Button>
          <Button 
            variant={view === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('month')}
          >
            Month
          </Button>
        </div>
        
        <Button onClick={() => setIsAddEventOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Event
        </Button>
      </div>
      
      {/* Render the appropriate view based on the selected view type */}
      {view === 'day' && (
        <DayView 
          selectedDate={selectedDate} 
          events={events} 
          handleEventClick={handleEventClick} 
        />
      )}
      
      {view === 'week' && (
        <WeekView 
          currentDate={currentDate}
          selectedDate={selectedDate}
          events={events}
          handleDaySelect={handleDaySelect}
          handleEventClick={handleEventClick}
          handleNextWeek={handleNextWeek}
        />
      )}
      
      {view === 'month' && (
        <MonthView 
          currentDate={currentDate}
          selectedDate={selectedDate}
          events={events}
          handleDaySelect={handleDaySelect}
          handleEventClick={handleEventClick}
        />
      )}
      
      {/* Add Event Dialog */}
      <AddEventDialog 
        isOpen={isAddEventOpen}
        setIsOpen={setIsAddEventOpen}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
        members={members}
        handlePersonChange={handlePersonChange}
      />
      
      {/* Edit Event Dialog */}
      <EditEventDialog 
        isOpen={isEditEventOpen}
        setIsOpen={setIsEditEventOpen}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        handleEditEvent={handleEditEvent}
        handleDeleteEvent={handleDeleteEvent}
        members={members}
      />
    </div>
  );
};

export default CalendarView;
