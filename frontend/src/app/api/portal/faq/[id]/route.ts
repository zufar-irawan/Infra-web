import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

/**
 * PUT /api/portal/faq/[id] → Update FAQ
 * DELETE /api/portal/faq/[id] → Hapus FAQ
 */

// === UPDATE FAQ ===
export async function PUT(req: Request, context: any) {
  try {
    const id = context.params?.id; // ambil id dari URL
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.put(`/faqs/${id}`, body, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ FAQ UPDATE ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      {
        success: false,
        message: err.response?.data?.message || "Gagal memperbarui FAQ.",
      },
      { status: err.response?.status || 500 }
    );
  }
}

// === DELETE FAQ ===
export async function DELETE(_req: Request, context: any) {
  try {
    const id = context.params?.id; // ambil id dari URL
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.delete(`/faqs/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ FAQ DELETE ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      {
        success: false,
        message: err.response?.data?.message || "Gagal menghapus FAQ.",
      },
      { status: err.response?.status || 500 }
    );
  }
}
