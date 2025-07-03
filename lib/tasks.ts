import { Task, TaskCategory, TaskStats } from '@/types/task';

// Mock data for tasks
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finalize the project proposal for Q2 planning',
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date('2024-02-15'),
    category: 'work',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '2',
    title: 'Review marketing materials',
    description: 'Review and approve new marketing campaign materials',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date('2024-02-20'),
    category: 'work',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: '3',
    title: 'Plan weekend trip',
    description: 'Research and book accommodation for weekend getaway',
    priority: 'low',
    status: 'todo',
    dueDate: new Date('2024-02-25'),
    category: 'personal',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '4',
    title: 'Implement user dashboard',
    description: 'Build the new user dashboard with analytics',
    priority: 'high',
    status: 'completed',
    dueDate: new Date('2024-01-30'),
    category: 'development',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
  },
];

const mockCategories: TaskCategory[] = [
  {
    id: 'work',
    name: 'Work',
    color: '#3B82F6',
    icon: 'briefcase',
    description: 'Professional tasks and projects',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'personal',
    name: 'Personal',
    color: '#10B981',
    icon: 'user',
    description: 'Personal tasks and goals',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'development',
    name: 'Development',
    color: '#F59E0B',
    icon: 'code',
    description: 'Software development tasks',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'health',
    name: 'Health',
    color: '#EF4444',
    icon: 'heart',
    description: 'Health and fitness goals',
    createdAt: new Date('2024-01-01'),
  },
];

export const getTasks = async (category?: string): Promise<Task[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (category) {
    return mockTasks.filter(task => task.category === category);
  }
  return mockTasks;
};

export const getTaskStats = async (category?: string): Promise<TaskStats> => {
  const tasks = await getTasks(category);
  const now = new Date();
  
  return {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    overdue: tasks.filter(task => 
      task.dueDate && task.dueDate < now && task.status !== 'completed'
    ).length,
  };
};

export const getCategories = async (): Promise<TaskCategory[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockCategories;
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  const newTask: Task = {
    ...task,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  mockTasks.push(newTask);
  return newTask;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task | null> => {
  const taskIndex = mockTasks.findIndex(task => task.id === id);
  if (taskIndex === -1) return null;
  
  mockTasks[taskIndex] = {
    ...mockTasks[taskIndex],
    ...updates,
    updatedAt: new Date(),
  };
  
  return mockTasks[taskIndex];
};

export const deleteTask = async (id: string): Promise<boolean> => {
  const taskIndex = mockTasks.findIndex(task => task.id === id);
  if (taskIndex === -1) return false;
  
  mockTasks.splice(taskIndex, 1);
  return true;
};