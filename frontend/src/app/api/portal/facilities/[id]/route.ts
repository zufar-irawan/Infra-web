import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

// === Update fasilitas ===
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.post(`/facilities/${params.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ UPDATE facility error:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui fasilitas." },
      { status: err.response?.status || 500 }
    );
  }
}

// === Hapus fasilitas ===
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.delete(`/facilities/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ DELETE facility error:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus fasilitas." },
      { status: err.response?.status || 500 }
    );
  }
}
