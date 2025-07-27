"use client";

import { supabase } from "@/lib/supabaseClient";
import { useGetUser } from "./user-get-user";
import { tasksStore } from "@/zustand/tasks.store";

export function useUpdateTask() {
  const updateTask = tasksStore((state) => state.updateTask);

  async function updateTaskRequest(taskId: number, updates: any) {
    try {
      const user = await useGetUser();

      const { error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", taskId)
        .eq("userId", user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      updateTask(taskId, { ...updates });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  return { updateTaskRequest };
}
