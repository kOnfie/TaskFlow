import { Task } from "@/types/task.types";

import { create } from "zustand";

type State = {
  tasks: Task[];
  sortedTasks: Task[];
};

type Actions = {
  updateTasks: (tasks: Task[]) => void;
  addTaskToList: (task: Task) => void;
  deleteTaskFromList: (taskId: number) => void;
  updateTask: (taskId: number, params: any) => void;
  filteredByCategory: (category: string) => void;
};

export const tasksStore = create<State & Actions>()((set) => ({
  tasks: [],
  sortedTasks: [],

  updateTasks: (tasks: Task[]) => set(() => ({ tasks })),
  addTaskToList: (task: Task) => set((state) => ({ tasks: [...state.tasks, task] })),
  deleteTaskFromList: (taskId: number) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId) })),
  updateTask: (taskId: number, params: any) =>
    set((state) => {
      const indexElement = state.tasks.findIndex((task) => task.id === taskId);
      if (indexElement === -1) {
        return state;
      }

      const updatedTasks = state.tasks.map((task, taskIndex) => {
        if (taskIndex === indexElement) {
          return { ...task, ...params };
        }
        return task;
      });

      return { ...state, tasks: updatedTasks };
    }),

  filteredByCategory: (category: string) =>
    set((state) => {
      const tasks = state.tasks.filter((task) => task.category === category);

      return { tasks };
    }),
}));
