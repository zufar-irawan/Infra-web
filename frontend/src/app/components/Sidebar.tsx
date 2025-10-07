"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import {BellRing, Bolt, BookMarked, BarChart3, LayoutDashboard, Users, LogOut, Shapes, X, Calendar} from "lucide-react";
import axios from "axios";
import {User} from "@/app/api/me/route";


interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [isUser] = useState('student')
    
    const router = useRouter();

    const pathname = typeof window !== "undefined" ? window.location.pathname : "";

    const [user, setUser] = useState<User | null>(null)

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
        if(user) {
            console.log(user)
        }
    }, [user]);
    
    return (
        <>
            {/* Overlay untuk mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/25 bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            
            <aside className={`w-full fixed lg:relative max-w-xs min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-700
                 border-r border-gray-200 shadow-sm
                 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out
                 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div>
                {/* Header with gradient */}    
                <section className="w-full bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 
                                  flex justify-between items-center gap-3 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-sm shadow-lg">
                            <Image src="/smk.png" alt={"logo-smk"} width={50} height={50} className="drop-shadow-md" />
                        </div>
                        <h1 className="text-2xl tracking-tight font-bold text-white drop-shadow-md">Presma EDU</h1>
                    </div>
                    
                    {/* Tombol X untuk menutup sidebar */}
                    <button 
                        onClick={onClose}
                        className="relative z-10 lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </section>

                {/* User Profile Card */}
                <section className="w-full p-5">
                    <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 
                                  hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                        <div className="flex gap-3 items-center">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600
                                          text-white font-bold text-xl flex items-center justify-center
                                          shadow-lg ring-4 ring-orange-100">
                                {user?.name?.split(" ").map(n => n[0]?.toUpperCase()).join("") || "T"}
                            </div>

                            <div className="flex flex-col flex-1 min-w-0">
                                <h2 className="font-bold text-gray-800 truncate">
                                    {user?.name || "Hafiz"}
                                </h2>
                                <p className="text-sm text-gray-500 flex items-center gap-1 overflow-hidden">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    {user?.email
                                        ? user.email.length > 21
                                            ? user.email.slice(0, 21) + "..."
                                            : user.email
                                        : "hafiz@smkprestasipri..."}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Navigation Menu */}
                {isUser == 'admin' &&
                    <section className="w-full px-5 pb-5">
                        <nav className="flex flex-col gap-1.5">
                            <a href="#" className="group bg-gradient-to-r from-orange-600 to-orange-500 text-white 
                                            rounded-xl px-4 py-3.5 flex items-center gap-3 
                                            shadow-md hover:shadow-lg transition-all duration-300
                                            hover:scale-[1.02] active:scale-[0.98]">
                                <div className="p-1.5 bg-white/20 rounded-lg">
                                    <LayoutDashboard className="w-5 h-5" />
                                </div>
                                <span className="font-semibold">Dashboard</span>
                            </a>
                            
                            <a href="#" className="group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50
                                            transition-all duration-300 cursor-pointer flex items-center gap-3
                                            hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]
                                            border border-transparent hover:border-orange-100">
                                <div className="p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors">
                                    <Shapes className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-orange-700 transition-colors">
                                    Manajemen Kelas
                                </span>
                            </a>
                            
                            <a href="#" className="group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50
                                            transition-all duration-300 cursor-pointer flex items-center gap-3
                                            hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]
                                            border border-transparent hover:border-orange-100">
                                <div className="p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors">
                                    <Users className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-orange-700 transition-colors">
                                    Manajemen Siswa
                                </span>
                            </a>
                            
                            <a href="#" className="group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50
                                            transition-all duration-300 cursor-pointer flex items-center gap-3
                                            hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]
                                            border border-transparent hover:border-orange-100">
                                <div className="p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors">
                                    <BookMarked className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-orange-700 transition-colors">
                                    Mata Pelajaran
                                </span>
                            </a>
                            
                            <a href="#" className="group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50
                                            transition-all duration-300 cursor-pointer flex items-center gap-3
                                            hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]
                                            border border-transparent hover:border-orange-100">
                                <div className="p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors">
                                    <BarChart3 className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-orange-700 transition-colors">
                                    Laporan
                                </span>
                            </a>
                            
                            <a href="#" className="group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50
                                            transition-all duration-300 cursor-pointer flex items-center gap-3
                                            hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]
                                            border border-transparent hover:border-orange-100">
                                <div className="p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors">
                                    <Bolt className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-orange-700 transition-colors">
                                    Setelan
                                </span>
                            </a>
                        </nav>
                    </section>
                }
                {isUser == 'teacher' &&
                    <section className="w-full px-5 pb-5">
                        <nav className="flex flex-col gap-1.5">
                            <a href="#" className="group bg-gradient-to-r from-orange-600 to-orange-500 text-white 
                                            rounded-xl px-4 py-3.5 flex items-center gap-3 
                                            shadow-md hover:shadow-lg transition-all duration-300
                                            hover:scale-[1.02] active:scale-[0.98]">
                                <div className="p-1.5 bg-white/20 rounded-lg">
                                    <LayoutDashboard className="w-5 h-5" />
                                </div>
                                <span className="font-semibold">Dashboard</span>
                            </a>
                            
                            <a href="#" className="group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50
                                            transition-all duration-300 cursor-pointer flex items-center gap-3
                                            hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]
                                            border border-transparent hover:border-orange-100">
                                <div className="p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors">
                                    <Shapes className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-orange-700 transition-colors">
                                    Manajemen Kelas
                                </span>
                            </a>
                            
                            <a href="#" className="group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50
                                            transition-all duration-300 cursor-pointer flex items-center gap-3
                                            hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]
                                            border border-transparent hover:border-orange-100">
                                <div className="p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors">
                                    <Users className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-orange-700 transition-colors">
                                    Manajemen Siswa
                                </span>
                            </a>
                            
                            <a href="#" className="group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50
                                            transition-all duration-300 cursor-pointer flex items-center gap-3
                                            hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]
                                            border border-transparent hover:border-orange-100">
                                <div className="p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors">
                                    <BookMarked className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-orange-700 transition-colors">
                                    Mata Pelajaran
                                </span>
                            </a>
                            
                            <a href="#" className="group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50
                                            transition-all duration-300 cursor-pointer flex items-center gap-3
                                            hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]
                                            border border-transparent hover:border-orange-100">
                                <div className="p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors">
                                    <BarChart3 className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-orange-700 transition-colors">
                                    Laporan
                                </span>
                            </a>
                            
                            <a href="#" className="group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50
                                            transition-all duration-300 cursor-pointer flex items-center gap-3
                                            hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]
                                            border border-transparent hover:border-orange-100">
                                <div className="p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors">
                                    <Bolt className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-orange-700 transition-colors">
                                    Setelan
                                </span>
                            </a>
                        </nav>
                    </section>
                }
                {isUser == 'student' &&
                    <section className="w-full px-5 pb-5">
                        <nav className="flex flex-col gap-1.5">    
                            <a
                                href="/edu/dashboard"
                                className={
                                    pathname === "/edu/dashboard"
                                        ? "group bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        : "group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50 transition-all duration-300 cursor-pointer flex items-center gap-3 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-orange-100"
                                }
                            >
                                <div className={pathname === "/edu/dashboard" ? "p-1.5 bg-white/20 rounded-lg" : "p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors"}>
                                    <LayoutDashboard className={pathname === "/edu/dashboard" ? "w-5 h-5" : "w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors"} />
                                </div>
                                <span className={pathname === "/edu/dashboard" ? "font-semibold" : "font-medium text-gray-700 group-hover:text-orange-700 transition-colors"}>
                                    Dashboard
                                </span>
                            </a>
                            <a
                                href="/edu/tugas"
                                className={
                                    pathname === "/edu/tugas"
                                        ? "group bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        : "group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50 transition-all duration-300 cursor-pointer flex items-center gap-3 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-orange-100"
                                }
                            >
                                <div className={pathname === "/edu/tugas" ? "p-1.5 bg-white/20 rounded-lg" : "p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors"}>
                                    <BookMarked className={pathname === "/edu/tugas" ? "w-5 h-5" : "w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors"} />
                                </div>
                                <span className={pathname === "/edu/tugas" ? "font-semibold" : "font-medium text-gray-700 group-hover:text-orange-700 transition-colors"}>
                                    Tugas
                                </span>
                            </a>
                            <a
                                href="/edu/ujian"
                                className={
                                    pathname === "/edu/ujian"
                                        ? "group bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        : "group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50 transition-all duration-300 cursor-pointer flex items-center gap-3 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-orange-100"
                                }
                            >
                                <div className={pathname === "/edu/ujian" ? "p-1.5 bg-white/20 rounded-lg" : "p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors"}>
                                    <BookMarked className={pathname === "/edu/ujian" ? "w-5 h-5" : "w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors"} />
                                </div>
                                <span className={pathname === "/edu/ujian" ? "font-semibold" : "font-medium text-gray-700 group-hover:text-orange-700 transition-colors"}>
                                    Ujian
                                </span>
                            </a>
                            <a
                                href="/edu/nilai"
                                className={
                                    pathname === "/edu/nilai"
                                        ? "group bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        : "group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50 transition-all duration-300 cursor-pointer flex items-center gap-3 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-orange-100"
                                }
                            >
                                <div className={pathname === "/edu/nilai" ? "p-1.5 bg-white/20 rounded-lg" : "p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors"}>
                                    <BarChart3 className={pathname === "/edu/nilai" ? "w-5 h-5" : "w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors"} />
                                </div>
                                <span className={pathname === "/edu/nilai" ? "font-semibold" : "font-medium text-gray-700 group-hover:text-orange-700 transition-colors"}>
                                    Nilai
                                </span>
                            </a>
                            <a
                                href="/edu/jadwal"
                                className={
                                    pathname === "/edu/jadwal"
                                        ? "group bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        : "group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50 transition-all duration-300 cursor-pointer flex items-center gap-3 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-orange-100"
                                }
                            >
                                <div className={pathname === "/edu/jadwal" ? "p-1.5 bg-white/20 rounded-lg" : "p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors"}>
                                    <Calendar className={pathname === "/edu/jadwal" ? "w-5 h-5" : "w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors"} />
                                </div>
                                <span className={pathname === "/edu/jadwal" ? "font-semibold" : "font-medium text-gray-700 group-hover:text-orange-700 transition-colors"}>
                                    Jadwal
                                </span>
                            </a>
                            <a
                                href="/edu/setelan"
                                className={
                                    pathname === "/edu/setelan"
                                        ? "group bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        : "group rounded-xl px-4 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50/50 transition-all duration-300 cursor-pointer flex items-center gap-3 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-orange-100"
                                }
                            >
                                <div className={pathname === "/edu/setelan" ? "p-1.5 bg-white/20 rounded-lg" : "p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors"}>
                                    <Bolt className={pathname === "/edu/setelan" ? "w-5 h-5" : "w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors"} />
                                </div>
                                <span className={pathname === "/edu/setelan" ? "font-semibold" : "font-medium text-gray-700 group-hover:text-orange-700 transition-colors"}>
                                    Setelan
                                </span>
                            </a>
                        </nav>
                    </section>
                }
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-gray-200 bg-gradient-to-b from-white to-slate-50">
                <a href="" className="group w-full flex items-center justify-between p-5 
                                     hover:bg-orange-50 transition-all duration-300 cursor-pointer
                                     border-b border-gray-100">
                    <span className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg group-hover:bg-orange-100 transition-colors">
                            <BellRing className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-orange-700 transition-colors">
                            Notifikasi
                        </span>
                    </span>
                    <span className="bg-gradient-to-br from-red-500 to-red-600 text-white 
                                   flex items-center justify-center w-7 h-7 rounded-full 
                                   text-sm font-bold shadow-md ring-2 ring-red-200">
                        2
                    </span>
                </a>

                <button
                    onClick={handleLogout}
                    className="group w-full flex items-center gap-3 p-5 hover:bg-red-50 transition-all duration-300 cursor-pointer bg-transparent border-none text-left"
                    type="button"
                >
                    <div className="p-1.5 rounded-lg group-hover:bg-red-100 transition-colors">
                        <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-red-700 transition-colors">
                        Keluar
                    </span>
                </button>
            </div>

        </aside>
        </>
    )
}