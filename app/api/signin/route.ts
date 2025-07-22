export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { getUserByEmail } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();

    const user = getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(password, user.hash);
    if (!isValidPassword) {
      throw new Error("Data not valid");
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("Error in POST /api/signin", error);
    return NextResponse.json({ error: `Internal server error: ${error}` }, { status: 500 });
  }
};
