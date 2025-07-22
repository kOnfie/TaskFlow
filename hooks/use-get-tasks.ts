"use client";

import { TaskCategory } from "@/types/task.types";
import { tasksStore } from "@/zustand/tasks.store";

export function useGetTasks(): {
  getTasks: (filter: "all" | "recently", category?: TaskCategory) => Promise<void>;
} {
  const updateTasks = tasksStore((store) => store.updateTasks);

  async function getTasks(filter: "all" | "recently", category?: TaskCategory): Promise<void> {
    const url = !category ? `/api/tasks?filter=${filter}` : `/api/tasks?filter=${filter}&category=${category}`;

    try {
      const res = await fetch(url);

      const tasksData = await res.json();

      updateTasks(tasksData.tasks);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }

  return { getTasks };
}
