"use client";

import { supabase } from "@/lib/supabaseClient";
import { TaskCategory } from "@/types/task.types";
import { tasksStore } from "@/zustand/tasks.store";
import { useGetUser } from "./user-get-user";

export function useGetTasks(): {
  getTasks: (filter: "all" | "recently", category?: TaskCategory) => Promise<void>;
} {
  const updateTasks = tasksStore((store) => store.updateTasks);

  async function getTasks(filter: "all" | "recently", category?: TaskCategory): Promise<void> {
    try {
      const user = await useGetUser();

      let query = supabase.from("tasks").select("*").eq("userId", user.id);

      if (category) {
        query = query.eq("category", category);
      }

      if (filter === "recently") {
        query = query.order("createdAt", { ascending: false }).limit(5);
      } else {
        query = query.order("createdAt", { ascending: false });
      }

      const { data: tasks, error } = await query;
      if (error) {
        throw error;
      }

      updateTasks(tasks);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }

  return { getTasks };
}
