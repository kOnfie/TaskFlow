import { NextRequest, NextResponse } from "next/server";

import { catchError } from "@/app/utils/server/catchError";
import { deleteTaskById, getTaskById, updateTaskById } from "@/lib/db";

function validateTask(taskId: string): undefined | NextResponse<{ message: string }> {
  const task = getTaskById(taskId);

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }
}

// update task
export async function PUT(req: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const { taskId } = params;
    validateTask(taskId);

    const updates = await req.json();
    const task = updateTaskById(taskId, updates);

    return NextResponse.json({ task });
  } catch (error) {
    return catchError(`Error in PUT /api/tasks/taskId`, error);
  }
}

// delete task
export async function DELETE(req: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const { taskId } = params;

    validateTask(taskId);

    const deletedTaskId = deleteTaskById(taskId);

    return NextResponse.json({ deletedTaskId });
  } catch (error) {
    return catchError(`Error in DELETE /api/tasks/taskId`, error);
  }
}
