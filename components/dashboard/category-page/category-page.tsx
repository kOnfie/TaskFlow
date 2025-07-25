"use client";

import { useEffect } from "react";
import { Header } from "@/components/dashboard/header/header";
import { TaskList } from "@/components/dashboard/task-list";

import { StatsCards } from "@/components/dashboard/stats-cards/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Briefcase, Code, Heart, User } from "lucide-react";
import { tasksStore } from "@/zustand/tasks.store";
import { useGetTasks } from "@/hooks/use-get-tasks";

import { TaskCategory } from "@/types/task.types";

interface CategoryPage {
  category: TaskCategory;
}

const HEADERS = {
  work: (
    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
      <div className="p-3 bg-blue-500 rounded-lg">
        <Briefcase className="h-8 w-8 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Work Tasks</h1>
        <p className="text-gray-600">Manage your professional tasks and projects</p>
      </div>
    </div>
  ),
  personal: (
    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
      <div className="p-3 bg-green-500 rounded-lg">
        <User className="h-8 w-8 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Personal Tasks</h1>
        <p className="text-gray-600">Manage your personal goals and activities</p>
      </div>
    </div>
  ),
  development: (
    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
      <div className="p-3 bg-yellow-500 rounded-lg">
        <Code className="h-8 w-8 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Development Tasks</h1>
        <p className="text-gray-600">Track your coding projects and technical tasks</p>
      </div>
    </div>
  ),
  health: (
    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
      <div className="p-3 bg-red-500 rounded-lg">
        <Heart className="h-8 w-8 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Health & Wellness</h1>
        <p className="text-gray-600">Track your health goals and fitness activities</p>
      </div>
    </div>
  ),
};

export function CategoryPage({ category }: CategoryPage) {
  const tasks = tasksStore((state) => state.tasks);
  const filteredByCategory = tasksStore((state) => state.filteredByCategory);

  const { getTasks } = useGetTasks();

  useEffect(() => {
    getTasks("all", category);
    filteredByCategory(category);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Personal Tasks" />

      <ScrollArea className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {HEADERS[category]}

          <StatsCards category="personal" />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Personal Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList tasks={tasks} category="personal" />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
