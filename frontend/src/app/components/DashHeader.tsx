"use client";

import { Menu } from "lucide-react"
import React from 'react';

export default function DashHeader({student, user} : {student: any, user: any}) {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const classStudent = student?.class.name || "Tidak ada kelas";
    const isUser = user?.role || "guest";

    return (
        <section id="header" className="w-full flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
                {/* Tombol hamburger untuk mobile */}
                <button 
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => {
                        // Trigger sidebar open via custom event
                        window.dispatchEvent(new CustomEvent('toggleSidebar'))
                    }}
                >
                    <Menu className="w-6 h-6" />
                </button>
                
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">
                        {pathname == '/edu/dashboard'
                            ? `Dashboard ${isUser === 'admin' ? "Admin" : isUser === 'teacher' ? "Guru" : "Siswa"}`
                        :pathname == '/edu/tugas'
                            ? 'Tugas Anda'
                        :pathname == '/edu/tugas/tugas_siswa_example'
                            ? 'Tugas Anda'
                        :pathname == '/edu/ujian'
                            ? 'Ujian Anda'
                        :pathname == '/edu/nilai'
                            ? 'Nilai Anda'
                        :pathname == '/edu/jadwal'
                            ? 'Jadwal' : ''
                        }

                        </h1>
                    <p className="text-black/60 text-sm sm:text-base">Selamat datang kembali, {user?.name || "Loading..."}.</p>
                </div>
            </div>

            <p className="bg-emerald-200 text-emerald-800 px-3 py-2 text-xs sm:text-sm rounded-sm">
                {classStudent.replaceAll("-", " ")}
            </p>
        </section>
    )
}
