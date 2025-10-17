import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/app/lib/api";

export async function GET(request: NextRequest) {
  const token = (await cookies()).get("secure-auth-token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const searchParams = request.nextUrl.searchParams.toString();
  const endpoint = searchParams
    ? `/lms/classes?${searchParams}`
    : "/lms/classes";

  try {
    const res = await api.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Error fetching classes:", error?.message ?? error);
    const status = error?.response?.status ?? 500;
    const data = error?.response?.data ?? {
      message: "Terjadi kesalahan saat mengambil data kelas.",
    };
    return NextResponse.json(data, { status });
  }
}
