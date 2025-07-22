"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task, TaskCategory } from "@/types/task.types";
import { format } from "date-fns";
import { Calendar, Clock, MoreHorizontal, Edit, Trash2, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeleteTask } from "@/hooks/use-delete-task";
import { useUpdateTask } from "@/hooks/use-update-task";
import { TaskForm } from "./task-form";
import { useGetStats } from "@/hooks/use-get-stats";

interface TaskListProps {
  tasks: Task[];
  category?: TaskCategory;
}

export function TaskList({ tasks, category }: TaskListProps) {
  const { deleteTask } = useDeleteTask();
  const { updateTaskRequest } = useUpdateTask();
  const { getStats } = useGetStats();

  async function handleTaskToggle(taskId: number, taskStatus: "todo" | "in-progress" | "completed") {
    await updateTaskRequest(taskId, { status: taskStatus === "completed" ? "todo" : "completed" });
    await getStats(category);
  }

  async function updateTask(taskId: number, updates: Omit<Task, "id" | "createdAt" | "updatedAt">) {
    await updateTaskRequest(taskId, { ...updates });
    await getStats(category);
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: Task["status"], isCompleted: boolean) => {
    if (isCompleted) return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    switch (status) {
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellw-600" />;
      case "todo":
        return <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === "completed") return false;
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
      {tasks.map((task: Task) => {
        const overdue = isOverdue(task);
        const isCompleted = task.status === "completed";

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
                  onCheckedChange={() => handleTaskToggle(task.id, task.status)}
                  className="mt-1"
                />

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={cn("font-medium text-gray-900", isCompleted && "line-through text-gray-500")}>
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
                    <p className={cn("text-sm text-gray-600 mb-3", isCompleted && "line-through")}>
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className={overdue ? "text-red-600 font-medium" : ""}>
                          {format(new Date(task.dueDate), "MMM d, yyyy")}
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <TaskForm
                        type="edit"
                        onSubmit={(updates) => updateTask(task.id, updates)}
                        trigger={
                          <button className="w-full relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                        }
                        initialData={{
                          title: task.title || "",
                          description: task.description || "",
                          priority: task.priority,
                          category: task.category || "work",
                          dueDate: task.dueDate,
                        }}
                      />

                      <DropdownMenuItem onClick={() => updateTask(task.id, { ...task, status: "in-progress" })}>
                        <Clock className="h-4 w-4 mr-2" />
                        In Progress
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => deleteTask(+task.id)}>
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
