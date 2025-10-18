import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

// === Update prestasi ===
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.post(`/achievements/${params.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ UPDATE achievement error:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui prestasi." },
      { status: err.response?.status || 500 }
    );
  }
}

// === Hapus prestasi ===
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.delete(`/achievements/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ DELETE achievement error:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus prestasi." },
      { status: err.response?.status || 500 }
    );
  }
}
