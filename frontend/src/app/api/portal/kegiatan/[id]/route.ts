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

    const res = await api.put(`/kegiatan/${id}`, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ UPDATE KEGIATAN ERROR:", err.response?.data || err.message);
    return NextResponse.json({ success: false, message: "Gagal memperbarui kegiatan." }, { status: 500 });
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
    return NextResponse.json({ success: false, message: "Gagal menghapus kegiatan." }, { status: 500 });
  }
}
