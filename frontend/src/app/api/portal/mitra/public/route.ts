import { NextResponse } from "next/server";

// 🔒 Proxy GET /api/portal/mitra/public → Laravel HTTPS
export async function GET() {
  try {
    const res = await fetch("https://api.smkprestasiprima.sch.id/api/mitra/public", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ Gagal ambil data mitra:", res.status);
      return NextResponse.json(
        { success: false, message: "Gagal memuat data mitra" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("❌ Proxy mitra error:", err);
    return NextResponse.json(
      { success: false, message: "Tidak dapat mengambil data mitra" },
      { status: 500 }
    );
  }
}
