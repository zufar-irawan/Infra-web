"use client";


import DashHeader from "@/app/components/DashHeader";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import {User} from "@/app/api/me/route";

export default function UjianSiswa() {
    const [user, setUser] = useState<User | null>(null)
    const [student, setStudent] = useState<any>()

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

    useEffect(() => {
        if (!user) return

        const fetchStudent = async () => {
            await axios.get("/api/student")
                .then((res) => {
                    if(res.status === 200) {
                        const data = res.data
                        // @ts-ignore
                        const studentMe = data.filter(item => item.user_id === user.id);
                        setStudent(studentMe);
                    }
                })
                .catch((err) => {
                    console.error(err);
                })
        }

        fetchStudent();
    }, [user]);

    const handleLogout = async () => {
        await axios.post("/api/logout")
            .then((res) => {
                if(res.status === 200) {
                    router.push("/login");
                }
            })
            .catch((err) => {
                console.error(err);
            })
    };

    const [open1, setOpen1] = useState(true);
    const [open2, setOpen2] = useState(true);

    return (
        <>
        {user?.role === 'siswa' && (
        <div className="overflow-y-auto min-h-screen">
            <DashHeader user={user} student={student} />
            <section id="ujian-main-data" className="w-full grid grid-cols-1 2xl:grid-cols-2 gap-4 p-4">
                {/* TASK */}
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                    <div>
                        <h2 className="text-lg font-semibold">Ujian Belum Dikerjakan</h2>
                        <p className="text-black/60 text-sm">Daftar ujian belum dikerjakan anda</p>
                    </div>
                    <div className="divide-y divide-black/10">
                        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                <div>
                                    <h3>SPLDV & SPLTV</h3>
                                    <p className="text-black/60 text-sm">Matematika &middot; John Doe, S.Pd.</p>
                                </div>
                                <p className="text-xs text-orange-700">Selesai tepat waktu</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                    <div>
                        <h2 className="text-lg font-semibold">Ujian Selesai</h2>
                        <p className="text-black/60 text-sm">Daftar ujian selesai anda</p>
                    </div>
                    <div className="divide-y divide-black/10">
                        <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                <div>
                                    <h3>SPLDV & SPLTV</h3>
                                    <p className="text-black/60 text-sm">Matematika &middot; John Doe, S.Pd.</p>
                                </div>
                                <p className="text-xs text-orange-700">Selesai tepat waktu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="ujian-math" className="w-full grid grid-cols-1 gap-4 p-4 cursor-pointer" onClick={() => setOpen1((prev) => !prev)}>
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
                                        <h3>SPLDV & SPLTV</h3>
                                        <p className="text-black/60 text-sm"> 4 Okt 2025 - 28 Des 2025 <span className="block sm:inline">[120 menit]</span></p>
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
            <section id="ujian-pkk" className="w-full grid grid-cols-1 gap-4 p-4 cursor-pointer" onClick={() => setOpen2((prev) => !prev)}>
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
                                        <h3>NARRATIVE TEXT</h3>
                                        <p className="text-black/60 text-sm">25 Sep 2025 - 10 Okt 2025 <span className="block sm:inline">[120 menit]</span></p>
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
                                        <h3>RECOUNT TEXT</h3>
                                        <p className="text-black/60 text-sm">20 Sep 2025 - 2 Okt 2025 <span className="block sm:inline">[60 menit]</span></p>
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
                            <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                                    <div>
                                        <h3>PRE-TEST ENGLISH</h3>
                                        <p className="text-black/60 text-sm">12 Agu 2025 - 18 Agu 2025 <span className="block sm:inline">[60 menit]</span></p>
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