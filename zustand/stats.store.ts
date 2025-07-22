import { TaskStats } from "@/types/task.types";
import { create } from "zustand";

type Store = {
  stats: TaskStats;
  changeStats: (stats: TaskStats) => void;
};

export const statsStore = create<Store>()((set) => ({
  stats: { total: 0, completed: 0, inProgress: 0, overdue: 0 },
  changeStats: (stats: TaskStats) => set(() => ({ stats })),
}));
