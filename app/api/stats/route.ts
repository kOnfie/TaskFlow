import { NextRequest, NextResponse } from "next/server";

import { getAllTasks } from "@/lib/db";
import { Task } from "@/types/task.types";

function isOverdue(task: Task, now: Date): boolean {
  return !!task.dueDate && new Date(task.dueDate) < now && task.status !== "completed";
}

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const totalTasks = getAllTasks();
    const now = new Date();

    let tasks;

    if (category) {
      tasks = totalTasks.filter((task: Task) => task.category === category);
    } else {
      tasks = [...totalTasks];
    }

    return NextResponse.json({
      total: tasks.length,
      completed: tasks.filter((task: Task) => task.status === "completed").length,
      inProgress: tasks.filter((task: Task) => task.status === "in-progress").length,
      overdue: tasks.filter((task: Task) => isOverdue(task, now)).length,
    });
  } catch (error) {
    console.log("Error in GET /api/tasks/stats", error);
    return NextResponse.json({ error: `Internal server error: ${error}` }, { status: 500 });
  }
};
