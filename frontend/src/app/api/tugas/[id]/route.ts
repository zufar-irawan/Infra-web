// filepath: c:\laragon\www\Infra-web\frontend\src\app\api\tugas\[id]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/app/lib/api";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const cookieStore = await cookies();
  const token = cookieStore.get("secure-auth-token")?.value;

  if (!token) return NextResponse.json({ error: "Token tidak ada!" }, { status: 401 });
  if (!id) return NextResponse.json({ error: "ID tugas tidak valid" }, { status: 400 });

  try {
    const res = await api.get(`/lms/assignments/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    const data = error?.response?.data ?? { error: "Gagal mengambil detail tugas" };
    return NextResponse.json(data, { status });
  }
}

// Update grade (required) and feedback (optional) for a submission.
// For PUT, the dynamic [id] is treated as the submission_id if present.
// Payload accepted (JSON): { grade: number|string, feedback?: string, submission_id?: string|number }
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("secure-auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({} as any));
    const { id: pathId } = await context.params;

    // Allow submission_id in body; otherwise use [id] from path.
    const submissionIdRaw = body?.submission_id ?? pathId;
    if (!submissionIdRaw) {
      return NextResponse.json(
        { error: "submission_id tidak ditemukan" },
        { status: 400 }
      );
    }

    const submissionId = String(submissionIdRaw);
    const gradeRaw = body?.grade;
    if (gradeRaw === undefined || gradeRaw === null || gradeRaw === "") {
      return NextResponse.json(
        { error: "Field 'grade' wajib diisi" },
        { status: 400 }
      );
    }

    // Coerce grade to number if possible; otherwise send as string
    const gradeNum = typeof gradeRaw === "number" ? gradeRaw : Number(gradeRaw);
    const payload: any = {
      grade: Number.isFinite(gradeNum) ? gradeNum : gradeRaw,
    };

    if (typeof body?.feedback === "string") {
      payload.feedback = body.feedback;
    }

    const res = await api.put(
      `/lms/assignment-submissions/${encodeURIComponent(submissionId)}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json(res.data ?? { ok: true }, { status: res.status });
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    const data = error?.response?.data ?? { error: "Gagal memperbarui nilai" };
    return NextResponse.json(data, { status });
  }
}
