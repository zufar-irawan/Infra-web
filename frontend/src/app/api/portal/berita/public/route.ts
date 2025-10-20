import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 🔒 Ambil dari API Laravel pakai HTTPS langsung
    const res = await fetch("https://api.smkprestasiprima.sch.id/api/news", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("❌ Proxy berita error:", err);
    return NextResponse.json(
      { success: false, message: "Gagal ambil data berita" },
      { status: 500 }
    );
  }
}
