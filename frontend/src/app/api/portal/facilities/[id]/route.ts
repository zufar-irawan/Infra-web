import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

// === Update FAQ ===
export async function PUT(req: Request, context: any) {
  try {
    const id = context.params?.id;
    const formData = await req.formData();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.post(`/faq/${id}?_method=PUT`, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ UPDATE faq error:", err.response?.data || err.message);
    return NextResponse.json(
      {
        success: false,
        message: err.response?.data?.message || "Gagal memperbarui FAQ.",
      },
      { status: err.response?.status || 500 }
    );
  }
}

// === Hapus FAQ ===
export async function DELETE(_req: Request, context: any) {
  try {
    const id = context.params?.id;
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.delete(`/faq/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ DELETE faq error:", err.response?.data || err.message);
    return NextResponse.json(
      {
        success: false,
        message: err.response?.data?.message || "Gagal menghapus FAQ.",
      },
      { status: err.response?.status || 500 }
    );
  }
}
