"use client";

import { useMemo, useState } from "react";
import { useEduData } from "@/app/edu/context";
import DashHeader from "@/app/components/DashHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle } from "lucide-react";
import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type ExamListItem = {
  id: number;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  subject?: { id: number; name: string } | null;
  class?: { id: number; name: string } | null;
};

export default function ManageExamPage() {
  const { user, student, exams } = useEduData();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data, error, isLoading } = useSWR("/api/exam", fetcher, {
    refreshInterval: 60000,
  });

  const list: ExamListItem[] = useMemo(() => {
    const backendData = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    return backendData.map((item: any) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      start_time: item.start_time,
      end_time: item.end_time,
      subject: item.subject ?? null,
      class: item.class ?? null,
    }));
  }, [data]);

  const filtered = useMemo(() => {
    if (!search) return list;
    return list.filter((item) => {
      const query = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        (item.subject?.name?.toLowerCase().includes(query) ?? false) ||
        (item.class?.name?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [list, search]);

  return (
    <div className="min-h-screen bg-gray-100">
      <DashHeader user={user} student={student} />

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Manajemen Ujian</h1>
            <p className="text-sm text-gray-500">
              Buat, atur jadwal, dan kelola soal ujian untuk siswa.
            </p>
          </div>
          <Link
            href="/edu/ujian/manage/new"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-400"
          >
            <PlusCircle className="h-4 w-4" />
            Tambah Ujian Baru
          </Link>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ujian berdasarkan judul, mapel, atau kelas"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>

        <section className="space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-12 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Memuat daftar ujian...
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              Gagal memuat daftar ujian. Silakan coba lagi nanti.
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-400">
              Belum ada ujian yang dibuat.
            </div>
          )}

          <div className="grid gap-3">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(`/edu/ujian/manage/${item.id}`)}
                className="flex w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-orange-500">
                  <span>{item.subject?.name ?? "Mata Pelajaran"}</span>
                  <span className="text-gray-300">•</span>
                  <span>{item.class?.name ?? "Kelas"}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span>|</span>
                    <span>
                      {item.start_time} - {item.end_time}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
