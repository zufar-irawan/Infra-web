import { NextResponse } from "next/server";

export async function GET(req: Request, context: Promise<{ params: { id: string } }>) {
  try {
    const { params } = await context;
    const { id } = params;

    // 🔒 Ambil data dari Laravel HTTPS
    const res = await fetch(`https://api.smkprestasiprima.sch.id/api/news/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`❌ Gagal ambil detail berita: ${res.status}`);
      return NextResponse.json(
        { success: false, message: "Data berita tidak ditemukan" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("❌ Proxy detail berita error:", err);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil detail berita" },
      { status: 500 }
    );
  }
}
