import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

/**
 * GET /api/portal/mitra  → Ambil semua mitra
 * POST /api/portal/mitra → Tambah mitra
 */
export async function GET() {
  try {
    const res = await api.get("/mitra");
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ MITRA GET ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data mitra." },
      { status: err.response?.status || 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.post("/mitra", formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ MITRA CREATE ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal menambah data mitra." },
      { status: err.response?.status || 500 }
    );
  }
}
