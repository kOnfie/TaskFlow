export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "completed";
  dueDate?: Date;
  category: "work" | "personal" | "development" | "health";
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}

export const TASK_CATEGORIES = ["work", "personal", "development", "health"] as const;
export type TaskCategory = (typeof TASK_CATEGORIES)[number];
