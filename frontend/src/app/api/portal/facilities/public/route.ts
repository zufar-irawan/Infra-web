import { NextResponse } from "next/server";

// 🔒 Proxy GET /api/portal/facilities/public → Laravel HTTPS
export async function GET() {
  try {
    const res = await fetch("https://api.smkprestasiprima.sch.id/api/facilities/public", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ Gagal ambil data fasilitas:", res.status);
      return NextResponse.json(
        { success: false, message: "Gagal memuat data fasilitas" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("❌ Proxy facilities error:", err);
    return NextResponse.json(
      { success: false, message: "Tidak dapat mengambil data fasilitas" },
      { status: 500 }
    );
  }
}
