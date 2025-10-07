"use client";

import DashHeader from "@/app/components/DashHeader";
import { useState } from "react";
import { Clock, MapPin, User, ChevronLeft, ChevronRight } from "lucide-react";

export default function JadwalSiswa() {
    const [hariAktif, setHariAktif] = useState("Senin");

    // Dummy data jadwal
    const jadwalData = {
        "Senin": [
            { mapel: "Matematika", jam: "07:00 - 08:30", ruang: "R. 201", guru: "John Doe, S.Pd.", status: "selesai" },
            { mapel: "Bahasa Indonesia", jam: "08:45 - 10:15", ruang: "R. 202", guru: "Jane Smith, S.Pd.", status: "selesai" },
            { mapel: "DKV", jam: "10:30 - 12:00", ruang: "Lab. Komputer", guru: "Reine Smith, S.Kom.", status: "berlangsung" },
            { mapel: "Bahasa Inggris", jam: "13:00 - 14:30", ruang: "R. 203", guru: "Jane Doe, S.S.", status: "akan_datang" },
        ],
        "Selasa": [
            { mapel: "PKK", jam: "07:00 - 08:30", ruang: "R. 204", guru: "Jack Wilson, S.Pd.", status: "akan_datang" },
            { mapel: "Kewirausahaan", jam: "08:45 - 10:15", ruang: "R. 205", guru: "Jack Smith, S.Pd.", status: "akan_datang" },
            { mapel: "Matematika", jam: "10:30 - 12:00", ruang: "R. 201", guru: "John Doe, S.Pd.", status: "akan_datang" },
        ],
        "Rabu": [
            { mapel: "Bahasa Inggris", jam: "07:00 - 08:30", ruang: "R. 203", guru: "Jane Doe, S.S.", status: "akan_datang" },
            { mapel: "DKV", jam: "08:45 - 10:15", ruang: "Lab. Komputer", guru: "Reine Smith, S.Kom.", status: "akan_datang" },
            { mapel: "Bahasa Indonesia", jam: "10:30 - 12:00", ruang: "R. 202", guru: "Jane Smith, S.Pd.", status: "akan_datang" },
        ],
        "Kamis": [
            { mapel: "Kewirausahaan", jam: "07:00 - 08:30", ruang: "R. 205", guru: "Jack Smith, S.Pd.", status: "akan_datang" },
            { mapel: "PKK", jam: "08:45 - 10:15", ruang: "R. 204", guru: "Jack Wilson, S.Pd.", status: "akan_datang" },
            { mapel: "Matematika", jam: "10:30 - 12:00", ruang: "R. 201", guru: "John Doe, S.Pd.", status: "akan_datang" },
        ],
        "Jumat": [
            { mapel: "DKV", jam: "07:00 - 08:30", ruang: "Lab. Komputer", guru: "Reine Smith, S.Kom.", status: "akan_datang" },
            { mapel: "Bahasa Indonesia", jam: "08:45 - 10:15", ruang: "R. 202", guru: "Jane Smith, S.Pd.", status: "akan_datang" },
        ]
    };

    const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
    const jadwalHariIni = jadwalData[hariAktif as keyof typeof jadwalData] || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "berlangsung":
                return "bg-orange-100 text-orange-700 border-orange-200";
            case "selesai":
                return "bg-gray-100 text-gray-600 border-gray-200";
            case "akan_datang":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            default:
                return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "berlangsung":
                return "Sedang Berlangsung";
            case "selesai":
                return "Selesai";
            case "akan_datang":
                return "Akan Datang";
            default:
                return "Tidak Diketahui";
        }
    };

    return (
        <div className="overflow-y-auto min-h-screen">
            <DashHeader/>
            
            {/* Filter Hari */}
            <section className="w-full p-4">
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Jadwal Mata Pelajaran</h2>
                        <span className="text-sm text-gray-500">XII DKV 1</span>
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {hariList.map((hari) => (
                            <button
                                key={hari}
                                onClick={() => setHariAktif(hari)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                    hariAktif === hari
                                        ? "bg-orange-500 text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {hari}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Jadwal Hari Aktif */}
            <section className="w-full grid grid-cols-1 gap-4 p-4">
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Jadwal {hariAktif}</h3>
                        <span className="text-sm text-gray-500">{jadwalHariIni.length} mata pelajaran</span>
                    </div>
                    
                    {jadwalHariIni.length > 0 ? (
                        <div className="space-y-3">
                            {jadwalHariIni.map((jadwal, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                                        jadwal.status === "berlangsung" 
                                            ? "bg-orange-50 border-orange-200 shadow-sm" 
                                            : "bg-white border-gray-200"
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 mb-2">{jadwal.mapel}</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{jadwal.jam}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{jadwal.ruang}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">Status:</span>
                                                    <span className={
                                                        jadwal.status === "berlangsung"
                                                            ? "text-orange-600 font-bold"
                                                            : jadwal.status === "selesai"
                                                            ? "text-green-600 font-bold"
                                                            : "text-gray-500"
                                                    }>
                                                        {(() => {
                                                            if (jadwal.status === "berlangsung") return "Sedang Berlangsung";
                                                            if (jadwal.status === "selesai") return "Selesai";
                                                            if (jadwal.status === "akan_datang") return "Akan Datang";
                                                            return "Tidak Diketahui";
                                                        })()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            Tidak ada jadwal pada hari ini.
                        </div>
                    )}
                </div>
            </section>
        </div>
    )}