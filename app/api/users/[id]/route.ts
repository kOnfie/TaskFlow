import { NextResponse } from "next/server";

import { getUserById } from "@/lib/db";
import { catchError } from "@/app/utils/server/catchError";

export const GET = async (_: unknown, { params }: { params: Promise<{ id: string }> }) => {
  const { id: userId } = await params;

  try {
    const user = getUserById(userId);
    console.log("user:", user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return catchError(`Error in GET /api/users/${userId}`, error);
  }
};
