import { NextResponse } from "next/server";
import api from "@/app/lib/api";

// === GET berita untuk halaman publik ===
export async function GET() {
  try {
    const res = await api.get("/news");
    const news = res.data?.data || [];

    // Sama gaya seperti route lain — tanpa hardcode URL/env
    const data = news.map((n: any) => ({
      ...n,
      image: n.image?.startsWith("/storage") ? n.image : n.image,
    }));

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("❌ PUBLIC /berita error:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal memuat berita publik." },
      { status: err.response?.status || 500 }
    );
  }
}
