import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

/**
 * PUT /api/portal/mitra/[id] → Update mitra
 * DELETE /api/portal/mitra/[id] → Hapus mitra
 */

// === UPDATE MITRA ===
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const formData = await req.formData();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    // Laravel butuh spoofing method PUT
    formData.append("_method", "PUT");

    const res = await api.post(`/mitra/${id}`, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ MITRA UPDATE ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      {
        success: false,
        message: err.response?.data?.message || "Gagal memperbarui data mitra.",
      },
      { status: err.response?.status || 500 }
    );
  }
}

// === HAPUS MITRA ===
export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.delete(`/mitra/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ MITRA DELETE ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      {
        success: false,
        message: err.response?.data?.message || "Gagal menghapus data mitra.",
      },
      { status: err.response?.status || 500 }
    );
  }
}
