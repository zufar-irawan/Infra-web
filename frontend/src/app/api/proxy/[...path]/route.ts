import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.smkprestasiprima.sch.id/api";

// ✅ Versi aman untuk Next.js 15+ — params harus di-await
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params; // 🔥 fix utama
  const url = `${API_BASE}/${path.join("/")}`;
  console.log("➡️ Proxy GET:", url);

  try {
    const res = await fetch(url, { cache: "no-store" });
    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await res.text();
      console.error("⚠️ Response bukan JSON:", text.slice(0, 200));
      return NextResponse.json(
        { success: false, message: "Invalid JSON response dari backend" },
        { status: 500 }
      );
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (err) {
    console.error("❌ Proxy GET error:", err);
    return NextResponse.json(
      { success: false, message: "Gagal proxy GET" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${API_BASE}/${path.join("/")}`;
  console.log("➡️ Proxy POST:", url);

  try {
    const formData = await req.formData();
    const res = await fetch(url, { method: "POST", body: formData });
    const json = await res.json();
    return NextResponse.json(json);
  } catch (err) {
    console.error("❌ Proxy POST error:", err);
    return NextResponse.json(
      { success: false, message: "Gagal proxy POST" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${API_BASE}/${path.join("/")}`;
  console.log("➡️ Proxy DELETE:", url);

  try {
    const res = await fetch(url, { method: "DELETE" });
    const json = await res.json();
    return NextResponse.json(json);
  } catch (err) {
    console.error("❌ Proxy DELETE error:", err);
    return NextResponse.json(
      { success: false, message: "Gagal proxy DELETE" },
      { status: 500 }
    );
  }
}
