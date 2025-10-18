import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("portal-auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token tidak ditemukan." },
        { status: 401 }
      );
    }

    const res = await api.get("/portal/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ DASHBOARD ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      {
        success: false,
        message: err.response?.data?.message || "Gagal memuat dashboard.",
      },
      { status: err.response?.status || 500 }
    );
  }
}
