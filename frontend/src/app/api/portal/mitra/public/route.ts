import { NextResponse } from "next/server";
import api from "@/app/lib/api";

export async function GET() {
  try {
    const res = await api.get("/mitra/public");
    const mitra = res.data?.data || [];

    // Ubah path /storage/... jadi URL penuh, biar <img src> di FE langsung jalan
    const base = (api.defaults.baseURL || "").replace(/\/api\/?$/, "");
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
