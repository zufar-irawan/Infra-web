import api from "@/app/lib/api";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const res = await api.post("/auth/request-code", { email });
    return NextResponse.json(res.data);
  } catch (e: any) {
    console.error("Request-code error:", e.response?.data || e.message);
    return NextResponse.json(
      {
        success: false,
        message:
          e.response?.data?.message || "Gagal mengirim kode verifikasi.",
      },
      { status: 500 }
    );
  }
}
