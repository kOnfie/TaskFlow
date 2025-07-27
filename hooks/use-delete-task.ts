"use client";

import { supabase } from "@/lib/supabaseClient";
import { tasksStore } from "@/zustand/tasks.store";
import { useGetUser } from "./user-get-user";

export function useDeleteTask() {
  const deleteTaskFromList = tasksStore((state) => state.deleteTaskFromList);

  async function deleteTask(taskId: number) {
    try {
      const user = await useGetUser();

      const { error } = await supabase.from("tasks").delete().eq("id", taskId).eq("userId", user.id);

      if (error) {
        throw error;
      }

      deleteTaskFromList(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  return { deleteTask };
}
