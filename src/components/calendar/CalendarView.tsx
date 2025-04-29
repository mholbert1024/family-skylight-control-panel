
import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, getDay, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';

// Mock calendar data - this would come from Google Calendar/CalDAV in real implementation
const mockEvents = [
  { 
    id: 1, 
    title: 'Soccer Practice', 
    date: new Date(), 
    startTime: '15:30', 
    endTime: '17:00', 
    person: 'Jimmy', 
    category: 'sports',
    color: 'bg-family-blue' 
  },
  { 
    id: 2, 
    title: 'Dentist Appointment', 
    date: new Date(), 
    startTime: '10:00', 
    endTime: '11:00', 
    person: 'Lisa', 
    category: 'health',
    color: 'bg-family-pink' 
  },
  { 
    id: 3, 
    title: 'Work Meeting', 
    date: addDays(new Date(), 1), 
    startTime: '14:00', 
    endTime: '15:00', 
    person: 'Mom', 
    category: 'work',
    color: 'bg-family-purple' 
  },
  { 
    id: 4, 
    title: 'School Project', 
    date: addDays(new Date(), 2), 
    startTime: '09:00', 
    endTime: '12:00', 
    person: 'Emma', 
    category: 'education',
    color: 'bg-family-orange' 
  }
];

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [events, setEvents] = useState(mockEvents);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    person: 'Mom',
    category: 'general',
    color: 'bg-family-purple'
  });

  const handleAddEvent = () => {
    const eventDate = new Date(newEvent.date);
    const event = {
      id: events.length + 1,
      title: newEvent.title,
      date: eventDate,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      person: newEvent.person,
      category: newEvent.category,
      color: getColorForPerson(newEvent.person)
    };
    
    setEvents([...events, event]);
    setIsAddEventOpen(false);
    setNewEvent({
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      person: 'Mom',
      category: 'general',
      color: 'bg-family-purple'
    });
  };

  const getColorForPerson = (person: string) => {
    const colorMap: {[key: string]: string} = {
      'Mom': 'bg-family-purple',
      'Dad': 'bg-family-blue',
      'Jimmy': 'bg-family-blue',
      'Lisa': 'bg-family-pink',
      'Emma': 'bg-family-orange',
      'All': 'bg-family-green',
      'Grayson': 'bg-family-blue',
    };
    return colorMap[person] || 'bg-gray-400';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Handle selecting a specific day
  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    setView('day');
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
                className={`p-3 rounded-md ${event.color} text-white`}
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
        <div className="grid grid-cols-7 text-center border-b">
          {weekDays.map((day, i) => (
            <div key={day} className="p-2 font-semibold">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {weekDates.map((date, i) => {
            const dayEvents = events.filter(event => isSameDay(event.date, date));
            const isCurrentDay = isSameDay(date, new Date());
            const isSelectedDay = isSameDay(date, selectedDate);
            
            return (
              <div 
                key={i} 
                onClick={() => handleDaySelect(date)}
                className={`min-h-[120px] p-2 border-r last:border-r-0 border-b cursor-pointer transition-colors hover:bg-blue-50 ${
                  isCurrentDay ? 'bg-blue-50' : ''
                } ${
                  isSelectedDay ? 'bg-blue-100' : ''
                }`}
              >
                <div className={`text-sm mb-1 font-medium ${isCurrentDay ? 'text-blue-600' : ''}`}>
                  {format(date, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id} 
                      className={`text-xs p-1 rounded ${event.color} text-white truncate`}
                      title={`${event.title} (${event.startTime}-${event.endTime})`}
                    >
                      {event.startTime} {event.title}
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
                        className={`text-[0.65rem] truncate rounded px-1 ${event.color} text-white mb-0.5`}
                        title={event.title}
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
                  onValueChange={(value) => setNewEvent({...newEvent, person: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mom">Mom</SelectItem>
                    <SelectItem value="Dad">Dad</SelectItem>
                    <SelectItem value="Jimmy">Jimmy</SelectItem>
                    <SelectItem value="Lisa">Lisa</SelectItem>
                    <SelectItem value="Emma">Emma</SelectItem>
                    <SelectItem value="Grayson">Grayson</SelectItem>
                    <SelectItem value="All">All Family</SelectItem>
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
      </div>
      
      {view === 'day' && renderDayView()}
      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}
      
      <div className="mt-4">
        <h3 className="font-medium mb-2">Family Members</h3>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-family-purple">Mom</Badge>
          <Badge className="bg-family-blue">Dad</Badge>
          <Badge className="bg-family-blue">Jimmy</Badge>
          <Badge className="bg-family-blue">Grayson</Badge>
          <Badge className="bg-family-pink">Lisa</Badge>
          <Badge className="bg-family-orange">Emma</Badge>
          <Badge className="bg-family-green">All Family</Badge>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
