// filepath: c:\laragon\www\Infra-web\frontend\src\app\api\tugas\[id]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/app/lib/api";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const cookieStore = await cookies();
  const token = cookieStore.get("secure-auth-token")?.value;

  if (!token) return NextResponse.json({ error: "Token tidak ada!" }, { status: 401 });
  if (!id) return NextResponse.json({ error: "ID tugas tidak valid" }, { status: 400 });

  try {
    const res = await api.get(`/lms/assignments/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    const data = error?.response?.data ?? { error: "Gagal mengambil detail tugas" };
    return NextResponse.json(data, { status });
  }
}

