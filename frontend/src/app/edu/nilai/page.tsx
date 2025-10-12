"use client";

import DashHeader from "@/app/components/DashHeader"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import {User} from "@/app/api/me/route";

export default function NilaiSiswa() {
    const [user, setUser] = useState<User | null>(null)
    const [student, setStudent] = useState<any>()
    const [nilaiMapel, setNilaiMapel] = useState<any>()
    const [ringkasanNilai, setRingkasanNilai] = useState<any>()
    const [filterMapel, setFilterMapel] = useState<string>("")

    const router = useRouter();

    useEffect(() => {
        const fetchAll = async() => {
            try {
                const resMe = await axios.get('/api/me');
                const me = resMe.data.user;
                setUser(me);

                const resStudent = await axios.get('/api/student');
                const studentPayload = resStudent.data?.data ?? resStudent.data;
                const studentList = Array.isArray(studentPayload) ? studentPayload : (studentPayload?.data ?? []);
                const studentMe = studentList.find(
                    (s:any) => (s.userId ?? s.user_id) === me?.id
                );
                setStudent(studentMe);

                const sid = studentMe?.id ?? studentMe?.student_id;
                if (!sid) return; // stop if can't resolve student id

                const resNilai = await axios.get('/api/nilai', {
                    params: {
                        student_id: sid
                    }
                });
                setNilaiMapel(resNilai.data?.nilai_mapel ?? null)
                setRingkasanNilai(resNilai.data?.ringkasan ?? null)

            } catch (error: any) {
                console.error("Error fetching data:", error);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    handleLogout();
                }
            }
        }

        fetchAll();
    }, [])

    const handleLogout = async () => {
        await axios.post('/api/logout')
            .then((res) => {
                if(res.status === 200){
                    router.push('/edu/login');
                }
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            })
    }

    // Transform API nilai_mapel object into array for table
    const dataNilai = React.useMemo(() => {
        if (!nilaiMapel) return [] as Array<{ mapel: string; total: number; rata: number }>;
        return Object.entries(nilaiMapel).map(([mapel, v]: any) => ({
            mapel,
            total: Number(v?.total_nilai ?? 0),
            rata: Number(v?.nilai_median ?? 0),
        }));
    }, [nilaiMapel]);

    // Options for filter dropdown
    const mapelOptions = React.useMemo(() => {
        return dataNilai.map((d) => d.mapel);
    }, [dataNilai]);

    // Apply filter by selected mapel
    const filteredDataNilai = React.useMemo(() => {
        if (!filterMapel) return dataNilai;
        return dataNilai.filter((d) => d.mapel === filterMapel);
    }, [dataNilai, filterMapel]);

    // Derived ringkasan values with guards
    const rataKeseluruhan = (() => {
        const val = ringkasanNilai?.rata_rata_keseluruhan;
        return typeof val === 'number' ? val.toFixed(2) : "-";
    })();
    const nilaiTertinggi = ringkasanNilai?.nilai_tertinggi?.nilai_median ?? null;
    const nilaiTerendah = ringkasanNilai?.nilai_terendah?.nilai_median ?? null;

    return (
        <>
        {user?.role === 'siswa' && (
        <div className="overflow-y-auto min-h-screen">
            <DashHeader user={user} student={student} />

            <section className="w-full grid grid-cols-1 gap-4 p-4">
                {/* Ringkasan Nilai */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col items-center">
                        <span className="text-xs text-orange-700 font-semibold">Rata-rata Keseluruhan</span>
                        <span className="text-2xl font-bold text-orange-600">{rataKeseluruhan}</span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col items-center">
                        <span className="text-xs text-emerald-700 font-semibold">Nilai Tertinggi</span>
                        <span className="text-2xl font-bold text-emerald-600">{typeof nilaiTertinggi === 'number' ? nilaiTertinggi.toFixed(2) : '-'}</span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col items-center">
                        <span className="text-xs text-red-700 font-semibold">Nilai Terendah</span>
                        <span className="text-2xl font-bold text-red-600">{typeof nilaiTerendah === 'number' ? nilaiTerendah.toFixed(2) : '-'}</span>
                    </div>
                </div>

                {/* Tabel Nilai */}
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold">Daftar Nilai Mata Pelajaran</h2>
                        <div className="flex items-center gap-2">
                            <label htmlFor="filter-mapel" className="text-sm text-gray-600">Filter Mapel</label>
                            <select
                                id="filter-mapel"
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                value={filterMapel}
                                onChange={(e) => setFilterMapel(e.target.value)}
                            >
                                <option value="">Semua Mapel</option>
                                {mapelOptions.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>
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
                                {filteredDataNilai.map((d) => (
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