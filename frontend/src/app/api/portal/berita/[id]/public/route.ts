import { NextResponse } from "next/server";
import api from "@/app/lib/api";

/**
 * GET /api/portal/berita/[id]/public
 * Ambil detail satu berita untuk halaman publik
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Ambil data dari Laravel API
    const res = await api.get(`/news/${id}`);
    const n = res.data?.data;

    if (!n) {
      return NextResponse.json(
        { success: false, message: "Berita tidak ditemukan." },
        { status: 404 }
      );
    }

    // Normalisasi gambar tanpa embel-embel URL/env
    const berita = {
      ...n,
      image: n.image?.startsWith("/storage") ? n.image : n.image,
    };

    return NextResponse.json({ success: true, data: berita });
  } catch (err: any) {
    console.error(
      "❌ PUBLIC DETAIL NEWS ERROR:",
      err.response?.data || err.message
    );
    return NextResponse.json(
      { success: false, message: "Gagal memuat detail berita." },
      { status: err.response?.status || 500 }
    );
  }
}
