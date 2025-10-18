import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/app/lib/api";

async function getToken() {
  return (await cookies()).get("auth-token")?.value;
}

function buildErrorResponse(error: any) {
  const status = error?.response?.status ?? 500;
  const message =
    error?.response?.data ??
    error?.message ??
    "Terjadi kesalahan saat memproses permintaan ujian.";

  return NextResponse.json(message, { status });
}

export async function GET(request: NextRequest) {
  const token = await getToken();
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const searchParams = request.nextUrl.searchParams.toString();
  const endpoint = searchParams ? `/lms/exams?${searchParams}` : "/lms/exams";

  try {
    const res = await api.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Error fetching exams:", error?.message ?? error);
    return buildErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken();
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = await request.json();
    const res = await api.post("/lms/exams", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(res.data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating exam:", error?.message ?? error);
    return buildErrorResponse(error);
  }
}
