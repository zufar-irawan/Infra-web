import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// This API proxies multipart uploads to the Laravel backend
// Expected incoming form fields:
// - assignment_id (or alias: assignmet_id)
// - student_id
// - files[]
// - grade (default "0")
// - feedback (default "")
// - submitted_at (example: "2025-09-25 20:00:00")
export async function POST(req: NextRequest) {
  try {
    const incoming = await req.formData();

    // Normalize field names and defaults
    const assignmentId = (incoming.get("assignment_id") || incoming.get("assignmet_id") || "").toString();
    const studentId = (incoming.get("student_id") || "").toString();
    const grade = (incoming.get("grade") ?? "0").toString();
    const feedback = (incoming.get("feedback") ?? "").toString();
    const submittedAt = (incoming.get("submitted_at") ?? "").toString();

    // Collect files from either files[] or files
    let files: any[] = [];
    const arrA = incoming.getAll("files[]");
    const arrB = incoming.getAll("files");
    files = (arrA.length ? arrA : arrB).filter(Boolean);

    // Build outgoing form data with correct keys expected by Laravel
    const out = new FormData();
    out.append("assignment_id", assignmentId);
    out.append("student_id", studentId);
    out.append("grade", grade);
    out.append("feedback", feedback);
    if (submittedAt) out.append("submitted_at", submittedAt);

    files.forEach((f) => {
      if (f instanceof File) out.append("files[]", f);
    });

    // Auth header: prefer incoming Authorization, fallback to cookie token
    const incomingAuth = req.headers.get("authorization");
    const cookieStore = cookies();
    // @ts-ignore
    const cookieToken = cookieStore.get("secure-auth-token")?.value;
    const authHeader = incomingAuth || (cookieToken ? `Bearer ${cookieToken}` : undefined);

    const upstream = await fetch("http://localhost:8000/api/lms/assignment-submissions", {
      method: "POST",
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: out,
    });

    const ct = upstream.headers.get("content-type") || "";
    const isJson = ct.includes("application/json");

    if (!upstream.ok) {
      const payload = isJson ? await upstream.json().catch(() => ({})) : await upstream.text().catch(() => "");
      const errorBody = isJson ? payload : { message: typeof payload === "string" ? payload : "Upstream error" };
      return NextResponse.json({ ok: false, status: upstream.status, ...errorBody }, { status: upstream.status });
    }

    const data = isJson ? await upstream.json().catch(() => ({})) : await upstream.text().catch(() => "");
    return NextResponse.json(typeof data === "string" ? { ok: true, data } : data, { status: upstream.status });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message || "Terjadi kesalahan saat upload" },
      { status: 500 }
    );
  }
}