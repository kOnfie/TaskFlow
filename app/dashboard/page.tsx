'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { TaskList } from '@/components/dashboard/task-list';
import { TaskForm } from '@/components/dashboard/task-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task, TaskStats } from '@/types/task';
import { getTasks, getTaskStats, createTask, updateTask, deleteTask } from '@/lib/tasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, inProgress: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);

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
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = await createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      loadData(); // Refresh stats
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
        loadData(); // Refresh stats
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      loadData(); // Refresh stats
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const recentTasks = tasks.slice(0, 5);
  const upcomingTasks = tasks
    .filter(task => task.dueDate && task.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Dashboard" 
        onAddClick={() => setShowTaskForm(true)}
      />
      
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Tasks */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <TaskList 
                    tasks={recentTasks}
                    onTaskUpdate={handleUpdateTask}
                    onTaskDelete={handleDeleteTask}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <TaskForm 
                    onSubmit={handleCreateTask}
                    trigger={
                      <Button className="w-full justify-start gap-2">
                        <Clock className="h-4 w-4" />
                        Create Task
                      </Button>
                    }
                  />
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <TrendingUp className="h-4 w-4" />
                    View Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Review Completed
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingTasks.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No upcoming deadlines
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {task.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                            </p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Activity Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Today's Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tasks completed</span>
                    <Badge variant="secondary">{stats.completed}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">In progress</span>
                    <Badge variant="secondary">{stats.inProgress}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overdue</span>
                    <Badge variant="destructive">{stats.overdue}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm 
          onSubmit={handleCreateTask}
          trigger={<div />}
        />
      )}
    </div>
  );
}