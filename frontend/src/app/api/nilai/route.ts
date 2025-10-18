import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import api from "@/app/lib/api";

// Helper to safely extract array data from API responses that may wrap in { data: ... }
function getPayloadArray<T = any>(res: any): T[] {
  if (!res) return [];
  const data = res.data ?? res;
  if (Array.isArray(data)) return data as T[];
  if (Array.isArray(data?.data)) return data.data as T[];
  return [];
}

function toStrId(v: any): string | null {
  if (v === null || v === undefined) return null;
  try {
    return String(v);
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentIdParam = searchParams.get("student_id");
  const studentId = toStrId(studentIdParam);

  if (!studentId) {
    return NextResponse.json(
      { error: "Query parameter 'student_id' is required" },
      { status: 400 }
    );
  }

  const token = (await cookies()).get("auth-token")?.value || null;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Fetch all needed resources in parallel
    const headers = { Authorization: `Bearer ${token}` };
    const [
      submissionsRes,
      assignmentsRes,
      teachersRes,
      examsRes,
      subjectsRes,
    ] = await Promise.all([
      api.get("/lms/assignment-submissions", { headers }).catch((e) => ({ error: e })),
      api.get("/lms/assignments", { headers }).catch((e) => ({ error: e })),
      api.get("/lms/teachers", { headers }).catch((e) => ({ error: e })),
      api.get("/lms/exam-results", { headers }).catch((e) => ({ error: e })),
      api.get("/lms/subjects", { headers }).catch((e) => ({ error: e })),
    ]);

    if ((submissionsRes as any)?.error || (assignmentsRes as any)?.error || (teachersRes as any)?.error || (examsRes as any)?.error || (subjectsRes as any)?.error) {
      return NextResponse.json(
        { error: "Failed to fetch required data" },
        { status: 502 }
      );
    }

    const submissions = getPayloadArray<any>(submissionsRes);
    const assignments = getPayloadArray<any>(assignmentsRes);
    const teachers = getPayloadArray<any>(teachersRes);
    const examResults = getPayloadArray<any>(examsRes);
    const subjects = getPayloadArray<any>(subjectsRes);

    // Build lookup maps
    const subjectIdToName = new Map<string, string>();
    for (const s of subjects) {
      const id = toStrId(s?.id) ?? toStrId(s?.subject_id);
      const name = s?.name ?? s?.subject_name ?? s?.title;
      if (id && typeof name === "string" && name) subjectIdToName.set(id, name);
    }

    const assignmentIdToTeacherId = new Map<string, string>();
    for (const a of assignments) {
      const aid = toStrId(a?.id) ?? toStrId(a?.assignment_id) ?? toStrId(a?.assigments_id) ?? toStrId(a?.assignments_id);
      const createdBy = toStrId(a?.created_by) ?? toStrId(a?.teacher_id) ?? toStrId(a?.user_id);
      if (aid && createdBy) assignmentIdToTeacherId.set(aid, createdBy);
    }

    // Map teacherId -> subjectName via specialization or explicit subject
    const teacherIdToSubjectName = new Map<string, string>();
    for (const t of teachers) {
      const tid = toStrId(t?.id) ?? toStrId(t?.teacher_id) ?? toStrId(t?.user_id);
      if (!tid) continue;
      const spec = t?.specialization ?? t?.subject ?? t?.subject_name;
      const specId = toStrId(t?.subject_id) ?? toStrId(t?.specialization_id);
      let subjectName: string | undefined;

      if (specId && subjectIdToName.has(specId)) subjectName = subjectIdToName.get(specId)!;
      else if (typeof spec === "string" && spec.trim()) subjectName = spec.trim();

      if (!subjectName) subjectName = "Unknown";
      teacherIdToSubjectName.set(tid, subjectName);
    }

    // Aggregator: subjectName -> { total: number, count: number }
    const aggregate = new Map<string, { total: number; count: number }>();

    // Process assignment submissions for the student
    for (const sub of submissions) {
      const sid = toStrId(sub?.student_id) ?? toStrId(sub?.student?.id);
      if (sid !== studentId) continue;

      const assignmentId = toStrId(sub?.assignment_id) ?? toStrId(sub?.assigments_id) ?? toStrId(sub?.assignments_id) ?? toStrId(sub?.assignment?.id);
      if (!assignmentId) continue;
      const teacherId = assignmentIdToTeacherId.get(assignmentId);
      if (!teacherId) continue;

      const subjectName = teacherIdToSubjectName.get(teacherId) ?? "Unknown";
      const gradeValRaw = sub?.grade ?? sub?.score ?? sub?.value ?? 0;
      const grade = typeof gradeValRaw === "number" ? gradeValRaw : Number(gradeValRaw) || 0;

      const node = aggregate.get(subjectName) ?? { total: 0, count: 0 };
      node.total += grade;
      node.count += 1;
      aggregate.set(subjectName, node);
    }

    // Process exam results for the student
    for (const ex of examResults) {
      const sid = toStrId(ex?.student_id) ?? toStrId(ex?.student?.id);
      if (sid !== studentId) continue;

      // exam may be embedded or flattened
      const examObj = ex?.exam ?? ex;
      const subjId = toStrId(examObj?.subject_id) ?? toStrId(examObj?.subject?.id) ?? toStrId(ex?.subject_id);
      const subjectName = (subjId && subjectIdToName.get(subjId)) || examObj?.subject?.name || "Unknown";

      const scoreRaw = ex?.score ?? ex?.grade ?? ex?.value ?? 0;
      const score = typeof scoreRaw === "number" ? scoreRaw : Number(scoreRaw) || 0;

      const node = aggregate.get(subjectName) ?? { total: 0, count: 0 };
      node.total += score;
      node.count += 1;
      aggregate.set(subjectName, node);
    }

    // Build response shape
    const nilai_mapel: Record<string, { nilai_median: number; total_nilai: number }> = {};
    const sortedSubjects = Array.from(aggregate.keys()).sort((a, b) => a.localeCompare(b));

    let sumTotal = 0;
    let sumCount = 0;
    let best: { subject: string; avg: number; total: number } | null = null;
    let worst: { subject: string; avg: number; total: number } | null = null;

    for (const subjectName of sortedSubjects) {
      const { total, count } = aggregate.get(subjectName)!;
      const avg = count > 0 ? total / count : 0;
      nilai_mapel[subjectName] = {
        nilai_median: Number(avg.toFixed(2)),
        total_nilai: Number(total.toFixed(2)),
      };

      sumTotal += total;
      sumCount += count;

      if (!best || avg > best.avg) best = { subject: subjectName, avg, total };
      if (!worst || avg < worst.avg) worst = { subject: subjectName, avg, total };
    }

    const overallAvg = sumCount > 0 ? Number((sumTotal / sumCount).toFixed(2)) : 0;

    const ringkasan = {
      rata_rata_keseluruhan: overallAvg,
      nilai_tertinggi: best
        ? {
            mata_pelajaran: best.subject,
            nilai_median: Number(best.avg.toFixed(2)),
            total_nilai: Number(best.total.toFixed(2)),
          }
        : null,
      nilai_terendah: worst
        ? {
            mata_pelajaran: worst.subject,
            nilai_median: Number(worst.avg.toFixed(2)),
            total_nilai: Number(worst.total.toFixed(2)),
          }
        : null,
    };

    return NextResponse.json({ nilai_mapel, ringkasan });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? e }, { status: 500 });
  }
}