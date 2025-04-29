
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, CheckSquare, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface Task {
  id: number;
  title: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  points: number;
}

// Mock tasks data
const mockTasks: Task[] = [
  { 
    id: 1, 
    title: 'Take out the trash', 
    assignedTo: 'Grayson', 
    dueDate: '2025-04-30',
    completed: false,
    recurring: 'weekly',
    points: 5
  },
  { 
    id: 2, 
    title: 'Clean bedroom', 
    assignedTo: 'Grayson', 
    dueDate: '2025-04-30',
    completed: false,
    recurring: 'daily',
    points: 10
  },
  { 
    id: 3, 
    title: 'Feed the dog', 
    assignedTo: 'Grayson', 
    dueDate: '2025-04-29',
    completed: true,
    recurring: 'daily',
    points: 5
  },
  { 
    id: 4, 
    title: 'Homework', 
    assignedTo: 'Grayson', 
    dueDate: '2025-04-29',
    completed: false,
    recurring: 'daily',
    points: 15
  },
  { 
    id: 5, 
    title: 'Schedule doctor appointment', 
    assignedTo: 'Mom', 
    dueDate: '2025-04-30',
    completed: false,
    recurring: 'none',
    points: 0
  },
  { 
    id: 6, 
    title: 'Pay bills', 
    assignedTo: 'Dad', 
    dueDate: '2025-05-01',
    completed: false,
    recurring: 'monthly',
    points: 0
  },
  { 
    id: 7, 
    title: 'Grocery shopping', 
    assignedTo: 'Mom', 
    dueDate: '2025-04-29',
    completed: true,
    recurring: 'weekly',
    points: 0
  },
];

const TasksView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [points, setPoints] = useState<Record<string, number>>({
    'Grayson': 35,
  });
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'completed'>>({
    title: '',
    assignedTo: 'Grayson',
    dueDate: '2025-04-30',
    recurring: 'none',
    points: 5
  });
  
  const handleAddTask = () => {
    const task: Task = {
      id: tasks.length + 1,
      title: newTask.title,
      assignedTo: newTask.assignedTo,
      dueDate: newTask.dueDate,
      completed: false,
      recurring: newTask.recurring,
      points: newTask.assignedTo === 'Grayson' ? newTask.points : 0
    };
    
    setTasks([...tasks, task]);
    setIsAddTaskOpen(false);
    setNewTask({
      title: '',
      assignedTo: 'Grayson',
      dueDate: '2025-04-30',
      recurring: 'none',
      points: 5
    });
  };
  
  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        // Add points when completing a task for Grayson
        if (!task.completed && task.assignedTo === 'Grayson') {
          setPoints(prev => ({
            ...prev,
            [task.assignedTo]: (prev[task.assignedTo] || 0) + task.points
          }));
        }
        
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };
  
  // Filter tasks for Grayson
  const graysonIncompleteTasks = tasks.filter(task => !task.completed && task.assignedTo === 'Grayson');
  const graysonCompletedTasks = tasks.filter(task => task.completed && task.assignedTo === 'Grayson');
  
  // Filter tasks for parents
  const parentIncompleteTasks = tasks.filter(task => !task.completed && task.assignedTo !== 'Grayson');
  const parentCompletedTasks = tasks.filter(task => task.completed && task.assignedTo !== 'Grayson');

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Tasks & Chores</h2>
        
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input 
                  id="title" 
                  value={newTask.title} 
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Enter task title" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Select 
                  value={newTask.assignedTo}
                  onValueChange={(value) => setNewTask({
                    ...newTask, 
                    assignedTo: value,
                    points: ['Mom', 'Dad'].includes(value) ? 0 : newTask.points
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grayson">Grayson</SelectItem>
                    <SelectItem value="Mom">Mom</SelectItem>
                    <SelectItem value="Dad">Dad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date" 
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="recurring">Recurring</Label>
                <Select 
                  value={newTask.recurring}
                  onValueChange={(value: 'none' | 'daily' | 'weekly' | 'monthly') => 
                    setNewTask({...newTask, recurring: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (One-time)</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newTask.assignedTo === 'Grayson' && (
                <div className="grid gap-2">
                  <Label htmlFor="points">Points</Label>
                  <Input 
                    id="points" 
                    type="number" 
                    min="1"
                    value={newTask.points}
                    onChange={(e) => setNewTask({...newTask, points: parseInt(e.target.value) || 0})}
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask} disabled={newTask.title === ''}>
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Grayson's points display */}
      <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-4">
        <h3 className="font-medium text-lg">Grayson's Points</h3>
        <div className="text-2xl font-bold text-family-blue">{points['Grayson'] || 0} points</div>
      </div>
      
      {/* Tasks columns - Grayson and Parents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Grayson's Tasks Column */}
        <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-family-blue">
          <h3 className="font-medium mb-4">Grayson's Tasks ({graysonIncompleteTasks.length})</h3>
          {graysonIncompleteTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">All tasks completed! 🎉</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {graysonIncompleteTasks.map(task => (
                <div 
                  key={task.id} 
                  className="flex items-start justify-between p-3 bg-blue-50 rounded-md border"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={task.completed} 
                      onCheckedChange={() => toggleTaskCompletion(task.id)} 
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground flex gap-2 mt-1 flex-wrap">
                        <span>Due: {task.dueDate}</span>
                        {task.recurring !== 'none' && (
                          <Badge variant="outline" className="text-xs">
                            {task.recurring}
                          </Badge>
                        )}
                        <Badge className="bg-family-blue">
                          {task.points} pts
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Completed Tasks */}
          {graysonCompletedTasks.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Completed ({graysonCompletedTasks.length})</h4>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {graysonCompletedTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border opacity-70"
                  >
                    <CheckSquare className="h-4 w-4 mt-1 text-green-600" />
                    <div>
                      <div className="font-medium line-through">{task.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {task.points} points
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Parents' Tasks Column */}
        <div className="bg-white rounded-lg shadow-sm p-4 border-t-4 border-family-purple">
          <h3 className="font-medium mb-4">Parents' Tasks ({parentIncompleteTasks.length})</h3>
          {parentIncompleteTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No tasks to do! 🎉</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {parentIncompleteTasks.map(task => (
                <div 
                  key={task.id} 
                  className="flex items-start justify-between p-3 bg-purple-50 rounded-md border"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={task.completed} 
                      onCheckedChange={() => toggleTaskCompletion(task.id)} 
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground flex gap-2 mt-1 flex-wrap">
                        <span>Assigned to: {task.assignedTo}</span>
                        <span>Due: {task.dueDate}</span>
                        {task.recurring !== 'none' && (
                          <Badge variant="outline" className="text-xs">
                            {task.recurring}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Completed Tasks */}
          {parentCompletedTasks.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Completed ({parentCompletedTasks.length})</h4>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {parentCompletedTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border opacity-70"
                  >
                    <CheckSquare className="h-4 w-4 mt-1 text-green-600" />
                    <div>
                      <div className="font-medium line-through">{task.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {task.assignedTo}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksView;
