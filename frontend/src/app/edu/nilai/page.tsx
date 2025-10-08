"use client";

import { Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import DashHeader from "@/app/components/DashHeader"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import {User} from "@/app/api/me/route";

export default function NilaiSiswa() {
    const [user, setUser] = useState<User | null>(null)

    const router = useRouter();

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

    // Dummy data nilai
    const dataNilai = [
        { mapel: "Bahasa Indonesia", total: 1120, rata: 88 },
        { mapel: "Matematika", total: 1095, rata: 84 },
        { mapel: "Bahasa Inggris", total: 1150, rata: 92 },
        { mapel: "DKV", total: 1200, rata: 95 },
        { mapel: "Kewirausahaan", total: 980, rata: 75 }
    ];

    // Hitung ringkasan
    const rata2 = (dataNilai.reduce((a, b) => a + b.rata, 0) / dataNilai.length).toFixed(1);
    const tertinggi = Math.max(...dataNilai.map(d => d.rata));
    const terendah = Math.min(...dataNilai.map(d => d.rata));

    return (
        <>
        {user?.role === 'siswa' && (
        <div className="overflow-y-auto min-h-screen">
            <DashHeader/>
            <section className="w-full grid grid-cols-1 gap-4 p-4">
                {/* Ringkasan Nilai */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col items-center">
                        <span className="text-xs text-orange-700 font-semibold">Rata-rata Keseluruhan</span>
                        <span className="text-2xl font-bold text-orange-600">{rata2}</span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col items-center">
                        <span className="text-xs text-emerald-700 font-semibold">Nilai Tertinggi</span>
                        <span className="text-2xl font-bold text-emerald-600">{tertinggi}</span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col items-center">
                        <span className="text-xs text-red-700 font-semibold">Nilai Terendah</span>
                        <span className="text-2xl font-bold text-red-600">{terendah}</span>
                    </div>
                </div>
                {/* Tabel Nilai */}
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                    {/* <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold">Daftar Nilai Mata Pelajaran</h2>
                        <span className="text-xs text-gray-400">2025/2026</span>
                    </div> */}
                    <div className="overflow-x-auto">
                        <table id="mapel-nilai" className="min-w-full text-sm">
                            <thead className="font-semibold text-lg bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 text-start">Mata Pelajaran</th>
                                    <th className="py-2 px-4 text-end">Total Nilai</th>
                                    <th className="py-2 px-4 text-end">Rata-rata Nilai</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataNilai.map((d, i) => (
                                    <tr key={d.mapel} className="group hover:bg-orange-50 transition">
                                        <td className="py-3 px-4 font-medium text-gray-800">{d.mapel}</td>
                                        <td className="py-3 px-4 text-end">{d.total}</td>
                                        <td className="py-3 px-4 text-end">
                                            <span
                                                className={
                                                    d.rata >= 90
                                                        ? "bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-semibold"
                                                        : d.rata <= 80
                                                        ? "bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold"
                                                        : "bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold"
                                                }
                                            >
                                                {d.rata}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
        )}
        </>
    )
}