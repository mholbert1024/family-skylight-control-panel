
import { format } from 'date-fns';

export interface EventType {
  id: number;
  title: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  person: string;
  category: string;
  color: string;
}

export interface EventFormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  person: string;
  category: string;
  color: string;
}

export const defaultEventFormData = (): EventFormData => ({
  title: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  startTime: '09:00',
  endTime: '10:00',
  person: '',
  category: 'general',
  color: '#9b87f5'
});
