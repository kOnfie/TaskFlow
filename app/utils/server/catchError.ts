import { NextResponse } from "next/server";

export function catchError(address: string, error: any) {
  console.error(address, error);
  return NextResponse.json({ error: `Internal server error: ${error}` }, { status: 500 });
}
