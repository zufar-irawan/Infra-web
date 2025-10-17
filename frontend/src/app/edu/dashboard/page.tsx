"use client";

import DashHeader from "@/app/components/DashHeader";
import React, { useEffect, useMemo, useState } from "react";
import { useEduData } from "@/app/edu/context";
import TugasCard from "@/components/subComponents/forDashboard/tugasCard";
import TugasTerbaruCard from "@/components/subComponents/forDashboard/tugasTerbaruCard";
import ExamCard from "@/components/subComponents/forDashboard/examCard";
import AdminCard from "@/components/subComponents/forDashboard/adminCard";
import GuruCard from "@/app/components/subComponents/forDashboard/guruCard";

export default function Dashboard() {
  const { user, student, teacher, tugas, exams, students, teachers } = useEduData();

  // === State umum ===
  const [tugasPending, setTugasPending] = useState<any[]>([]);
  const [ujianPending, setUjianPending] = useState<any[]>([]);
  const [tugasSelesai, setTugasSelesai] = useState<number>(0);
  const [tugasTerbaru, setTugasTerbaru] = useState<number>(0);
  const [ujianSelesai, setUjianSelesai] = useState<number>(0);
  const [totalUjian, setTotalUjian] = useState<number>(0);

  // === Untuk Guru ===
  const [tugasKelas, setTugasKelas] = useState<any[]>([]);
  const [ujianKelas, setUjianKelas] = useState<any[]>([]);

  // === Untuk Admin ===
  const [statAdmin, setStatAdmin] = useState<any[]>([]);

  const classId = useMemo(
    () =>
      student?.class_id ??
      student?.class?.id ??
      teacher?.class_id ??
      teacher?.class?.id ??
      null,
    [student, teacher]
  );

  // console.log("GURU DI HEADER", teacher);

  // === Hitung statistik siswa ===
  useEffect(() => {
    if (user?.role !== "siswa" || !tugas || !classId) return;

    const tugasSaya = tugas.filter((s: any) => s.class_id === classId || s.class?.id === classId);
    const pending = tugasSaya.filter((a: any) => !a.submissions || a.submissions.length === 0);
    const selesai = tugasSaya.filter((a: any) => a.submissions && a.submissions.length > 0);

    setTugasPending(pending);
    setTugasTerbaru(pending.length);
    setTugasSelesai(selesai.length);

    if (exams) {
      const pendingUjian = exams?.uncompletedExams ?? [];
      const selesaiUjian = exams?.completedExams ?? [];
      setUjianPending(pendingUjian);
      // @ts-ignore
      setTotalUjian((pendingUjian?.length ?? 0) + (selesaiUjian?.length ?? 0));
      // @ts-ignore
      setUjianSelesai(selesaiUjian?.length ?? 0);
    }
  }, [user, tugas, exams, classId]);

  // === Hitung statistik guru ===
  useEffect(() => {
    if (user?.role !== "guru") return;

    const tugasGuru = tugas?.filter((t: any) => t.created_by === user.id) ?? [];
    const ujianGuru = exams?.exams?.filter((u: any) => u.created_by === user.id) ?? [];

    setTugasKelas(tugasGuru);
    setUjianKelas(ujianGuru);
  }, [user, tugas, exams, classId]);

  // === Hitung statistik admin ===
  useEffect(() => {
    if (user?.role !== "admin") return;

    setStatAdmin([
      { title: "Total Siswa", value: students?.length ?? 0 },
      { title: "Total Guru", value: teachers?.length ?? 0 },
      { title: "Total Tugas", value: tugas?.length ?? 0 },
      { title: "Total Ujian", value: exams?.exams?.length ?? 0 },
    ]);
  }, [user, students, teachers, tugas, exams]);

  return (
    <div className="overflow-y-auto min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
        {/* @ts-ignore */}
      <DashHeader student={student} teacher={teacher} user={user} />

      {/* ============================ */}
      {/* ======== SISWA VIEW ======== */}
      {/* ============================ */}
      {user?.role === "siswa" && (
        <>
          {/* Welcome Banner */}
          <div className="w-full p-4">
            <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    Selamat Datang, {student?.name || user?.name || 'Siswa'}! 👋
                  </h1>
                  <p className="text-white/90 text-sm">
                    Semangat belajar hari ini! Yuk selesaikan tugas dan ujian yang menunggu.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* === Statistik tugas & ujian === */}
          <section className="w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 p-4">
            <TugasCard value={tugasSelesai} title="Tugas Selesai" />
            <TugasCard value={tugasTerbaru} title="Tugas Pending" />
            <TugasCard value={ujianSelesai} title="Ujian Selesai" />
            <TugasCard value={totalUjian - ujianSelesai} title="Ujian Pending" />
          </section>

          {/* === Daftar tugas & ujian === */}
          <section className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-4 p-4">
            {/* === Tugas === */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Tugas Kamu</h2>
                  <p className="text-gray-600 text-sm">
                    {tugasPending.length > 0 ? `${tugasPending.length} tugas menunggu` : 'Semua tugas selesai!'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {tugasPending.length > 0 ? (
                  tugasPending.map((t, i) => (
                    <div key={i} className="border-b border-gray-100 last:border-0">
                      <TugasTerbaruCard tugas={t} />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-dashed border-green-300">
                    <div className="bg-green-100 p-4 rounded-full mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-12 h-12 text-green-600"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-700 mb-2">
                      Luar Biasa! 🎉
                    </h3>
                    <p className="text-green-600 text-sm text-center max-w-xs">
                      Semua tugas sudah selesai. Pertahankan semangat belajarmu!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* === Ujian === */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Ujian Terbaru</h2>
                  <p className="text-gray-600 text-sm">
                    {ujianPending.length > 0 ? `${ujianPending.length} ujian menunggu` : 'Semua ujian selesai!'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {ujianPending.length > 0 ? (
                  ujianPending.map((u, i) => (
                    <div key={i} className="border-b border-gray-100 last:border-0">
                      <ExamCard exams={u} />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-dashed border-green-300">
                    <div className="bg-green-100 p-4 rounded-full mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-12 h-12 text-green-600"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-700 mb-2">
                      Sempurna! ⭐
                    </h3>
                    <p className="text-green-600 text-sm text-center max-w-xs">
                      Semua ujian sudah selesai. Kamu hebat!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ============================ */}
      {/* ========= GURU VIEW ========= */}
      {/* ============================ */}
      {user?.role === "guru" && (
        <>
          {/* Welcome Banner */}
          <div className="w-full p-4">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    Halo, {teacher?.name || user?.name || 'Guru'}! 👨‍🏫
                  </h1>
                  <p className="text-white/90 text-sm">
                    Kelola tugas dan ujian untuk siswa-siswa Anda dengan mudah.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section className="w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 p-4">
            <TugasCard value={tugasKelas.length} title="Total Tugas" />
            <TugasCard value={ujianKelas.length} title="Total Ujian" />
            <TugasCard value={teacher?.students?.length || 0} title="Jumlah Siswa" />
            <TugasCard value={teacher?.subjects?.length || 0} title="Mata Pelajaran" />
          </section>

          <section className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-4 p-4">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Tugas Diajarkan</h2>
                  <p className="text-gray-600 text-sm">{tugasKelas.length} tugas dibuat</p>
                </div>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {tugasKelas.length > 0 ? (
                  tugasKelas.map((item, i) => (
                    <div key={i} className="border-b border-gray-100 last:border-0">
                      <GuruCard tugas={item} />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="bg-gray-100 p-4 rounded-full mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 font-medium text-center">
                      Belum ada tugas untuk kelas ini
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Buat tugas baru untuk siswa Anda
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Ujian Diajarkan</h2>
                  <p className="text-gray-600 text-sm">{ujianKelas.length} ujian dibuat</p>
                </div>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {ujianKelas.length > 0 ? (
                  ujianKelas.map((item, i) => (
                    <div key={i} className="border-b border-gray-100 last:border-0">
                      <ExamCard exams={item} />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="bg-gray-100 p-4 rounded-full mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 font-medium text-center">
                      Belum ada ujian untuk kelas ini
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Buat ujian baru untuk siswa Anda
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ============================ */}
      {/* ========= ADMIN VIEW ======== */}
      {/* ============================ */}
      {user?.role === "admin" && (
        <>
          {/* Welcome Banner */}
          <div className="w-full p-4">
            <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    Dashboard Admin 🔐
                  </h1>
                  <p className="text-white/90 text-sm">
                    Kelola seluruh sistem LMS dengan kontrol penuh.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section className="w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 p-4">
            {statAdmin.map((item, i) => (
              <AdminCard key={i} title={item.title} value={item.value} />
            ))}
          </section>

          <section className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-4 p-4">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Manajemen Guru</h2>
                  <p className="text-gray-600 text-sm">Kelola data pengajar</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-3xl font-bold text-blue-700">{teachers?.length ?? 0}</p>
                    <p className="text-sm text-blue-600 mt-1">Total Guru Aktif</p>
                  </div>
                  <div className="bg-blue-200 p-3 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-blue-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-blue-600">
                  Guru terdaftar dalam sistem LMS dan siap mengajar
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Manajemen Siswa</h2>
                  <p className="text-gray-600 text-sm">Kelola data peserta didik</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-3xl font-bold text-emerald-700">{students?.length ?? 0}</p>
                    <p className="text-sm text-emerald-600 mt-1">Total Siswa Aktif</p>
                  </div>
                  <div className="bg-emerald-200 p-3 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-emerald-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-emerald-600">
                  Siswa terdaftar dan aktif dalam pembelajaran LMS
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
