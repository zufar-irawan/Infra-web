import { NextResponse } from "next/server";
import api from "@/app/lib/api";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    const res = await api.post("/auth/verify-code", { email, code });
    const data = res.data;

    // ✅ Kalau sukses, set cookie lebih dulu di response final
    if (data.success && data.token) {
      const response = NextResponse.json({
        success: true,
        message: "Verifikasi berhasil",
        token_set: true,
      });

      // Set cookie ke dalam response langsung
      response.cookies.set("portal-auth-token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 hari
      });

      return response;
    }

    // Kalau gagal verifikasi
    return NextResponse.json({
      success: false,
      message: data.message || "Kode salah atau sudah kadaluarsa.",
    });
  } catch (err: any) {
    console.error("❌ VERIFY-CODE ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      {
        success: false,
        message:
          err.response?.data?.message || "Gagal verifikasi kode. Coba lagi.",
      },
      { status: err.response?.status || 500 }
    );
  }
}
