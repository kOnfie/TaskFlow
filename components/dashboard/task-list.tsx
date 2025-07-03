'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import { 
  Calendar,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
  CheckCircle2,
  Circle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
}

export function TaskList({ tasks, onTaskUpdate, onTaskDelete }: TaskListProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const handleTaskToggle = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && onTaskUpdate) {
      onTaskUpdate(taskId, {
        status: task.status === 'completed' ? 'todo' : 'completed',
      });
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Task['status'], isCompleted: boolean) => {
    if (isCompleted) return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    switch (status) {
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'todo': return <Circle className="h-4 w-4 text-gray-400" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  if (tasks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-sm">Get started by creating your first task!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const overdue = isOverdue(task);
        const isCompleted = task.status === 'completed';
        
        return (
          <Card
            key={task.id}
            className={cn(
              "transition-all duration-200 hover:shadow-md",
              isCompleted && "opacity-60",
              overdue && "border-red-200 bg-red-50/50"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Checkbox */}
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => handleTaskToggle(task.id)}
                  className="mt-1"
                />

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={cn(
                      "font-medium text-gray-900",
                      isCompleted && "line-through text-gray-500"
                    )}>
                      {task.title}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status, isCompleted)}
                      
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      
                      {overdue && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </div>

                  {task.description && (
                    <p className={cn(
                      "text-sm text-gray-600 mb-3",
                      isCompleted && "line-through"
                    )}>
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className={overdue ? "text-red-600 font-medium" : ""}>
                          {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                    
                    <Badge variant="secondary" className="text-xs">
                      {task.category}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {task.title.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Flag className="h-4 w-4 mr-2" />
                        Change Priority
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => onTaskDelete?.(task.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}