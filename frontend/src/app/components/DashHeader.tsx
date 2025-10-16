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
                        {
                            (() => {
                                switch (true) {
                                    case pathname.startsWith('/edu/dashboard'):
                                        return `Dashboard ${isUser === 'admin' ? 'Admin' : isUser === 'teacher' ? 'Guru' : 'Siswa'}`;
                                    case pathname.startsWith('/edu/tugas'):
                                        return 'Tugas Anda';
                                    case pathname.startsWith('/edu/ujian'):
                                        return 'Ujian Anda';
                                    case pathname.startsWith('/edu/nilai'):
                                        return 'Nilai Anda';
                                    case pathname.startsWith('/edu/jadwal'):
                                        return 'Jadwal';
                                    case pathname.startsWith('/edu/setelan'):
                                        return 'Setelan';
                                    case pathname.startsWith('/edu/perangkat'):
                                        return 'Perangkat';
                                    case pathname.startsWith('/edu/rfid'):
                                        return 'RFID Card';
                                    default:
                                        return '';
                                }
                            })()
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
