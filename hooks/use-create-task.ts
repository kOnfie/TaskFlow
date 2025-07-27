import { supabase } from "@/lib/supabaseClient";
import { Task } from "@/types/task.types";
import { tasksStore } from "@/zustand/tasks.store";

export function useCreateTask() {
  const addTaskToList = tasksStore((state) => state.addTaskToList);

  async function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt" | "user_id">) {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Failed to receive user");
      }

      const insertData = {
        ...task,
        user_id: user.id,
      };

      const { data: newTask, error } = await supabase.from("tasks").insert([insertData]).select().single();

      if (error) {
        throw error;
      }

      addTaskToList(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }

  return { createTask };
}
