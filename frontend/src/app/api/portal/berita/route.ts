import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

/**
 * GET /api/portal/berita → ambil semua berita
 * POST /api/portal/berita → tambah berita
 */
export async function GET() {
  try {
    const res = await api.get("/news");
    const news = res.data?.data || [];

    const data = news.map((n: any) => ({
      ...n,
      image: n.image?.startsWith("/storage") ? n.image : n.image,
    }));

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("❌ NEWS GET ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal memuat berita." },
      { status: err.response?.status || 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    const res = await api.post("/news", formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ NEWS CREATE ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: "Gagal menambah berita." },
      { status: err.response?.status || 500 }
    );
  }
}
