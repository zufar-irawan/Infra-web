"use client";

import DashHeader from "@/app/components/DashHeader";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import {User} from "@/app/api/me/route";
import TugasPending from "@/components/subComponents/forTugas/tugasPending";

export default function TugasSiswa() {
    const [user, setUser] = useState<User | null>(null)
    const [student, setStudent] = useState<any>()
    const [tugasPending, setTugasPending] = useState<any>()
    const [tugasSelesai, setTugasSelesai] = useState<any>()
    const [currentIndex, setCurrentIndex] = useState(0)

    const router = useRouter();

    // fetch user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("/api/me");
                setUser(res.data.user);
            } catch (e: any){
                console.error(e);
                // Jika error 401/403 atau user tidak ditemukan, logout otomatis
                if (e.response && (e.response.status === 401 || e.response.status === 403)) {
                    handleLogout();
                }
            }
        }
        fetchUser();
    }, [])

    // fetch student
    useEffect(() => {
        if(!user) return

        const fetchStudent = async() => {
            await axios.get('/api/student')
                .then(res => {
                    if(res.status === 200) {
                        const data = res.data.data
                        const studentme = data.find((s: any) => s.user_id === user.id)
                        setStudent(studentme)
                        console.log(studentme)
                    }
                })
                .catch(err => {
                    console.error(err);
                })
        }

        fetchStudent();

    }, [user]);

    // fetch tugas
    useEffect(() => {
        if(!student) return

        const fetchTugas = async() => {
            await axios.get('/api/tugas')
                .then(res => {
                    if(res.status === 200) {
                        const data = res.data.data
                        const tugas = data.filter((s: { class_id: any; }) => s.class_id === student.class.id);

                        // @ts-ignore
                        const tugasBelumSelesai = tugas.filter(assignment =>
                            !assignment.submissions || assignment.submissions.length === 0
                        );

                        // @ts-ignore
                        const tugasSelesai = tugas.filter(assignment =>
                            assignment.submissions && assignment.submissions.length > 0
                        );

                        setTugasPending(tugasBelumSelesai)
                        setTugasSelesai(tugasSelesai)

                    }
                })
                .catch(err => {
                    console.error(err);
                })
        }

        fetchTugas();
    }, [student]);

    // Reset carousel index when tugasPending changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [tugasPending]);

    const handleLogout = async () => {
        await axios.post("/api/logout")
            .then(res => {
                if (res.status === 200) {
                    router.push("/edu/login");
                }
            })
            .catch(err => {
                console.error(err);
            })
    };

    // Carousel functions
    const nextSlide = () => {
        if (tugasPending && tugasPending.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % tugasPending.length);
        }
    };

    const prevSlide = () => {
        if (tugasPending && tugasPending.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + tugasPending.length) % tugasPending.length);
        }
    };

    const [open1, setOpen1] = useState(true);
    const [open2, setOpen2] = useState(true);

    return (
        <>
        {user?.role === 'siswa' && (
        <div className="overflow-y-auto min-h-screen">
            <DashHeader user={user} student={student} />
            {/* TASK PENDING DETAILS - Full width on all screens */}
            <section className="w-full p-4">
                <div className="2xl:col-span-2 bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4 h-[200px]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Tugas Belum Dikerjakan</h2>
                            <p className="text-black/60 text-sm">Daftar tugas belum dikerjakan anda</p>
                        </div>
                        {tugasPending && tugasPending.length > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={prevSlide}
                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    disabled={tugasPending.length <= 1}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                <span className="text-xs text-gray-500">
                                    {currentIndex + 1} / {tugasPending.length}
                                </span>
                                <button
                                    onClick={nextSlide}
                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    disabled={tugasPending.length <= 1}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex items-center">
                        {tugasPending && tugasPending.length > 0 ? (
                            <div className="w-full overflow-hidden">
                                <div
                                    className="flex transition-transform duration-300 ease-in-out"
                                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                >
                                    {tugasPending.map((item: any, index: number) => (
                                        <div key={index} className="w-full flex-shrink-0">
                                            <div className="border-t border-black/10 pt-4">
                                                <TugasPending tugas={item} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl border border-dashed border-orange-200 h-[80px]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-orange-400 mb-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                                <h3 className="text-sm font-semibold text-orange-600 mb-0.5">Semua tugas sudah selesai!</h3>
                                <p className="text-black/60 text-xs">Tidak ada tugas pending. Pertahankan prestasimu!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* TASK COUNTS - Always side by side */}
            <section className="w-full grid grid-cols-2 gap-4 px-4 pb-4">
                {/* TASK COUNT - BELUM SELESAI */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                    <div className="bg-red-100 p-3 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-red-600 mb-2">{tugasPending ? tugasPending.length : 0}</h3>
                    <p className="text-sm font-medium text-gray-700">Tugas Belum Selesai</p>
                    <p className="text-xs text-gray-500 mt-1">Perlu dikerjakan</p>
                </div>

                {/* TASK COUNT - SUDAH SELESAI */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center text-center h-[200px]">
                    <div className="bg-green-100 p-3 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-green-600 mb-2">{tugasSelesai ? tugasSelesai.length : 0}</h3>
                    <p className="text-sm font-medium text-gray-700">Tugas Sudah Selesai</p>
                    <p className="text-xs text-gray-500 mt-1">Sudah dikumpulkan</p>
                </div>
            </section>
            <section id="mapel-math" className="w-full grid grid-cols-1 gap-4 p-4 cursor-pointer" onClick={() => setOpen1((prev) => !prev)}>
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Matematika</h2>
                            <p className="text-black/60 text-sm">XII DKV 1 &middot; John Doe, S.Pd.</p>
                        </div>
                        <span
                            className="p-1 rounded hover:bg-gray-100 transition"
                            aria-label={open1 ? "Tutup" : "Buka"}
                        >
                            {open1 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </span>
                    </div>
                    {open1 && (
                        <div className="divide-y divide-black/10 transition-all duration-300">
                            <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                    <div>
                                        <h3>PENGAYAAN MATEMATIKA</h3>
                                        <p className="text-black/60 text-sm">25 Nov 2025 - 9 Des 2025</p>
                                    </div>
                                    <p className="text-xs text-orange-700">Belum dikerjakan</p>
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
                                        <h3>ASESMEN FORMATIF 5 MATEMATIKA</h3>
                                        <p className="text-black/60 text-sm">13 Nov 2025 - 22 Des 2025</p>
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
                            <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                    <div>
                                        <h3>ASESMEN FORMATIF 4 MATEMATIKA</h3>
                                        <p className="text-black/60 text-sm">13 Nov 2025 - 22 Des 2025</p>
                                    </div>
                                    <p className="text-xs text-orange-700">Selesai diluar waktu</p>
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
                    )}
                </div>
            </section>
            <section id="mapel-pkk" className="w-full grid grid-cols-1 gap-4 p-4 cursor-pointer" onClick={() => setOpen2((prev) => !prev)}>
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Bahasa Inggris</h2>
                            <p className="text-black/60 text-sm">XII DKV 1 &middot; Jane Doe, S.S.</p>
                        </div>
                        <span
                            className="p-1 rounded hover:bg-gray-100 transition"
                            aria-label={open2 ? "Tutup" : "Buka"}
                        >
                            {open2 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </span>
                    </div>
                    {open2 && (
                        <div className="divide-y divide-black/10 transition-all duration-300">
                            <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                    <div>
                                        <h3>PENGAYAAN ENGLISH</h3>
                                        <p className="text-black/60 text-sm">25 Nov 2025 - 9 Des 2025</p>
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
                    )}
                </div>
            </section>
        </div>
        )}
        </>
    )
}