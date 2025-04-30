
import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, getDay, startOfMonth, endOfMonth, addMonths, subMonths, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Plus, Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/components/ui/use-toast';
import { useFamilyStore } from '@/services/familyService';

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
  const [events, setEvents] = useState(mockEvents);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const { members } = useFamilyStore();
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    person: members.length > 0 ? members[0].name : '',
    category: 'general',
    color: members.length > 0 ? members[0].color : '#9b87f5'
  });

  const handleAddEvent = () => {
    const eventDate = parseISO(newEvent.date); // Fix date parsing issue
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

  const handleEventClick = (event: any) => {
    setSelectedEvent({
      ...event,
      date: format(event.date, 'yyyy-MM-dd')
    });
    setIsEditEventOpen(true);
  };

  const getColorForPerson = (personName: string) => {
    const member = members.find(m => m.name === personName);
    return member ? member.color : '#9b87f5'; // Default color if not found
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Handle selecting a specific day
  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    setView('day');
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

  const renderDayView = () => {
    const todaysEvents = events.filter(event => 
      isSameDay(event.date, selectedDate)
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">{format(selectedDate, 'MMMM d, yyyy')}</h2>
        
        <div className="space-y-2">
          {todaysEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No events scheduled for this day</p>
          ) : (
            todaysEvents.map(event => (
              <div 
                key={event.id} 
                className="p-3 rounded-md text-white cursor-pointer hover:opacity-90"
                style={{ backgroundColor: event.color }}
                onClick={() => handleEventClick(event)}
              >
                <div className="font-semibold">{event.title}</div>
                <div className="text-sm opacity-90">{event.startTime} - {event.endTime}</div>
                <div className="text-sm opacity-90">{event.person}</div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate);
    const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
    
    return (
      <div className="bg-white rounded-lg shadow">
        {/* Week view header with day names and dates */}
        <div className="grid grid-cols-7 border-b">
          {weekDates.map((date, i) => {
            const isToday = isSameDay(date, new Date());
            const dayEvents = events.filter(event => isSameDay(event.date, date));
            
            return (
              <div 
                key={i} 
                className={`p-3 text-center border-r last:border-r-0 ${isToday ? 'bg-blue-50' : ''}`}
                onClick={() => handleDaySelect(date)}
              >
                <div className="text-sm text-gray-500">{format(date, 'EEE')}</div>
                <div className={`text-xl font-medium ${isToday ? 'text-blue-600' : ''}`}>{format(date, 'd')}</div>
                <div className="text-xs text-gray-400">{dayEvents.length} events</div>
                <button 
                  className="mt-1 text-xs text-blue-500 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDate(date);
                    setNewEvent({...newEvent, date: format(date, 'yyyy-MM-dd')});
                    setIsAddEventOpen(true);
                  }}
                >
                  + Add Event
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Week view content with events */}
        <div className="flex min-h-[400px] max-h-[calc(100vh-300px)]">
          {weekDates.map((date, i) => {
            const dayEvents = events.filter(event => isSameDay(event.date, date));
            const isToday = isSameDay(date, new Date());
            const isSelectedDay = isSameDay(date, selectedDate);
            
            return (
              <div 
                key={i} 
                onClick={() => handleDaySelect(date)}
                className={`flex-1 border-r last:border-r-0 flex flex-col ${
                  isToday ? 'bg-blue-50' : ''
                } ${
                  isSelectedDay ? 'bg-blue-100' : ''
                }`}
              >
                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {dayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(event => (
                    <div 
                      key={event.id} 
                      className="p-2 rounded text-white cursor-pointer hover:opacity-90"
                      style={{ backgroundColor: event.color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      <div className="text-xs">{event.startTime} - {event.endTime}</div>
                      <div className="font-medium">{event.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderMonthView = () => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const startDateOfCalendar = startOfWeek(firstDayOfMonth);
    
    // Create array of 42 days (6 weeks) to ensure we have enough days to fill the calendar grid
    const daysToDisplay = Array.from({ length: 42 }).map((_, i) => addDays(startDateOfCalendar, i));
    
    return (
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold p-4">{format(currentDate, 'MMMM yyyy')}</h2>
        
        <div className="grid grid-cols-7 text-center border-b">
          {weekDays.map(day => (
            <div key={day} className="p-2 font-semibold">{day}</div>
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
                className={`h-24 p-1 border-r border-b last:border-r-0 relative cursor-pointer
                  ${!isCurrentMonth ? 'opacity-40 bg-gray-50' : ''}
                  ${isToday ? 'bg-blue-50' : ''}
                  ${isSelected ? 'bg-blue-100' : ''}
                  hover:bg-blue-50 transition-colors
                `}
              >
                <div className={`text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center
                  ${isToday ? 'bg-blue-500 text-white' : ''}
                `}>
                  {format(date, 'd')}
                </div>
                
                {hasEvents && (
                  <div className="mt-1 overflow-hidden max-h-14">
                    {dayEvents.slice(0, 2).map(event => (
                      <div 
                        key={event.id}
                        className="text-[0.65rem] truncate rounded px-1 text-white mb-0.5 cursor-pointer hover:opacity-90"
                        style={{ backgroundColor: event.color }}
                        title={event.title}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[0.65rem] text-gray-500">
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
        
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input 
                  id="title" 
                  value={newEvent.title} 
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Enter event title" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input 
                    id="startTime" 
                    type="time" 
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input 
                    id="endTime" 
                    type="time" 
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="person">Person</Label>
                <Select 
                  value={newEvent.person} 
                  onValueChange={handlePersonChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map(member => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newEvent.category} 
                  onValueChange={(value) => setNewEvent({...newEvent, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent} disabled={newEvent.title === ''}>
                Add Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Edit Event Dialog */}
        <Dialog open={isEditEventOpen} onOpenChange={(open) => {
          if (!open) setSelectedEvent(null);
          setIsEditEventOpen(open);
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Event Title</Label>
                  <Input 
                    id="edit-title" 
                    value={selectedEvent.title} 
                    onChange={(e) => setSelectedEvent({...selectedEvent, title: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input 
                    id="edit-date" 
                    type="date" 
                    value={selectedEvent.date}
                    onChange={(e) => setSelectedEvent({...selectedEvent, date: e.target.value})} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-startTime">Start Time</Label>
                    <Input 
                      id="edit-startTime" 
                      type="time" 
                      value={selectedEvent.startTime}
                      onChange={(e) => setSelectedEvent({...selectedEvent, startTime: e.target.value})} 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-endTime">End Time</Label>
                    <Input 
                      id="edit-endTime" 
                      type="time" 
                      value={selectedEvent.endTime}
                      onChange={(e) => setSelectedEvent({...selectedEvent, endTime: e.target.value})} 
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-person">Person</Label>
                  <Select 
                    value={selectedEvent.person} 
                    onValueChange={(value) => {
                      const memberColor = getColorForPerson(value);
                      setSelectedEvent({
                        ...selectedEvent, 
                        person: value,
                        color: memberColor
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select person" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map(member => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={selectedEvent.category} 
                    onValueChange={(value) => setSelectedEvent({...selectedEvent, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button variant="destructive" onClick={handleDeleteEvent}>
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditEventOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditEvent}>
                  <Edit className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {view === 'day' && renderDayView()}
      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}
    </div>
  );
};

export default CalendarView;
