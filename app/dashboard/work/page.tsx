"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header/header";
import { TaskList } from "@/components/dashboard/task-list";
import { StatsCards } from "@/components/dashboard/stats-cards/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Briefcase } from "lucide-react";
import { tasksStore } from "@/zustand/tasks.store";
import { useGetTasks } from "@/hooks/use-get-tasks";

export default function WorkPage() {
  const tasks = tasksStore((state) => state.tasks);
  const filteredByCategory = tasksStore((state) => state.filteredByCategory);

  const { getTasks } = useGetTasks();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTasks("all", "work");
    filteredByCategory("work");
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading work tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Work Tasks" />

      <ScrollArea className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Work Tasks</h1>
              <p className="text-gray-600">Manage your professional tasks and projects</p>
            </div>
          </div>

          <StatsCards category="work" />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Work Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList tasks={tasks} category="work" />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
