import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/app/lib/api";

async function getToken() {
  return (await cookies()).get("auth-token")?.value;
}

function buildErrorResponse(error: any) {
  const status = error?.response?.status ?? 500;
  const data = error?.response?.data ?? {
    message: "Terjadi kesalahan saat memproses hasil ujian.",
  };
  return NextResponse.json(data, { status });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = await getToken();
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await context.params;
    const res = await api.get(`/lms/exam-results/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Error fetching exam result detail:", error?.message ?? error);
    return buildErrorResponse(error);
  }
}
