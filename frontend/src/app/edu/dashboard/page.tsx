"use client"

import DashHeader from "@/app/components/DashHeader"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import {User} from "@/app/api/me/route";
import Swal from "sweetalert2";
import TugasCard from "@/components/subComponents/forDashboard/tugasCard";

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null)
    const [tugasSelesai, setTugasSelesai] = useState<number | null>(null)
    const [tugasTerbaru, setTugasTerbaru] = useState<number | null>(null)
    const [totalUjian, setTotalUjian] = useState<number | null>(null)
    const [ujianSelesai, setUjianSelesai] = useState<number | null>(null)

    const [card, setCard] = useState<{value: number, tugas: string}[] | undefined>(undefined)

    const router = useRouter();

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

        const fetchAssignments = async () => {
            try {
                const res = await axios.get("/api/tugas");
                const assignments = res.data.data;

                // @ts-ignore
                const tugasTerbaru = assignments.filter(assignment =>
                    !assignment.submissions || assignment.submissions.length === 0
                );

                // @ts-ignore
                const tugasSelesai = assignments.filter(assignment =>
                    assignment.submissions && assignment.submissions.length > 0
                );

                setTugasSelesai(tugasSelesai.length);
                setTugasTerbaru(tugasTerbaru.length);
            } catch (e: any) {
                console.error(e);
            }
        }

        const fetchExams = async () => {
            try {
                const res = await axios.get("/api/exam-card");

                const exams = res.data;
                setTotalUjian(exams.totalExams);
                setUjianSelesai(exams.completedExams);
            } catch (e) {

            }
        }
        //
        fetchExams();
        fetchAssignments();
        fetchUser();
    }, [])

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
            <DashHeader user={user} />
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
                        <h2 className="text-lg font-semibold">Tugas Terbaru</h2>
                        <p className="text-black/60 text-sm">Dimohon untuk selesaikan tugas anda dengan tepat waktu</p>
                    </div>
                    <div className="divide-y divide-black/10">
                        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                <div>
                                    <h3>PENGAYAAN MATEMATIKA</h3>
                                    <p className="text-black/60 text-sm">Matematika &middot; John Doe, S.Pd.</p>
                                </div>
                                <p className="text-xs text-orange-700">Sampai 9 Des 2025</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <a href="" className="text-sm bg-orange-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-orange-400 hover:shadow transition">
                                    Kerjakan
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                <div>
                                    <h3>PENGAYAAN KEWIRAUSAHAAN</h3>
                                    <p className="text-black/60 text-sm">Kewirausahaan &middot; Jack Smith, S.Pd.</p>
                                </div>
                                <p className="text-xs text-orange-700">Sampai 4 Des 2025</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <a href="" className="text-sm bg-orange-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-orange-400 hover:shadow transition">
                                    Kerjakan
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                <div>
                                    <h3>PENGAYAAN DKV</h3>
                                    <p className="text-black/60 text-sm">DKV &middot; Reine Smith, S.Kom.</p>
                                </div>
                                <p className="text-xs text-orange-700">Sampai 22 Nov 2025</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <a href="" className="text-sm bg-orange-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-orange-400 hover:shadow transition">
                                    Kerjakan
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                <div>
                                    <h3>PENGAYAAN ENGLISH</h3>
                                    <p className="text-black/60 text-sm">Bahasa Inggris &middot; Jane Doe, S.S.</p>
                                </div>
                                <p className="text-xs text-orange-700">Selesai tepat waktu</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <a href="" className="text-sm bg-emerald-400 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-emerald-300 hover:shadow transition">
                                    Selesai
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* EXAM */}
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                    <div>
                        <h2 className="text-lg font-semibold">Ujian Terbaru</h2>
                        <p className="text-black/60 text-sm">Dimohon untuk selesaikan ujian anda dengan tepat waktu</p>
                    </div>

                    <div className="divide-y divide-black/10">
                        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                <div>
                                    <h3>NARRATIVE TEXT</h3>
                                    <p className="text-black/60 text-sm">Bahasa Inggris &middot; Jane Doe, S.S.</p>
                                </div>
                                <p className="text-xs text-orange-700">Sampai 12 Des 2025</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-2">

                                <a href="" className="text-sm bg-orange-500 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-orange-400 hover:shadow transition">
                                    Kerjakan
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                <div>
                                    <h3>SPLDV & SPLTV</h3>
                                    <p className="text-black/60 text-sm">Matematika &middot; John Doe, S.Pd.</p>
                                </div>
                                <p className="text-xs text-orange-700">Selesai tepat waktu</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <a href="" className="text-sm bg-emerald-400 text-white px-3 py-2 rounded-sm flex items-center gap-1 hover:bg-emerald-300 hover:shadow transition">
                                    Selesai
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        )}
    </>
    )
}