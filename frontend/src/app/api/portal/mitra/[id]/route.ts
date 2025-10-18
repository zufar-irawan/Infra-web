import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

/**
 * PUT /api/portal/mitra/[id] → Update mitra
 * DELETE /api/portal/mitra/[id] → Hapus mitra
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const formData = await req.formData();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    // Laravel update pakai POST + _method=PUT
    const res = await api.post(`/mitra/${id}?_method=PUT`, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ MITRA UPDATE ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data mitra." },
      { status: err.response?.status || 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.delete(`/mitra/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ MITRA DELETE ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data mitra." },
      { status: err.response?.status || 500 }
    );
  }
}
