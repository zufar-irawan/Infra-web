import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    const res = await api.post("/auth/verify-code", { email, code });
    const data = res.data;

    if (data.success && data.token) {
      const cookieStore = await cookies();
      cookieStore.set("portal-auth-token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 hari
      });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("❌ VERIFY-CODE ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: err.response?.data?.message || "Gagal verifikasi kode." },
      { status: err.response?.status || 500 }
    );
  }
}
