import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

/**
 * GET /api/portal/berita
 * Ambil semua berita dari Laravel
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.get("/news", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ GET NEWS ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data berita." },
      { status: err.response?.status || 500 }
    );
  }
}

/**
 * POST /api/portal/berita
 * Tambah berita baru
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.post("/news", formData, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ CREATE NEWS ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal menambah berita." },
      { status: err.response?.status || 500 }
    );
  }
}
