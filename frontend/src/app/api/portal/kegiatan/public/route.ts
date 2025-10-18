import { NextResponse } from "next/server";
import api from "@/app/lib/api";

/**
 * GET /api/portal/kegiatan/public
 * Ambil semua kegiatan untuk halaman publik
 */
export async function GET() {
  try {
    const res = await api.get("/kegiatan/public");

    // pastikan struktur data valid
    const data = res.data?.data || [];

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("❌ GET PUBLIC KEGIATAN ERROR:", err.response?.data || err.message);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memuat kegiatan publik.",
      },
      { status: err.response?.status || 500 }
    );
  }
}
