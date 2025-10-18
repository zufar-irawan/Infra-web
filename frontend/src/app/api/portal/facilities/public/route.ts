import { NextResponse } from "next/server";
import api from "@/app/lib/api";

export async function GET() {
  try {
    const res = await api.get("/facilities/public");
    const facilities = res.data?.data || [];

    // Biarkan path gambar apa adanya, tanpa base URL/env
    const data = facilities.map((f: any) => ({
      ...f,
      img_id: f.img_id?.startsWith("/storage") ? f.img_id : f.img_id,
      img_en: f.img_en?.startsWith("/storage") ? f.img_en : f.img_en,
    }));

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error(
      "❌ FACILITIES PUBLIC ERROR:",
      err.response?.data || err.message
    );
    return NextResponse.json(
      { success: false, message: "Gagal memuat data fasilitas publik." },
      { status: err.response?.status || 500 }
    );
  }
}
