import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/app/lib/api";

export async function GET() {
  const token = (await cookies()).get("secure-auth-token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const res = await api.get("/lms/teachers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("Error fetching teachers:", err.message);
    return NextResponse.json({ message: "Failed to fetch teachers" }, { status: 500 });
  }
}
