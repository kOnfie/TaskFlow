'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import { TaskList } from '@/components/dashboard/task-list';
import { TaskForm } from '@/components/dashboard/task-form';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task, TaskStats } from '@/types/task';
import { getTasks, getTaskStats, createTask, updateTask, deleteTask } from '@/lib/tasks';
import { Filter, SortAsc, Grid, List } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, inProgress: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, statsData] = await Promise.all([
        getTasks(),
        getTaskStats()
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = await createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      loadData();
    } catch (error) {
      console.error('Error creating task:', error);
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
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      loadData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="All Tasks" 
        onAddClick={() => {}}
      />
      
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats */}
          <StatsCards stats={stats} />

          {/* Filters and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tabs value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="todo">To Do</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-l-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
              <TaskForm onSubmit={handleCreateTask} />
            </div>
          </div>

          {/* Task List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {filterStatus === 'all' ? 'All Tasks' : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Tasks`}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredTasks.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList 
                tasks={filteredTasks}
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