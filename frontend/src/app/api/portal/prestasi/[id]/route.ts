import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

/**
 * POST /api/portal/prestasi/[id] → Update Prestasi
 * DELETE /api/portal/prestasi/[id] → Hapus Prestasi
 */

// === UPDATE PRESTASI ===
export async function POST(req: Request, context: any) {
  try {
    const id = context.params?.id; // ambil id dari URL
    const formData = await req.formData();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.post(`/achievements/${id}`, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ UPDATE achievement error:", err.response?.data || err.message);
    return NextResponse.json(
      {
        success: false,
        message: err.response?.data?.message || "Gagal memperbarui prestasi.",
      },
      { status: err.response?.status || 500 }
    );
  }
}

// === HAPUS PRESTASI ===
export async function DELETE(_req: Request, context: any) {
  try {
    const id = context.params?.id; // ambil id dari URL
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.delete(`/achievements/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ DELETE achievement error:", err.response?.data || err.message);
    return NextResponse.json(
      {
        success: false,
        message: err.response?.data?.message || "Gagal menghapus prestasi.",
      },
      { status: err.response?.status || 500 }
    );
  }
}
