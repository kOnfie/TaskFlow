import { useState } from "react";

import { TaskCategory, TaskStats } from "@/types/task.types";
import { statsStore } from "@/zustand/stats.store";

export function useGetStats(): {
  getStats: (category: TaskCategory) => Promise<void>;
} {
  const changeStats = statsStore((state) => state.changeStats);

  const getStats = async (category: TaskCategory) => {
    try {
      const url = !category ? "/api/stats" : `/api/stats?category=${category}`;
      const res = await fetch(url);

      const statsData = await res.json();

      changeStats(statsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  return { getStats };
}
