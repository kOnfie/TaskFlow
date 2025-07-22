"use client";

import { useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TaskList } from "@/components/dashboard/task-list";
import { Button } from "@/components/ui/button";
import { useGetTasks } from "@/hooks/use-get-tasks";

import { tasksStore } from "@/zustand/tasks.store";
import { useRouter } from "next/navigation";

export default function RecentTasks() {
  const { getTasks } = useGetTasks();

  const tasks = tasksStore((store) => store.tasks);
  const sortedTasks = tasksStore((store) => store.sortedTasks);

  const router = useRouter();

  useEffect(() => {
    getTasks("recently");
  }, []);

  function redirectToTasks() {
    router.push("/dashboard/tasks");
  }

  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
          <Button variant="outline" size="sm" onClick={redirectToTasks}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <TaskList tasks={sortedTasks.length === 0 ? tasks : sortedTasks} />
        </CardContent>
      </Card>
    </div>
  );
}
