"use client"

import DashHeader from "@/app/components/DashHeader"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import {User} from "@/app/api/me/route";
import Swal from "sweetalert2";
import TugasCard from "@/components/subComponents/forDashboard/tugasCard";
import TugasTerbaruCard from "@/components/subComponents/forDashboard/tugasTerbaruCard";
import ExamCard from "@/components/subComponents/forDashboard/examCard";

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null)
    const [student, setStudent] = useState<any>()
    const [tugasSelesai, setTugasSelesai] = useState<number | null>(null)
    const [tugasTerbaru, setTugasTerbaru] = useState<number | null>(null)
    const [totalUjian, setTotalUjian] = useState<number | null>(null)
    const [ujianSelesai, setUjianSelesai] = useState<number | null>(null)
    const [ujianPending, setUjianPending] = useState<any>()
    const [tugasPending, setTugasPending] = useState<any>()

    const [card, setCard] = useState<{value: number, tugas: string}[] | undefined>(undefined)
    const router = useRouter();

    // Fetch User
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("/api/me");
                setUser(res.data.user);
            } catch (e: any){
                console.error(e);
                // Jika error 401/403 atau user tidak ditemukan, logout otomatis
                if (e.response && (e.response.status === 401 || e.response.status === 403)) {
                    await handleLogout();
                }
            }
        }

        const fetchExams = async () => {
            try {
                const res = await axios.get("/api/exam-card");

                const exams = res.data;

                setUjianPending(exams.uncompletedExams)
                setTotalUjian(exams.totalExams);
                setUjianSelesai(exams.completedExams);
            } catch (e) {
                console.error(e)
            }
        }

        fetchExams();
        fetchUser();
    }, [])

    // Fetch Student
    useEffect(() => {
        if (!user) return

        const fetchStudent = async () => {
            await axios.get("/api/student")
                .then(res => {
                    const student = res.data.data
                    const studentMe = student.find((s: { user_id: number | undefined; }) => s.user_id === user?.id);

                    setStudent(studentMe)
                    console.log(studentMe)
                })
                .catch(err => {
                    console.error(err)
                })
        }

        fetchStudent()
    }, [user]);

    // Fetch Assignments
    useEffect(() => {
        if (!student) return

        const fetchAssignments = async () => {
            try {
                const res = await axios.get("/api/tugas");
                const assignments = res.data.data;

                const tugasSaya = assignments.filter((s: { class_id: any; }) => s.class_id === student.class.id);

                // @ts-ignore
                const tugasTerbaru = tugasSaya.filter(assignment =>
                    !assignment.submissions || assignment.submissions.length === 0
                );

                // @ts-ignore
                const tugasSelesai = tugasSaya.filter(assignment =>
                    assignment.submissions && assignment.submissions.length > 0
                );

                setTugasSelesai(tugasSelesai.length);
                setTugasTerbaru(tugasTerbaru.length);
                setTugasPending(tugasTerbaru);
            } catch (e: any) {
                console.error(e);
            }
        }

        fetchAssignments()
    }, [student]);

    // Update Card Data
    useEffect(() => {
        if(tugasSelesai !== null && tugasTerbaru !== null && totalUjian !== null && ujianSelesai !== null){
            setCard([
                { value: tugasSelesai, tugas: "Tugas Selesai" },
                { value: tugasTerbaru, tugas: "Tugas Pending" },
                { value: ujianSelesai, tugas: "Ujian Selesai" },
                { value: totalUjian - ujianSelesai, tugas: "Ujian Pending" },
            ])
        }
    }, [tugasSelesai, tugasTerbaru, totalUjian, ujianSelesai]);

    const handleLogout = async () => {
        try {
            const res = await axios.post("/api/logout");

            if(res.status === 200){
                router.push("/edu/login");
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil Logout',
                    text: res.data.message,
                    timer: 2000,
                    showConfirmButton: false,
                })
            }

        } catch (e:any) {
            console.error(e)
        }
    };

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