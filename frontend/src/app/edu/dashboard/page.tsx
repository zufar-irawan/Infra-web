"use client"

import DashHeader from "@/app/components/DashHeader"
import React, { useEffect, useMemo, useState } from 'react';
import TugasCard from "@/components/subComponents/forDashboard/tugasCard";
import TugasTerbaruCard from "@/components/subComponents/forDashboard/tugasTerbaruCard";
import ExamCard from "@/components/subComponents/forDashboard/examCard";
import { useEduData } from "@/app/edu/context";

export default function Dashboard() {
    const { user, student, tugas, exams } = useEduData();

    const [tugasSelesai, setTugasSelesai] = useState<number | null>(null)
    const [tugasTerbaru, setTugasTerbaru] = useState<number | null>(null)
    const [ujianSelesai, setUjianSelesai] = useState<number | null>(null)
    const [totalUjian, setTotalUjian] = useState<number | null>(null)
    const [ujianPending, setUjianPending] = useState<any[]>([])
    const [tugasPending, setTugasPending] = useState<any[]>([])

    const classId = useMemo(() => student?.class?.id ?? student?.class_id ?? student?.classId ?? null, [student])

    // Compute Exam stats from context
    useEffect(() => {
        if (!exams) return;
        const pending = exams?.uncompletedExams ?? [];
        const total = (exams?.totalExams ?? (exams?.exams?.length ?? 0)) as number;
        const selesai = exams?.completedExams ?? exams?.selesaiExams ?? null;

        setUjianPending(Array.isArray(pending) ? pending : []);
        setTotalUjian(Array.isArray(selesai) ? (pending?.length ?? 0) + selesai.length : total);
        setUjianSelesai(Array.isArray(selesai) ? selesai.length : 0);
    }, [exams])

    // Compute Assignment stats from context
    useEffect(() => {
        if (!tugas || !classId) return
        const tugasSaya = tugas.filter((s: any) => s.class_id === classId || s.class?.id === classId)

        const pending = tugasSaya.filter((assignment: any) => !assignment.submissions || assignment.submissions.length === 0)
        const selesai = tugasSaya.filter((assignment: any) => assignment.submissions && assignment.submissions.length > 0)

        setTugasPending(pending)
        setTugasTerbaru(pending.length)
        setTugasSelesai(selesai.length)
    }, [tugas, classId])

    const card = useMemo(() => {
        if(tugasSelesai !== null && tugasTerbaru !== null && totalUjian !== null && ujianSelesai !== null){
            return [
                { value: tugasSelesai, tugas: "Tugas Selesai" },
                { value: tugasTerbaru, tugas: "Tugas Pending" },
                { value: ujianSelesai, tugas: "Ujian Selesai" },
                { value: (totalUjian - ujianSelesai), tugas: "Ujian Pending" },
            ]
        }
        return undefined
    }, [tugasSelesai, tugasTerbaru, totalUjian, ujianSelesai])

    return (
        <>
        { user?.role === 'siswa' && (
        <div className="overflow-y-auto min-h-screen">
            <DashHeader student={student} user={user} />
            <section id="task" className="w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 p-4">
                { card ? (card.map((item, index) => (
                    <TugasCard value={item.value} title={item.tugas} key={index} />
                ))) : (
                    <TugasCard value={0} title={"Loading..."} />
                )}
            </section>
            <section id="statistic" className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-4 p-4">
                {/* TASK */}
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                    <div>
                        <h2 className="text-lg font-semibold">Tugas</h2>
                        <p className="text-black/60 text-sm">Dimohon untuk selesaikan tugas anda dengan tepat waktu</p>
                    </div>

                    {/*Section tugas*/}
                    <div className="divide-y divide-black/10">
                        { tugasPending && tugasPending.length > 0 ? (
                            tugasPending.map((tugas: any, index: number) => (
                                <TugasTerbaruCard tugas={tugas} key={index}/>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-dashed border-orange-200">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-orange-400 mb-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                                <h3 className="text-lg font-semibold text-orange-600 mb-1">Semua tugas sudah selesai!</h3>
                                <p className="text-black/60 text-sm">Tidak ada tugas pending. Pertahankan prestasimu!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* EXAM */}
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                    <div>
                        <h2 className="text-lg font-semibold">Ujian Terbaru</h2>
                        <p className="text-black/60 text-sm">Dimohon untuk selesaikan ujian anda dengan tepat waktu</p>
                    </div>

                    <div className="divide-y divide-black/10">
                        {ujianPending && ujianPending.length > 0 ? (
                            ujianPending.map((tugas: any, index: number) => (
                                <ExamCard exams={tugas} key={index} />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-dashed border-orange-200">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-orange-400 mb-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                                <h3 className="text-lg font-semibold text-orange-600 mb-1">Semua ujian sudah selesai!</h3>
                                <p className="text-black/60 text-sm">Tidak ada ujian pending. Pertahankan prestasimu!</p>
                            </div>
                        )}

                    </div>
                </div>
            </section>
        </div>
        )}
    </>
    )
}