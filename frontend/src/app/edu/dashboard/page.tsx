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
    <div className="overflow-y-auto min-h-screen bg-gray-50">
        {/* @ts-ignore */}
      <DashHeader student={student} teacher={teacher} user={user} />

      {/* ============================ */}
      {/* ======== SISWA VIEW ======== */}
      {/* ============================ */}
      {user?.role === "siswa" && (
        <>
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
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold">Tugas</h2>
                <p className="text-black/60 text-sm">
                  Dimohon untuk selesaikan tugas anda dengan tepat waktu
                </p>
              </div>

              <div className="divide-y divide-black/10">
                {tugasPending.length > 0 ? (
                  tugasPending.map((t, i) => <TugasTerbaruCard key={i} tugas={t} />)
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-dashed border-orange-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-12 h-12 text-orange-400 mb-2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <h3 className="text-lg font-semibold text-orange-600 mb-1">
                      Semua tugas sudah selesai!
                    </h3>
                    <p className="text-black/60 text-sm">
                      Tidak ada tugas pending. Pertahankan prestasimu!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* === Ujian === */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold">Ujian Terbaru</h2>
                <p className="text-black/60 text-sm">
                  Dimohon untuk selesaikan ujian anda dengan tepat waktu
                </p>
              </div>

              <div className="divide-y divide-black/10">
                {ujianPending.length > 0 ? (
                  ujianPending.map((u, i) => <ExamCard key={i} exams={u} />)
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-dashed border-orange-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-12 h-12 text-orange-400 mb-2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <h3 className="text-lg font-semibold text-orange-600 mb-1">
                      Semua ujian sudah selesai!
                    </h3>
                    <p className="text-black/60 text-sm">
                      Tidak ada ujian pending. Pertahankan prestasimu!
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
          <section className="w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 p-4">
            <TugasCard value={tugasKelas.length} title="Total Tugas" />
            <TugasCard value={ujianKelas.length} title="Total Ujian" />
            <TugasCard value={teacher?.students?.length || 0} title="Jumlah Siswa" />
            <TugasCard value={teacher?.subjects?.length || 0} title="Mata Pelajaran" />
          </section>

          <section className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-4 p-4">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <h2 className="text-lg font-semibold">Tugas Diajarkan</h2>
              <div className="divide-y divide-black/10 mt-2">
                {tugasKelas.length > 0 ? (
                  tugasKelas.map((item, i) => <GuruCard key={i} tugas={item} />)
                ) : (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    Belum ada tugas untuk kelas ini
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <h2 className="text-lg font-semibold">Ujian Diajarkan</h2>
              <div className="divide-y divide-black/10 mt-2">
                {ujianKelas.length > 0 ? (
                  ujianKelas.map((item, i) => <ExamCard key={i} exams={item} />)
                ) : (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    Belum ada ujian untuk kelas ini
                  </p>
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
          <section className="w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 p-4">
            {statAdmin.map((item, i) => (
              <AdminCard key={i} title={item.title} value={item.value} />
            ))}
          </section>

          <section className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-4 p-4">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <h2 className="text-lg font-semibold mb-2">Manajemen Guru</h2>
              <p className="text-sm text-gray-500">
                Total {teachers?.length ?? 0} guru terdaftar dalam sistem.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <h2 className="text-lg font-semibold mb-2">Manajemen Siswa</h2>
              <p className="text-sm text-gray-500">
                Total {students?.length ?? 0} siswa aktif dalam LMS.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
