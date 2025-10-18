import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

// GET /api/portal/kegiatan
export async function GET() {
  try {
    const res = await api.get("/kegiatan");
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ GET KEGIATAN ERROR:", err.response?.data || err.message);
    return NextResponse.json({ success: false, message: "Gagal memuat kegiatan." }, { status: 500 });
  }
}

// POST /api/portal/kegiatan
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.post("/kegiatan", data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ CREATE KEGIATAN ERROR:", err.response?.data || err.message);
    return NextResponse.json({ success: false, message: "Gagal menambah kegiatan." }, { status: 500 });
  }
}
