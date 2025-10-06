"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import {BellRing, Bolt, BookMarked, ChartNoAxesCombined, LayoutDashboard, LogOut, Shapes, Users} from "lucide-react";
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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/edu/login');
        }
    };

    return (
        <aside className="w-xs min-h-screen bg-white text-gray-700
                 divide-y-1 divide-gray-200 border-r border-gray-200
                 flex flex-col justify-between">
            <div>
                <section className="w-full bg-orange-600 flex justify-center items-center  gap-2 p-5">
                    <Image src="/smk.png" alt={"logo-smk"} width={55} height={55} />
                    <h1 className="text-2xl tracking-tight font-bold text-white">Presma EDU</h1>
                </section>

                <section className="w-full flex p-5 gap-2 items-center">
                    <div className="w-15 h-15 text-center rounded-4xl bg-orange-600
                    text-white font-bold text-2xl items-center justify-center flex">
                        {user?.name?.split(" ").map(n => n[0]?.toUpperCase()).join("") || "T"}
                    </div>

                    <div className={"flex flex-col"}>
                        <h2 className="font-bold">
                            {user?.name || "Tamu"}
                        </h2>
                        <p className="text-sm">
                            {user?.role || "Tamu"}
                        </p>
                    </div>
                </section>

                <section className="w-full h-auto flex p-5">
                    <div className="w-full flex flex-col gap-2">
                        <a href="#" className="bg-orange-600 text-white rounded-lg px-4 py-3 flex items-center gap-2">
                            <LayoutDashboard />
                            Dashboard
                        </a>
                        <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer flex items-center gap-2">
                            <Shapes />
                            Manajemen Kelas
                        </a>
                        <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer flex items-center gap-2">
                            <Users />
                            Manajemen Siswa
                        </a>
                        <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer flex items-center gap-2">
                            <BookMarked />
                            Mata Pelajaran
                        </a>
                        <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer flex items-center gap-2">
                            <ChartNoAxesCombined />
                            Laporan
                        </a>
                        <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer flex items-center gap-2">
                            <Bolt />
                            Setelan
                        </a>
                    </div>
                </section>
            </div>

            <div>
                <a href="#" className="w-full flex flex-col justify-center p-5 hover:bg-gray-100 transition">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <BellRing />
                            Notifikasi
                        </span>
                        <span className="bg-red-600 text-white flex items-center justify-center w-8 h-8 rounded-full">2</span>
                    </div>
                </a>

                <a onClick={handleLogout} className="w-full flex flex-col justify-center p-5 hover:bg-gray-100 transition cursor-pointer">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <LogOut />
                            Keluar
                        </span>
                    </div>
                </a>
            </div>

        </aside>
    )
}