import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/app/lib/api";

async function getToken() {
  return (await cookies()).get("auth-token")?.value;
}

function buildErrorResponse(error: any) {
  const status = error?.response?.status ?? 500;
  const data = error?.response?.data ?? {
    message: "Terjadi kesalahan saat memproses permintaan ujian.",
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
    const res = await api.get(`/lms/exams/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Error fetching exam detail:", error?.message ?? error);
    return buildErrorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = await getToken();
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = await request.json();
    const { id } = await context.params;
    const res = await api.patch(`/lms/exams/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Error updating exam:", error?.message ?? error);
    return buildErrorResponse(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = await getToken();
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await context.params;
    await api.delete(`/lms/exams/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(null, { status: 204 });
  } catch (error: any) {
    console.error("Error deleting exam:", error?.message ?? error);
    return buildErrorResponse(error);
  }
}
