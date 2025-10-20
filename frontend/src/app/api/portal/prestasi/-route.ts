import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

// === Ambil semua prestasi ===
export async function GET() {
  try {
    const res = await api.get("/achievements");
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ GET achievements error:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data prestasi." },
      { status: err.response?.status || 500 }
    );
  }
}

// === Tambah prestasi ===
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.post("/achievements", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ CREATE achievement error:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan prestasi." },
      { status: err.response?.status || 500 }
    );
  }
}
