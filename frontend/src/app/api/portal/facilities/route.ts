import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

// === Ambil semua fasilitas ===
export async function GET() {
  try {
    const res = await api.get("/facilities");
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ GET facilities error:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data fasilitas." },
      { status: err.response?.status || 500 }
    );
  }
}

// === Tambah fasilitas ===
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // ambil token dari cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.post("/facilities", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ CREATE facility error:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan fasilitas." },
      { status: err.response?.status || 500 }
    );
  }
}
