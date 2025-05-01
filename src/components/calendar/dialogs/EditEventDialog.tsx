
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventType } from '@/components/calendar/types/calendarTypes';
import { FamilyMember } from '@/services/familyService';
import { Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';

interface EditEventDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedEvent: EventType | null;
  setSelectedEvent: (event: EventType | null) => void;
  handleEditEvent: () => void;
  handleDeleteEvent: () => void;
  members: FamilyMember[];
}

const EditEventDialog: React.FC<EditEventDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedEvent,
  setSelectedEvent,
  handleEditEvent,
  handleDeleteEvent,
  members
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) setSelectedEvent(null);
      setIsOpen(open);
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
                value={selectedEvent.date instanceof Date ? format(selectedEvent.date, 'yyyy-MM-dd') : selectedEvent.date}
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
                  const memberColor = members.find(m => m.name === value)?.color || '#9b87f5';
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
            <Button variant="outline" onClick={() => setIsOpen(false)}>
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
  );
};

export default EditEventDialog;
