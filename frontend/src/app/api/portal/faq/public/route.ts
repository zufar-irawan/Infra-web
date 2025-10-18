import { NextResponse } from "next/server";
import api from "@/app/lib/api";

/**
 * GET /api/portal/faq/public
 * Ambil semua FAQ untuk halaman publik
 */
export async function GET() {
  try {
    const res = await api.get("/faq/list");
    const data = res.data?.data || [];

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("❌ GET PUBLIC FAQ ERROR:", err.response?.data || err.message);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memuat FAQ publik.",
      },
      { status: err.response?.status || 500 }
    );
  }
}
