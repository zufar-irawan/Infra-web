import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import api from "@/app/lib/api";

export async function GET() {
    const cookieStore = cookies()
    // @ts-ignore
    const token = cookieStore.get("secure-auth-token")?.value;

    if(!token) return NextResponse.json({ error: "Token tidak ada!" }, { status: 401 });

    try {
        // Fetch exams
        const examsRes = await api.get("/lms/exams", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        // Fetch exam results
        const examResultsRes = await api.get("/lms/exam-results", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (examsRes.status === 200 && examResultsRes.status === 200) {
            const exams = examsRes.data.data;
            const examResults = examResultsRes.data.data;

            // Map exam results by exam_id
            // @ts-ignore
            const completedExamIds = new Set(examResults.map(result => result.exam_id));

            // Calculate completed and pending exams
            const totalExams = exams.length;
            // @ts-ignore
            const completedExams = exams.filter(exam => completedExamIds.has(exam.id)).length;
            const uncompletedExams = exams.filter((exam: { id: number; }) => !completedExamIds.has(exam.id));
            const pendingExams = totalExams - completedExams;

            return NextResponse.json({
                totalExams,
                completedExams,
                pendingExams,
                uncompletedExams
            });
        }
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data." }, { status: 500 });
    }
}