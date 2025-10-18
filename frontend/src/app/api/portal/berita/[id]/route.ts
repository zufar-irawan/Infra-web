import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

/**
 * UPDATE & DELETE /api/portal/berita/[id]
 */

// === UPDATE BERITA ===
export async function PUT(req: Request, context: any) {
  try {
    const id = context.params?.id;
    const formData = await req.formData();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    // Laravel butuh spoof _method
    formData.append("_method", "PUT");

    const res = await api.post(`/news/${id}`, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ NEWS UPDATE ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui berita." },
      { status: err.response?.status || 500 }
    );
  }
}

// === HAPUS BERITA ===
export async function DELETE(_req: Request, context: any) {
  try {
    const id = context.params?.id;
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.delete(`/news/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ NEWS DELETE ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus berita." },
      { status: err.response?.status || 500 }
    );
  }
}
