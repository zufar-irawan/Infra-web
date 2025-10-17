import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import api from "@/app/lib/api";

async function getToken() {
  return (await cookies()).get("secure-auth-token")?.value;
}

function buildErrorResponse(error: any) {
  const status = error?.response?.status ?? 500;
  const data = error?.response?.data ?? {
    message: "Terjadi kesalahan saat memproses soal ujian.",
  };
  return NextResponse.json(data, { status });
}

async function fetchAllQuestions(token: string) {
  const aggregated: any[] = [];
  let page = 1;
  let keepFetching = true;

  while (keepFetching) {
    const res = await api.get(`/lms/exam-questions?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const payload = res.data;
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
      ? payload.data
      : [];

    aggregated.push(...items);

    const meta = payload?.meta;
    if (!meta || meta.current_page >= meta.last_page) {
      keepFetching = false;
    } else {
      page += 1;
    }
  }

  return aggregated;
}

export async function GET(request: NextRequest) {
  const token = await getToken();
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const examId = searchParams.get("exam_id");

  if (examId) {
    try {
      const questions = await fetchAllQuestions(token);
      const filtered = questions.filter(
        (item: any) => (item.exam_id ?? item.examId) === Number(examId)
      );

      return NextResponse.json({
        data: filtered,
        meta: {
          total: filtered.length,
          exam_id: Number(examId),
        },
      });
    } catch (error: any) {
      console.error("Error fetching exam questions (filtered):", error);
      return buildErrorResponse(error);
    }
  }

  const searchQuery = searchParams.toString();
  const endpoint = searchQuery
    ? `/lms/exam-questions?${searchQuery}`
    : "/lms/exam-questions";

  try {
    const res = await api.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Error fetching exam questions:", error?.message ?? error);
    return buildErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken();
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = await request.json();
    const res = await api.post("/lms/exam-questions", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(res.data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating exam question:", error?.message ?? error);
    return buildErrorResponse(error);
  }
}
