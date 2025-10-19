import { NextResponse } from "next/server";
import api from "@/app/lib/api";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    const res = await api.post("/auth/verify-code", { email, code });
    const data = res.data;

    if (data.success && data.token) {
      const response = NextResponse.json({
        success: true,
        message: "Verifikasi berhasil",
        token_set: true,
      });

      response.cookies.set("portal-auth-token", data.token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true nanti kalau HTTPS
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24, // 1 hari
});


      return response;
    }

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
