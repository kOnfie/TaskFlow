'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import { TaskList } from '@/components/dashboard/task-list';
import { TaskForm } from '@/components/dashboard/task-form';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task, TaskStats } from '@/types/task';
import { getTasks, getTaskStats, createTask, updateTask, deleteTask } from '@/lib/tasks';
import { User } from 'lucide-react';

export default function PersonalPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, inProgress: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, statsData] = await Promise.all([
        getTasks('personal'),
        getTaskStats('personal')
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading personal tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = await createTask({ ...taskData, category: 'personal' });
      setTasks(prev => [newTask, ...prev]);
      loadData();
    } catch (error) {
      console.error('Error creating personal task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await updateTask(taskId, updates);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? updatedTask : task
        ));
        loadData();
      }
    } catch (error) {
      console.error('Error updating personal task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      loadData();
    } catch (error) {
      console.error('Error deleting personal task:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading personal tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Personal Tasks" 
        onAddClick={() => {}}
      />
      
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
            <div className="p-3 bg-green-500 rounded-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Personal Tasks</h1>
              <p className="text-gray-600">Manage your personal goals and activities</p>
            </div>
          </div>

          {/* Stats */}
          <StatsCards stats={stats} />

          {/* Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Personal Tasks</CardTitle>
              <TaskForm 
                onSubmit={handleCreateTask}
                defaultCategory="personal"
              />
            </CardHeader>
            <CardContent>
              <TaskList 
                tasks={tasks}
                onTaskUpdate={handleUpdateTask}
                onTaskDelete={handleDeleteTask}
              />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}