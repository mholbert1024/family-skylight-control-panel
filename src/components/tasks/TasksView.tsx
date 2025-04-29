
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
    assignedTo: 'Jimmy', 
    dueDate: '2025-04-30',
    completed: false,
    recurring: 'weekly',
    points: 5
  },
  { 
    id: 2, 
    title: 'Clean bedroom', 
    assignedTo: 'Lisa', 
    dueDate: '2025-04-30',
    completed: false,
    recurring: 'daily',
    points: 10
  },
  { 
    id: 3, 
    title: 'Feed the dog', 
    assignedTo: 'Emma', 
    dueDate: '2025-04-29',
    completed: true,
    recurring: 'daily',
    points: 5
  },
  { 
    id: 4, 
    title: 'Homework', 
    assignedTo: 'All Kids', 
    dueDate: '2025-04-29',
    completed: false,
    recurring: 'daily',
    points: 15
  },
];

const TasksView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [points, setPoints] = useState<Record<string, number>>({
    'Jimmy': 25,
    'Lisa': 30,
    'Emma': 35
  });
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'completed'>>({
    title: '',
    assignedTo: 'Jimmy',
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
      points: newTask.points
    };
    
    setTasks([...tasks, task]);
    setIsAddTaskOpen(false);
    setNewTask({
      title: '',
      assignedTo: 'Jimmy',
      dueDate: '2025-04-30',
      recurring: 'none',
      points: 5
    });
  };
  
  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        // Add points when completing a task
        if (!task.completed && ['Jimmy', 'Lisa', 'Emma'].includes(task.assignedTo)) {
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
  
  // Filter tasks by completion status
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

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
                  onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jimmy">Jimmy</SelectItem>
                    <SelectItem value="Lisa">Lisa</SelectItem>
                    <SelectItem value="Emma">Emma</SelectItem>
                    <SelectItem value="All Kids">All Kids</SelectItem>
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
              
              <div className="grid gap-2">
                <Label htmlFor="points">Points</Label>
                <Input 
                  id="points" 
                  type="number" 
                  min="1"
                  value={newTask.points}
                  onChange={(e) => setNewTask({...newTask, points: parseInt(e.target.value)})}
                />
              </div>
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
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Point totals */}
        <div className="col-span-1 sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {Object.entries(points).map(([person, total]) => (
            <div key={person} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-lg">{person}</h3>
              <div className="text-2xl font-bold text-family-purple">{total} points</div>
            </div>
          ))}
        </div>
        
        {/* Tasks list */}
        <div className="col-span-1 sm:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium mb-4">To-Do ({incompleteTasks.length})</h3>
            {incompleteTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">All tasks completed! 🎉</p>
            ) : (
              <div className="space-y-2">
                {incompleteTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-md border"
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
                          <Badge className="bg-family-purple">
                            {task.points} pts
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium mb-4">Completed ({completedTasks.length})</h3>
            {completedTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No completed tasks</p>
            ) : (
              <div className="space-y-2">
                {completedTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border opacity-70"
                  >
                    <CheckSquare className="h-4 w-4 mt-1 text-green-600" />
                    <div>
                      <div className="font-medium line-through">{task.title}</div>
                      <div className="text-sm text-muted-foreground">
                        By: {task.assignedTo}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksView;
