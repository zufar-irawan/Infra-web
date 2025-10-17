"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Loader2, AlertCircle, Clock, FileText, BookOpen } from "lucide-react";
import DashHeader from "@/app/components/DashHeader";
import { useEduData } from "@/app/edu/context";
import Link from "next/link";

import type { EduData, EduExamsPayload } from "@/app/edu/context";

type ExamQuestionOption = {
  id: number;
  option_text: string;
  is_correct: boolean;
};

type ExamQuestion = {
  id: number;
  type: "pg" | "essay";
  question_text: string;
  points: number;
  options?: ExamQuestionOption[];
};

type ExamDetail = {
  id: number;
  title: string;
  description?: string | null;
  date: string;
  start_time: string;
  end_time: string;
  subject?: any;
  class?: any;
  room?: any;
  creator?: any;
  questions?: ExamQuestion[];
};

type ExamResult = {
  id: number;
  exam_id: number;
  student_id: number;
  score: number;
  grade?: string | null;
  feedback?: string | null;
};

type AttemptState = {
  answers: Record<number, string>;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
};

const initialAttempt: AttemptState = {
  answers: {},
  isSubmitting: false,
  submitError: null,
  submitSuccess: false,
};

function useExamDetail(id?: string | string[]) {
  const [data, setData] = useState<ExamDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    axios
      .get(`/api/exam/${id}`)
      .then((res) => {
        if (cancelled) return;
        const payload = res.data ?? null;
        setData(payload);
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err?.response?.data?.message ??
          err?.message ??
          "Gagal memuat detail ujian.";
        setError(typeof message === "string" ? message : "Gagal memuat detail ujian.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return {
    data,
    loading,
    error,
    refresh: () => setData((prev) => (prev ? { ...prev } : prev)),
  };
}

function useExamQuestions(examId?: number) {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!examId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    axios
      .get("/api/exam-questions", {
        params: { exam_id: examId },
      })
      .then((res) => {
        if (cancelled) return;
        const items = Array.isArray(res.data?.data) ? res.data.data : [];
        setQuestions(items);
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err?.response?.data?.message ??
          err?.message ??
          "Gagal memuat soal ujian.";
        setError(typeof message === "string" ? message : "Gagal memuat soal ujian.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [examId]);

  return { questions, loading, error };
}

function useExamResults(examId?: number, studentId?: number) {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!examId || !studentId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    axios
      .get("/api/exam-results", {
        params: { exam_id: examId, student_id: studentId },
      })
      .then((res) => {
        if (cancelled) return;
        const items = Array.isArray(res.data?.data) ? res.data.data : [];
        setResults(items);
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err?.response?.data?.message ??
          err?.message ??
          "Gagal memuat hasil ujian.";
        setError(typeof message === "string" ? message : "Gagal memuat hasil ujian.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [examId, studentId]);

  return { results, loading, error };
}

function ExamMeta({ exam }: { exam: ExamDetail }) {
  const start = `${exam.start_time}`;
  const end = `${exam.end_time}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-orange-500" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Tanggal</p>
            <p className="text-sm font-medium text-gray-800">
              {new Date(exam.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-gray-500">
              {start} - {end}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-indigo-500" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Mata Pelajaran</p>
            <p className="text-sm font-medium text-gray-800">
              {exam.subject?.name ?? "-"}
            </p>
            <p className="text-xs text-gray-500">
              {exam.class?.name ? `Kelas ${exam.class.name}` : "Kelas tidak tersedia"}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-emerald-500" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Total Soal</p>
            <p className="text-sm font-semibold text-gray-800">
              {exam.questions ? exam.questions.length : "-"}
            </p>
            <p className="text-xs text-gray-500">
              {exam.questions && exam.questions.length > 0
                ? `${exam.questions.filter((q) => q.type === "pg").length} Pilihan Ganda • ${exam.questions.filter((q) => q.type === "essay").length} Essay`
                : "Tidak ada soal."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionBlock({
  question,
  value,
  onChange,
  disabled,
}: {
  question: ExamQuestion;
  value?: string;
  onChange: (next: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
          {question.points}
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-800">{question.question_text}</p>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              {question.type === "pg" ? "Pilihan Ganda" : "Essay"}
            </p>
          </div>

          {question.type === "pg" ? (
            <div className="grid gap-2">
              {question.options?.map((opt) => {
                const optionKey = `${question.id}-${opt.id}`;
                return (
                  <label
                    key={optionKey}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition ${
                      value === optionKey
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-200"
                    } ${disabled ? "opacity-70" : "cursor-pointer"}`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={value === optionKey}
                      onChange={() => onChange(optionKey)}
                      className="h-4 w-4 text-orange-500"
                      disabled={disabled}
                    />
                    <span className="text-gray-700">{opt.option_text}</span>
                    {disabled && opt.is_correct && (
                      <span className="text-xs font-semibold text-emerald-600">
                        • Jawaban Benar
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          ) : (
            <textarea
              rows={4}
              value={value ?? ""}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Tuliskan jawabanmu di sini..."
              disabled={disabled}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ResultSummary({ result }: { result: ExamResult }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-700">
      <h3 className="text-lg font-semibold">Nilai Kamu</h3>
      <p className="text-3xl font-bold mt-2">{result.score}</p>
      {result.grade && (
        <p className="mt-1 text-sm font-medium">Predikat: {result.grade}</p>
      )}
      {result.feedback && (
        <p className="mt-2 text-sm text-emerald-800">Feedback: {result.feedback}</p>
      )}
    </div>
  );
}

function useAttemptState(initial: AttemptState = initialAttempt) {
  const [state, setState] = useState<AttemptState>(initial);

  const setAnswer = (questionId: number, value: string) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value,
      },
    }));
  };

  const resetAttempt = () => setState(initialAttempt);

  const setSubmitting = (flag: boolean) =>
    setState((prev) => ({ ...prev, isSubmitting: flag }));

  const setSubmitError = (message: string | null) =>
    setState((prev) => ({ ...prev, submitError: message }));

  const setSubmitSuccess = (flag: boolean) =>
    setState((prev) => ({ ...prev, submitSuccess: flag }));

  return {
    ...state,
    setAnswer,
    resetAttempt,
    setSubmitting,
    setSubmitError,
    setSubmitSuccess,
  };
}

function calculateScore(questions: ExamQuestion[], answers: Record<number, string>) {
  let totalPoints = 0;
  let earnedPoints = 0;

  questions.forEach((question) => {
    totalPoints += question.points;
    if (question.type === "pg") {
      const selectedOptionKey = answers[question.id];
      if (!selectedOptionKey) return;
      const [, optionId] = selectedOptionKey.split("-").map(Number);
      const correct = question.options?.find((opt) => opt.is_correct);
      if (correct && correct.id === optionId) {
        earnedPoints += question.points;
      }
    } else {
      if ((answers[question.id] ?? "").trim().length > 0) {
        earnedPoints += Math.round(question.points * 0.6);
      }
    }
  });

  const calculated = totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
  return { totalPoints, earnedPoints, score: calculated };
}

export default function ExamDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "attempt";

  const { user, student } = useEduData();
  const { data: exam, loading, error } = useExamDetail(params?.id);
  const { questions, loading: loadingQuestions, error: questionError } = useExamQuestions(
    exam?.id
  );

  const studentId = useMemo(() => student?.id ?? student?.student_id ?? null, [student]);
  const { results, loading: loadingResults } = useExamResults(exam?.id, studentId ?? undefined);

  const attempt = useAttemptState(initialAttempt);

  useEffect(() => {
    if (exam && exam.questions) {
      attempt.resetAttempt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam?.id]);

  const isStudent = user?.role === "siswa";
  const isStaff = user && ["teacher", "admin"].includes(user.role);

  const existingResult = useMemo(() => results[0] ?? null, [results]);

  const handleSubmit = async () => {
    if (!exam || !studentId) return;
    attempt.setSubmitting(true);
    attempt.setSubmitError(null);

    try {
      const { score } = calculateScore(questions, attempt.answers);

      await axios.post("/api/exam-results", {
        exam_id: exam.id,
        student_id: studentId,
        score,
        feedback: "Jawaban kamu sudah direkam.",
      });

      attempt.setSubmitSuccess(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? err?.message ?? "Gagal mengirim jawaban.";
      attempt.setSubmitError(
        typeof message === "string" ? message : "Gagal mengirim jawaban."
      );
    } finally {
      attempt.setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/edu/ujian");
  };

  const canAttempt = isStudent && !existingResult;

  return (
    <div className="min-h-screen bg-gray-100">
      <DashHeader user={user} student={student} />

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Kembali ke daftar ujian
        </button>

        {loading && (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-12 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Memuat detail ujian...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {exam && (
          <section className="space-y-4">
            <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-orange-500">
                  <span>{exam.subject?.name ?? "Mata pelajaran"}</span>
                  <span className="text-gray-300">•</span>
                  <span>{exam.class?.name ?? "Kelas"}</span>
                  {exam.room?.name && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span>Ruangan {exam.room.name}</span>
                    </>
                  )}
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">{exam.title}</h1>
                {exam.description && (
                  <p className="text-sm text-gray-600 max-w-3xl">{exam.description}</p>
                )}
              </div>
            </header>

            <ExamMeta exam={{ ...exam, questions }} />

            {isStudent && existingResult && (
              <ResultSummary result={existingResult} />
            )}

            {isStudent && !existingResult && (
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-700">
                <p className="text-sm font-medium">Petunjuk pengerjaan</p>
                <ul className="mt-2 list-disc pl-5 text-xs text-sky-800 space-y-1">
                  <li>Pilih jawaban yang paling tepat untuk setiap soal pilihan ganda.</li>
                  <li>Jawaban essay minimal 2 kalimat untuk mendapatkan nilai maksimal.</li>
                  <li>Pastikan semua jawaban terisi sebelum menekan tombol Kirim.</li>
                  <li>Nilai dihitung otomatis, namun guru dapat melakukan penyesuaian.</li>
                </ul>
              </div>
            )}
          </section>
        )}

        <section className="space-y-4">
          {loadingQuestions && (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-12 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Memuat soal...
            </div>
          )}

          {questionError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle className="h-5 w-5" />
              {questionError}
            </div>
          )}

          {!loadingQuestions && questions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-400">
              Belum ada soal untuk ujian ini.
            </div>
          )}

          {questions.map((question) => (
            <QuestionBlock
              key={question.id}
              question={question}
              value={attempt.answers[question.id]}
              onChange={(value) => attempt.setAnswer(question.id, value)}
              disabled={!canAttempt}
            />
          ))}
        </section>

        {isStudent && (
          <footer className="sticky bottom-0 left-0 right-0 border-t border-gray-200 bg-white/90 backdrop-blur py-4">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
              {attempt.submitError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-xs text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {attempt.submitError}
                </div>
              )}

              {attempt.submitSuccess && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-2 text-xs text-emerald-600">
                  <AlertCircle className="h-4 w-4" />
                  Jawabanmu terkirim! Kamu dapat kembali ke halaman ujian.
                </div>
              )}

              <div className="flex w-full justify-end gap-2">
                <button
                  onClick={handleBack}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canAttempt || attempt.isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {attempt.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {existingResult ? "Sudah dinilai" : "Kirim Jawaban"}
                </button>
              </div>
            </div>
          </footer>
        )}

        {isStaff && (
          <aside className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 text-indigo-600">
            <h3 className="text-sm font-semibold">
              Mode Guru/Admin
            </h3>
            <p className="mt-1 text-xs">
              Pengelolaan detail soal dan koreksi manual akan tersedia di halaman manajemen ujian.
            </p>
            <Link
              href={`/edu/ujian/manage/${exam?.id ?? ""}`}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-indigo-300 px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
            >
              Buka Manajemen Ujian
            </Link>
          </aside>
        )}
      </main>
    </div>
  );
}
