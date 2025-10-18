import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

/**
 * GET /api/portal/faq → Ambil semua FAQ
 * POST /api/portal/faq → Tambah FAQ
 */
export async function GET() {
  try {
    const res = await api.get("/faqs");
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ FAQ GET ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data FAQ." },
      { status: err.response?.status || 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.post("/faqs", body, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ FAQ CREATE ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: err.response?.data?.message || "Gagal menambah FAQ." },
      { status: err.response?.status || 500 }
    );
  }
}
