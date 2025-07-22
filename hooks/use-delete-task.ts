import { tasksStore } from "@/zustand/tasks.store";

export function useDeleteTask() {
  const deleteTaskFromList = tasksStore((state) => state.deleteTaskFromList);

  async function deleteTask(taskId: number) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      });

      await res.json();
      deleteTaskFromList(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  return { deleteTask };
}
