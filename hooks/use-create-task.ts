import { Task } from "@/types/task.types";
import { tasksStore } from "@/zustand/tasks.store";

export function useCreateTask() {
  const addTaskToList = tasksStore((state) => state.addTaskToList);

  async function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">) {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(task),
      });

      const { task: newTask } = await res.json();

      addTaskToList(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }

  return { createTask };
}
