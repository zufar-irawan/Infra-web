import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("secure-auth-token")?.value;

  if (!token) {
    return NextResponse.json(
      { token: null, message: "No auth token present" },
      { status: 401 },
    );
  }

  return NextResponse.json({ token }, { status: 200 });
}
