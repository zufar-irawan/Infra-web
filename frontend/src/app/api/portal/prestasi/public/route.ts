import { NextResponse } from "next/server";
import api from "@/app/lib/api";

export async function GET() {
  try {
    // Ambil data langsung dari backend Laravel
    const res = await api.get("/achievements");
    const achievements = res.data?.data || [];

    // Biarkan path poster sesuai dari backend tanpa hardcode URL/env
    const data = achievements.map((a: any) => ({
      ...a,
      poster: a.poster?.startsWith("/storage") ? a.poster : a.poster,
    }));

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("❌ PUBLIC PRESTASI ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data prestasi publik." },
      { status: err.response?.status || 500 }
    );
  }
}
