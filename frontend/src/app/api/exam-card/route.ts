import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import api from "@/app/lib/api";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("secure-auth-token")?.value;

  if (!token)
    return NextResponse.json({ error: "Token tidak ada!" }, { status: 401 });

  try {
    const [examsRes, examResultsRes] = await Promise.all([
      api.get("/lms/exams", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      api.get("/lms/exam-results", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (examsRes.status === 200 && examResultsRes.status === 200) {
      const exams = examsRes.data.data;
      const examResults = examResultsRes.data.data;

      const completedExamIds = new Set(examResults.map((r: any) => r.exam_id));

      const totalExams = exams.length;
      const completedExams = exams.filter((e: any) =>
        completedExamIds.has(e.id)
      ).length;
      const uncompletedExams = exams.filter(
        (e: any) => !completedExamIds.has(e.id)
      );
      const pendingExams = totalExams - completedExams;
      const selesaiExams = exams.filter((e: any) =>
        completedExamIds.has(e.id)
      );

      return NextResponse.json({
        totalExams,
        completedExams,
        pendingExams,
        selesaiExams,
        uncompletedExams,
        exams,
      });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data." },
      { status: 500 }
    );
  }
}