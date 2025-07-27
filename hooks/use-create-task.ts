"use client";

import { supabase } from "@/lib/supabaseClient";
import { Task } from "@/types/task.types";
import { tasksStore } from "@/zustand/tasks.store";
import { useGetUser } from "./user-get-user";

export function useCreateTask() {
  const addTaskToList = tasksStore((state) => state.addTaskToList);

  async function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt" | "user_id">) {
    try {
      const user = await useGetUser();

      const insertData = {
        ...task,
        userId: user.id,
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
