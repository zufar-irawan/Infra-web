"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import {BellRing, Bolt, BookMarked, ChartNoAxesCombined, LayoutDashboard, LogOut, Shapes, Users} from "lucide-react";


interface SidebarProps {
    user: any | null
}

export default function Sidebar({ user }:SidebarProps) {
    console.log(user);
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setRole(user.role || user.peran || null);
                } catch (e) {
                    setRole(null);
                }
            }
        }
    }, []);
    
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
                text-white font-bold text-4xl items-center justify-center flex">
                        J
                    </div>

                    <div className={"flex flex-col"}>
                        <h2 className="font-bold">
                            John Doe
                        </h2>
                        <p className="text-sm">
                            {role === 'siswa' ? 'Siswa SMK Presma' :
                                (role === 'guru' ? 'Guru SMK Presma' :
                                    role === 'admin' ? 'Admin SMK Prestasi Prima' : "Tamu")}
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