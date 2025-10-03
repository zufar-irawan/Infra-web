"use client";

import {getAuthenticatedUser, UserData} from "@/app/lib/Auth";
import {GetServerSideProps} from "next";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


interface SidebarProps {
    user: UserData | null
}

export const getServerSideProps: GetServerSideProps<SidebarProps> = async ({ req }) => {
    try {
        const user = getAuthenticatedUser();
        return { props: { user } };
    } catch (err) {
        console.error(err);
        return { props: { user: null } };
    }
};

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
        <aside className="w-xs min-h-screen bg-white text-gray-700 divide-y-1 divide-gray-200 border-r border-gray-200">
            <section className="w-full flex items-center justify-center gap-2 p-5">
                <img src="/smk.png" width={40} height={40} />
                <h1 className="text-2xl tracking-tight font-bold text-orange-600">Presma EDU</h1>
            </section>
            <section className="w-full flex flex-col justify-center p-5">
                <h2 className="font-bold">
                    John Doe
                </h2>
                <p className="text-sm">
                    {role === 'student' && 'Siswa SMK Presma'}
                    {role === 'teacher' && 'Guru SMK Presma'}
                    {role === 'admin' && 'Admin SMK Prestasi Prima'}
                </p>
            </section>
            <section className="w-full h-160 flex p-5">
                <div className="w-full flex flex-col gap-1">
                    <a href="#" className="bg-orange-600 text-white rounded-lg px-4 py-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 12l9-9 9 9" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 21V9h6v12" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Dashboard
                    </a>
                    <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="7" width="18" height="13" rx="2" />
                            <path d="M16 3v4M8 3v4" />
                        </svg>
                        Manaajemen Kelas
                    </a>
                    <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="7" r="4" />
                            <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
                        </svg>
                        Manajemen Siswa
                    </a>
                    <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="16" rx="2" />
                            <path d="M3 10h18" />
                        </svg>
                        Mata Pelajaran
                    </a>
                    <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 17v-2a4 4 0 0 1 8 0v2" />
                            <circle cx="13" cy="7" r="4" />
                        </svg>
                        Laporan
                    </a>
                    <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        Setelan
                    </a>
                </div>
            </section>
            <a href="#" className="w-full flex flex-col justify-center p-5 hover:bg-gray-100 transition">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 01-3.46 0" />
                        </svg>
                        Notifikasi
                    </span>
                    <span className="bg-red-600 text-white flex items-center justify-center w-8 h-8 rounded-full">2</span>
                </div>
            </a>
            <a onClick={handleLogout} className="w-full flex flex-col justify-center p-5 hover:bg-gray-100 transition cursor-pointer">
                <div className="flex items-center justify-between">
                    <span>Keluar</span>
                </div>
            </a>
        </aside>
    )
}