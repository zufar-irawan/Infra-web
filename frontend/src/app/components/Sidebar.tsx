"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import {BellRing, Bolt, BookMarked, BarChart3, LayoutDashboard, LogOut, Shapes, Users} from "lucide-react";
import axios from "axios";
import {User} from "@/app/api/me/route";


export default function Sidebar() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("/api/me");

                setUser(res.data.user);
            } catch (e: any){
                console.error(e);
            }
        }

        fetchUser();
    }, [])

    useEffect(() => {
        if(user) {
            console.log(user)
        }
    }, [user]);
    
    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            // Store state in memory instead of localStorage
            router.push('/edu/login');
        }
    };

    return (
        <aside className="w-xs min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-700
                 border-r border-gray-200 shadow-sm
                 flex flex-col justify-between">
            <div>
                {/* Header with gradient */}
                <section className="w-full bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 
                                  flex justify-center items-center gap-3 p-6 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-sm shadow-lg">
                            <Image src="/smk.png" alt={"logo-smk"} width={50} height={50} className="drop-shadow-md" />
                        </div>
                        <h1 className="text-2xl tracking-tight font-bold text-white drop-shadow-md">Presma EDU</h1>
                    </div>
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
                                    {user?.name || "Tamu"}
                                </h2>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    {user?.role || "Tamu"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Navigation Menu */}
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
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-gray-200 bg-gradient-to-b from-white to-slate-50">
                <a href="#" className="group w-full flex items-center justify-between p-5 
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

                <a onClick={handleLogout} className="group w-full flex items-center gap-3 p-5 
                                                   hover:bg-red-50 transition-all duration-300 cursor-pointer">
                    <div className="p-1.5 rounded-lg group-hover:bg-red-100 transition-colors">
                        <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-red-700 transition-colors">
                        Keluar
                    </span>
                </a>
            </div>

        </aside>
    )
}