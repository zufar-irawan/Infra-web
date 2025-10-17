import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/app/lib/api";

export async function GET() {
  const token = (await cookies()).get("secure-auth-token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const res = await api.get("/lms/exams", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const data = err?.response?.data ?? { message: "Failed to fetch exams" };
    return NextResponse.json(data, { status });
  }
}

export async function POST(request: Request) {
  const token = (await cookies()).get("secure-auth-token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const res = await api.post("/lms/exams", body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const data = err?.response?.data ?? { message: "Failed to create exam" };
    return NextResponse.json(data, { status });
  }
}
