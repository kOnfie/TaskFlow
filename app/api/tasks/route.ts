export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

import { createTask, getAllTasks, getTaskById } from "@/lib/db";
import { catchError } from "@/app/utils/server/catchError";
import { Task } from "@/types/task.types";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const filter = searchParams.get("filter");
  const category = searchParams.get("category");

  try {
    const tasks = getAllTasks();

    let result;

    if (filter) {
      switch (filter) {
        case "all":
          result = { tasks };
          break;

        case "recently":
          result = { tasks: [...tasks].reverse() };
          break;

        default:
          result = { tasks };
          break;
      }
    }

    if (category) {
      result = { tasks: result?.tasks.filter((task: Task) => task.category === category) };
    }

    return NextResponse.json(result);
  } catch (error) {
    return catchError("Error in GET /api/tasks", error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const params = await req.json();
    const taskId = createTask({ ...params });

    const task = getTaskById(taskId);

    return NextResponse.json({ task });
  } catch (error) {
    return catchError("Error in POST /api/tasks", error);
  }
};
