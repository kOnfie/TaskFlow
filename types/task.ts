export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: Date;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  createdAt: Date;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}