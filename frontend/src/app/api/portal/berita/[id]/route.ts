import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";
/**
 * UPDATE BERITA (PUT via POST spoof)
 */
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const formData = await req.formData();

    // 🔸 Tambahkan _method=PUT agar Laravel mengenali update
    formData.append("_method", "PUT");

    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    // Kirim sebagai POST ke Laravel (bukan PUT asli)
    const res = await api.post(`/news/${id}`, formData, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ UPDATE NEWS ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui berita." },
      { status: err.response?.status || 500 }
    );
  }
}

/**
 * DELETE /api/portal/berita/[id]
 */
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ✅ wajib di-await
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.delete(`/news/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ DELETE NEWS ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus berita." },
      { status: err.response?.status || 500 }
    );
  }
}

