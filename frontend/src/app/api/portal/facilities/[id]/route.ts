import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

// === UPDATE fasilitas ===
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const formData = await req.formData();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.post(`/facilities/${id}?_method=PUT`, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ UPDATE facility error:", err.response?.data || err.message);
    return NextResponse.json(
      {
        success: false,
        message: err.response?.data?.message || "Gagal memperbarui fasilitas.",
      },
      { status: err.response?.status || 500 }
    );
  }
}

// === DELETE fasilitas ===
export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.delete(`/facilities/${id}`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ DELETE facility error:", err.response?.data || err.message);
    return NextResponse.json(
      {
        success: false,
        message: err.response?.data?.message || "Gagal menghapus fasilitas.",
      },
      { status: err.response?.status || 500 }
    );
  }
}
