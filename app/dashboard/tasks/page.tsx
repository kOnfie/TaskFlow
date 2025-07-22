"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header/header";
import { TaskList } from "@/components/dashboard/task-list";
import { StatsCards } from "@/components/dashboard/stats-cards/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useGetTasks } from "@/hooks/use-get-tasks";
import { tasksStore } from "@/zustand/tasks.store";

export default function TasksPage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "todo" | "in-progress" | "completed" | string>("all");

  const tasks = tasksStore((state) => state.tasks);
  const { getTasks } = useGetTasks();

  useEffect(() => {
    getTasks("all");
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "all") return true;
    return task.status === filterStatus;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="All Tasks" />

      <ScrollArea className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <StatsCards />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tabs value={filterStatus} onValueChange={(value: string) => setFilterStatus(value)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="todo">To Do</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {filterStatus === "all"
                  ? "All Tasks"
                  : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Tasks`}
                <span className="ml-2 text-sm font-normal text-gray-500">({filteredTasks.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList tasks={filteredTasks} category={undefined} />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
