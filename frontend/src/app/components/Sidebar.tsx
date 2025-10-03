"use client";

import Link from "next/link";
import {getCurrenUser, User} from "@/app/lib/user";
import {getToken} from "@/app/lib/Auth";
import {GetServerSideProps} from "next";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
    user: User | null
}

export const getServerSideProps: GetServerSideProps<SidebarProps> = async ({ req }) => {
    const token = getToken(req);

    if (!token) {
        return { props: { user: null } }; // user belum login
    }

    try {
        const user = await getCurrenUser(token);
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
                    <a href="#" className="bg-orange-600 text-white rounded-lg px-4 py-3">Dashboard</a>
                    <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer">Manaajemen Kelas</a>
                    <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer">Manajemen Siswa</a>
                    <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer">Mata Pelajaran</a>
                    <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer">Laporan</a>
                    <a href="#" className="rounded-lg px-4 py-3 hover:bg-gray-100 transition cursor-pointer">Setelan</a>
                </div>
            </section>
            <a href="#" className="w-full flex flex-col justify-center p-5 hover:bg-gray-100 transition">
                <div className="flex items-center justify-between">
                    <span>Notifikasi</span>
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