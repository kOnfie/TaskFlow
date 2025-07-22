"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { tasksStore } from "@/zustand/tasks.store";

export default function Sidebar() {
  const tasks = tasksStore((store) => store.tasks);

  const upcomingTasks = tasks
    .filter((task) => task.dueDate && task.status !== "completed")
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No upcoming deadlines</p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
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
    </div>
  );
}
