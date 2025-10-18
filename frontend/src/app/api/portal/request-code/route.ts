import { NextResponse } from "next/server";
import api from "@/app/lib/api";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const res = await api.post("/auth/request-code", { email });
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("❌ REQUEST-CODE ERROR:", err.response?.data || err.message);
    return NextResponse.json(
      { success: false, message: err.response?.data?.message || "Gagal mengirim kode verifikasi." },
      { status: err.response?.status || 500 }
    );
  }
}
