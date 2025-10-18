import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/app/lib/api"; // axios instance ke Laravel API

export async function GET() {
  const token = (await cookies()).get("auth-token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const res = await api.get("/lms/students", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("Error fetching students:", err.message);
    return NextResponse.json({ message: "Failed to fetch students" }, { status: 500 });
  }
}
