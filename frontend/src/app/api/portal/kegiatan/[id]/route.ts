import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

// PUT /api/portal/kegiatan/[id]
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    // Convert ke FormData biar Laravel bisa baca
    const formData = new FormData();
    for (const key in body) {
      formData.append(key, body[key as keyof typeof body]);
    }

    // Laravel butuh _method spoofing agar bisa diterima sebagai PUT
    const res = await api.post(`/kegiatan/${id}?_method=PUT`, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ UPDATE KEGIATAN ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui kegiatan." },
      { status: err.response?.status || 500 }
    );
  }
}

// DELETE /api/portal/kegiatan/[id]
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.delete(`/kegiatan/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ DELETE KEGIATAN ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus kegiatan." },
      { status: err.response?.status || 500 }
    );
  }
}
