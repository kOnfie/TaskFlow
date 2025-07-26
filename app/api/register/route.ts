export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { createUser, getUserById } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password, name } = await req.json();

    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);

    const userId = createUser(email, hash, name);

    const user = getUserById(userId);

    return NextResponse.json(user);
  } catch (error: any) {
    console.log("Error in POST /api/signin", error);

    if (error.message === "EMAIL_EXISTS") {
      return NextResponse.json({ error: `User already exists` }, { status: 409 });
    }
    return NextResponse.json({ error: `Internal server error: ${error}` }, { status: 500 });
  }
};
