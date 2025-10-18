import { NextResponse } from "next/server";
import api from "@/app/lib/api";

/**
 * GET /api/portal/mitra/public → Ambil mitra publik
 * Auto-format path gambar jadi URL penuh (tanpa bug CORS)
 */
export async function GET() {
  try {
    const res = await api.get("/mitra/public");
    const mitra = res.data?.data || [];

    // Ambil base domain dari api.defaults.baseURL
    const base = (api.defaults.baseURL || "").replace(/\/api\/?$/, "");

    // Ubah semua path /storage/... jadi absolute URL
    const data = mitra.map((m: any) => ({
      ...m,
      img_id: m.img_id?.startsWith("/storage")
        ? `${base}${m.img_id}`
        : m.img_id,
      img_en: m.img_en?.startsWith("/storage")
        ? `${base}${m.img_en}`
        : m.img_en,
    }));

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("❌ MITRA PUBLIC GET ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data mitra publik." },
      { status: err.response?.status || 500 }
    );
  }
}
