"use client";

import { Menu } from "lucide-react"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import {User} from "@/app/api/me/route";

export default function DashHeader() {
    const [user, setUser] = useState<User | null>(null)

    const [isUser] = useState('student')
    const router = useRouter();

    const pathname = typeof window !== "undefined" ? window.location.pathname : "";

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

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            // Hapus token/cookie autentikasi jika ada
            localStorage.removeItem('token'); // jika pakai token di localStorage
            sessionStorage.removeItem('token'); // jika pakai sessionStorage
            // Jika pakai cookie, bisa tambahkan kode hapus cookie di sini
            // document.cookie = 'token=; Max-Age=0; path=/;';
            router.push('/edu/login');
        }
    };

    useEffect(() => {
        if(user) {
            console.log(user)
        }
    }, [user]);

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
                    {/* <h1 className="text-xl sm:text-2xl font-bold">
                        {pathname == '/edu/dashboard'
                            ? `Dashboard ${isUser === 'admin' ? "Admin" : isUser === 'teacher' ? "Guru" : "Siswa"}`
                        :pathname == '/edu/tugas'
                            ? 'Tugas Anda': ""
                        }
                        
                        </h1>
                    <p className="text-black/60 text-sm sm:text-base">Selamat datang kembali, {user?.name || "Loading..."}.</p> */}
                    {isUser == 'student' && (
                        <>
                            {pathname == '/edu/dashboard' && (
                                <>
                                    <h1 className="text-xl sm:text-2xl font-bold">
                                        Dashboard Siswa
                                    </h1>
                                    <p className="text-black/60 text-sm sm:text-base">
                                        Selamat datang kembali, {user?.name || "Loading..." }.
                                    </p>
                                </>
                            )}
                            {pathname == '/edu/tugas' && (
                                <>
                                    <h1 className="text-xl sm:text-2xl font-bold">
                                        Tugas Anda
                                    </h1>
                                    <p className="text-black/60 text-sm sm:text-base">
                                        Semua tugas anda berada disini.
                                    </p>
                                </>
                            )}
                            {pathname == '/edu/ujian' && (
                                <>
                                    <h1 className="text-xl sm:text-2xl font-bold">
                                        Ujian Anda
                                    </h1>
                                    <p className="text-black/60 text-sm sm:text-base">
                                        Semua ujian anda berada disini.
                                    </p>
                                </>
                            )}
                            {pathname == '/edu/nilai' && (
                                <>
                                    <h1 className="text-xl sm:text-2xl font-bold">
                                        Nilai Anda
                                    </h1>
                                    <p className="text-black/60 text-sm sm:text-base">
                                        Daftar nilai anda selama pembelajaran.
                                    </p>
                                </>
                            )}
                            {pathname == '/edu/jadwal' && (
                                <>
                                    <h1 className="text-xl sm:text-2xl font-bold">
                                        Jadwal Anda
                                    </h1>
                                    <p className="text-black/60 text-sm sm:text-base">
                                        Daftar jadwal anda selama pembelajaran.
                                    </p>
                                </>
                            )}
                                
                        </>
                    )}
                </div>
            </div>
            <p className="bg-emerald-200 text-emerald-800 px-3 py-2 text-xs sm:text-sm rounded-sm">XII DKV 1</p>
        </section>
    )
}
