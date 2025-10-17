"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import axios from "axios";
import { Loader2, Trash2, PlusCircle, Save, AlertCircle } from "lucide-react";
import DashHeader from "@/app/components/DashHeader";
import { useEduData } from "@/app/edu/context";
import Link from "next/link";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const questionTemplate = () => ({
  type: "pg" as "pg" | "essay",
  question_text: "",
  points: 10,
  options: [
    { option_text: "", is_correct: true },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
  ],
});

type ExamPayload = {
  subject_id: number;
  class_id: number;
  title: string;
  description?: string;
  date: string;
  start_time: string;
  end_time: string;
};

type QuestionForm = ReturnType<typeof questionTemplate> & { id?: number };

type OptionForm = {
  option_text: string;
  is_correct: boolean;
  id?: number;
};

type OptionGroupProps = {
  questionIndex: number;
  options: OptionForm[];
  onChange: (next: OptionForm[]) => void;
};

function OptionGroup({ questionIndex, options, onChange }: OptionGroupProps) {
  const updateOption = (idx: number, patch: Partial<OptionForm>) => {
    const next = options.map((opt, index) =>
      index === idx ? { ...opt, ...patch } : opt
    );

    if (patch.is_correct) {
      onChange(
        next.map((opt, index) => ({
          ...opt,
          is_correct: index === idx,
        }))
      );
    } else {
      onChange(next);
    }
  };

  const addOption = () => {
    onChange([
      ...options,
      {
        option_text: "",
        is_correct: options.length === 0,
      },
    ]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    const next = options.filter((_, index) => index !== idx);
    if (!next.some((opt) => opt.is_correct)) {
      next[0] = { ...next[0], is_correct: true };
    }
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {options.map((opt, idx) => (
        <div
          key={`${questionIndex}-${idx}`}
          className={`flex flex-col gap-2 rounded-lg border px-3 py-2 text-sm transition ${
            opt.is_correct
              ? "border-emerald-400 bg-emerald-50"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <input
              type="radio"
              checked={opt.is_correct}
              onChange={() => updateOption(idx, { is_correct: true })}
              className="h-4 w-4 text-emerald-500"
            />
            <span className="text-xs uppercase tracking-wide text-gray-400">
              {opt.is_correct ? "Jawaban Benar" : `Pilihan ${idx + 1}`}
            </span>
          </div>
          <textarea
            value={opt.option_text}
            onChange={(e) => updateOption(idx, { option_text: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
            placeholder={`Tulis pilihan jawaban ${idx + 1}`}
          />
          {options.length > 2 && (
            <button
              type="button"
              onClick={() => removeOption(idx)}
              className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-400"
            >
              <Trash2 className="h-3 w-3" />
              Hapus pilihan
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addOption}
        className="inline-flex items-center gap-2 text-xs text-orange-500 hover:text-orange-400"
      >
        <PlusCircle className="h-4 w-4" />
        Tambah pilihan
      </button>
    </div>
  );
}

function QuestionEditor({
  question,
  onChange,
  onRemove,
  index,
}: {
  question: QuestionForm;
  onChange: (next: QuestionForm) => void;
  onRemove: () => void;
  index: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
            {question.points}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              {question.type === "pg" ? "Pilihan Ganda" : "Essay"}
            </p>
            <input
              value={question.question_text}
              onChange={(e) => onChange({ ...question, question_text: e.target.value })}
              placeholder="Tulis pertanyaan di sini"
              className="w-full max-w-xl border-none text-lg font-semibold text-gray-800 focus:outline-none focus:ring-0"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={question.type}
            onChange={(e) => onChange({ ...question, type: e.target.value as "pg" | "essay" })}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <option value="pg">Pilihan Ganda</option>
            <option value="essay">Essay</option>
          </select>
          <input
            type="number"
            min={1}
            value={question.points}
            onChange={(e) => onChange({ ...question, points: Number(e.target.value) })}
            className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
            Hapus soal
          </button>
        </div>
      </header>

      {question.type === "pg" ? (
        <OptionGroup
          questionIndex={index}
          options={question.options}
          onChange={(opts) => onChange({ ...question, options: opts })}
        />
      ) : (
        <textarea
          value={question.options?.[0]?.option_text ?? ""}
          onChange={(e) =>
            onChange({
              ...question,
              options: [
                {
                  option_text: e.target.value,
                  is_correct: true,
                },
              ],
            })
          }
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          placeholder="Panduan penilaian essay..."
        />
      )}
    </div>
  );
}

export default function ManageExamDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, student, subjects, teachers } = useEduData();

  const examId = params?.id;

  const { data: examData, error: examError, isLoading: examLoading } = useSWR(
    `/api/exam/${examId}`,
    fetcher
  );
  const { data: questionData, error: questionError, isLoading: questionLoading, mutate: mutateQuestions } = useSWR(
    `/api/exam-questions?exam_id=${examId}`,
    fetcher
  );

  const [examForm, setExamForm] = useState<ExamPayload | null>(null);
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [savingExam, setSavingExam] = useState(false);
  const [savingQuestions, setSavingQuestions] = useState(false);

  useEffect(() => {
    if (!examData) return;
    setExamForm({
      subject_id: examData.subject_id ?? examData.subject?.id ?? 0,
      class_id: examData.class_id ?? examData.class?.id ?? 0,
      title: examData.title ?? "",
      description: examData.description ?? "",
      date: examData.date ?? "",
      start_time: examData.start_time ?? "",
      end_time: examData.end_time ?? "",
    });
  }, [examData]);

  useEffect(() => {
    if (!questionData) return;
    const items = Array.isArray(questionData?.data)
      ? questionData.data
      : Array.isArray(questionData)
      ? questionData
      : [];

    setQuestions(
      items.map((item: any) => ({
        id: item.id,
        type: item.type,
        question_text: item.question_text,
        points: item.points,
        options: Array.isArray(item.options)
          ? item.options.map((opt: any) => ({
              id: opt.id,
              option_text: opt.option_text,
              is_correct: Boolean(opt.is_correct),
            }))
          : questionTemplate().options,
      }))
    );
  }, [questionData]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, questionTemplate()]);
  };

  const handleUpdateQuestion = (index: number, next: QuestionForm) => {
    setQuestions((prev) => prev.map((item, idx) => (idx === index ? next : item)));
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const saveExam = async () => {
    if (!examForm) return;
    setSavingExam(true);
    setAlerts([]);
    try {
      await axios.patch(`/api/exam/${examId}`, examForm);
      setAlerts(["Data ujian berhasil diperbarui."]);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? "Gagal menyimpan data ujian.";
      setAlerts([typeof message === "string" ? message : "Gagal menyimpan data ujian."]);
    } finally {
      setSavingExam(false);
    }
  };

  const saveQuestions = async () => {
    setSavingQuestions(true);
    setAlerts([]);
    try {
      const payloads = questions.map((question) => ({
        exam_id: Number(examId),
        type: question.type,
        question_text: question.question_text,
        points: question.points,
        options:
          question.type === "pg"
            ? question.options
            : undefined,
      }));

      for (const question of questions) {
        if (question.id) {
          await axios.patch(`/api/exam-questions/${question.id}`, {
            type: question.type,
            question_text: question.question_text,
            points: question.points,
            options:
              question.type === "pg"
                ? question.options
                : undefined,
          });
        } else {
          await axios.post(`/api/exam-questions`, {
            exam_id: Number(examId),
            type: question.type,
            question_text: question.question_text,
            points: question.points,
            options:
              question.type === "pg"
                ? question.options
                : undefined,
          });
        }
      }

      setAlerts(["Soal ujian berhasil disimpan."]);
      mutateQuestions();
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? "Gagal menyimpan soal.";
      setAlerts([typeof message === "string" ? message : "Gagal menyimpan soal."]);
    } finally {
      setSavingQuestions(false);
    }
  };

  const deleteExam = async () => {
    if (!confirm("Yakin ingin menghapus ujian ini?")) return;
    try {
      await axios.delete(`/api/exam/${examId}`);
      router.push("/edu/ujian/manage");
    } catch (err) {
      setAlerts(["Gagal menghapus ujian. Silakan coba lagi."]);
    }
  };

  const totalPoints = useMemo(
    () => questions.reduce((sum, q) => sum + (q.points || 0), 0),
    [questions]
  );

  const pendingChanges = useMemo(
    () => questions.some((question) => !question.question_text.trim()),
    [questions]
  );

  return (
    <div className="min-h-screen bg-gray-100">

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/edu/ujian/manage"
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
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900 mt-2">
              {examForm?.title ?? "Kelola Ujian"}
            </h1>
            <p className="text-sm text-gray-500">
              Atur informasi ujian dan kelola soal beserta kunci jawabannya.
            </p>
          </div>
          <button
            onClick={deleteExam}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Hapus Ujian
          </button>
        </header>

        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-700">
                <AlertCircle className="h-4 w-4" />
                {alert}
              </div>
            ))}
          </div>
        )}

        <section className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Informasi Ujian</h2>

            {examLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Memuat detail ujian...
              </div>
            )}

            {examError && (
              <div className="text-sm text-red-500">
                Gagal memuat detail ujian. Silakan refresh halaman.
              </div>
            )}

            {examForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-xs font-medium text-gray-500">Judul Ujian</span>
                  <input
                    value={examForm.title}
                    onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-medium text-gray-500">Deskripsi</span>
                  <textarea
                    value={examForm.description ?? ""}
                    onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-medium text-gray-500">Tanggal Ujian</span>
                  <input
                    type="date"
                    value={examForm.date}
                    onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Mulai</span>
                    <input
                      type="time"
                      value={examForm.start_time}
                      onChange={(e) => setExamForm({ ...examForm, start_time: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Selesai</span>
                    <input
                      type="time"
                      value={examForm.end_time}
                      onChange={(e) => setExamForm({ ...examForm, end_time: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                  </label>
                </div>
                <label className="space-y-1">
                  <span className="text-xs font-medium text-gray-500">Mata Pelajaran</span>
                  <select
                    value={examForm.subject_id}
                    onChange={(e) => setExamForm({ ...examForm, subject_id: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="0">Pilih Mata Pelajaran</option>
                    {subjects?.map((subject: any) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-medium text-gray-500">Kelas</span>
                  <input
                    value={examForm.class_id}
                    onChange={(e) => setExamForm({ ...examForm, class_id: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </label>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={saveExam}
                disabled={savingExam}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingExam && <Loader2 className="h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4" />
                Simpan Informasi Ujian
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Daftar Soal ({questions.length})
            </h2>
            <button
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-2 rounded-lg border border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50"
            >
              <PlusCircle className="h-4 w-4" />
              Tambah Soal
            </button>
          </div>

          {questionLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Memuat soal...
            </div>
          )}

          {questionError && (
            <div className="text-sm text-red-500">
              Gagal memuat soal. Silakan refresh halaman.
            </div>
          )}

          <div className="space-y-3">
            {questions.map((question, index) => (
              <QuestionEditor
                key={question.id ?? index}
                question={question}
                onChange={(next) => handleUpdateQuestion(index, next)}
                onRemove={() => handleRemoveQuestion(index)}
                index={index}
              />
            ))}
          </div>

          {questions.length === 0 && !questionLoading && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-400">
              Belum ada soal. Klik "Tambah Soal" untuk mulai membuat soal.
            </div>
          )}

          <footer className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-500">
              Total skor ujian saat ini: <span className="font-semibold text-gray-900">{totalPoints}</span> poin
            </div>
            <button
              onClick={saveQuestions}
              disabled={savingQuestions || pendingChanges}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingQuestions && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan Soal & Kunci Jawaban
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}
