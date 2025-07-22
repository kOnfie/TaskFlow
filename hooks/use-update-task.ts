import { tasksStore } from "@/zustand/tasks.store";

export function useUpdateTask() {
  const updateTask = tasksStore((state) => state.updateTask);

  async function updateTaskRequest(taskId: number, updates: any) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(updates),
      });

      await res.json();
      updateTask(taskId, { ...updates });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  return { updateTaskRequest };
}
