"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/header'
import Footer from '@/app/components/footer';

export default function PrestasiPage() {
    const [akademikPage, setAkademikPage] = useState(0);
    const [nonAkademikPage, setNonAkademikPage] = useState(0);

    const prestasiAkademik = [
        { title: 'JUARA DUA', subtitle: 'LOMBA KOMPETENSI SISWA', category: 'WEB DESIGN & DEVELOPMENT', student: 'Tim SMK Prestasi Prima', type: 'team' },
        { title: 'JUARA TIGA', subtitle: 'LKS GRAPHIC DESIGN TECHNOLOGY', student: 'BAYU JOHAN PERMANA SIRAIT', type: 'individual' },
        { title: 'JUARA TIGA', subtitle: 'OLIMPIADE MATEMATIKA', student: 'FITRIYANTI MEIYOU CAHAYA SOESANTO', prize: 'Rp 50.000', type: 'individual' },
        { title: 'JUARA TIGA', subtitle: 'LKS NETWORK SYSTEMS', student: 'ERZA DZAKY FAJRIN R WILY', type: 'individual' },
        { title: 'JUARA DUA', subtitle: 'LOMBA KOMPETENSI SISWA', category: 'CYBER SECURITY', student: 'Tim SMK Prestasi Prima', type: 'team' },
        { title: 'JUARA TIGA', subtitle: 'LKS MOBILE ROBOTICS', student: 'IDA NUGRAH & RAFLY ALDY', type: 'individual' }
    ];

    const prestasiNonAkademik = [
        { title: 'JUARA DUA', subtitle: 'BULU TANGKIS BEREGU PUTRA', student: 'Tim SMK Prestasi Prima', category: 'Guru 3', type: 'team' },
        { title: 'JUARA TIGA', subtitle: 'LKS GRAPHIC DESIGN', student: 'BAYU JOHAN PERMANA SIRAIT', category: 'Guru 3', type: 'individual' },
        { title: 'JUARA TIGA', subtitle: 'KARATE PERORANGAN PUTRI', student: 'FITRIYANTI MEIYOU CAHAYA', prize: 'Rp 50.000', category: 'Guru 3', type: 'individual' },
        { title: 'JUARA TIGA', subtitle: 'RENANG GAYA DADA 50M', student: 'ERZA DZAKY FAJRIN R WILY', category: 'Guru 3', type: 'individual' },
        { title: 'JUARA DUA', subtitle: 'BULU TANGKIS BEREGU PUTRA', student: 'Tim SMK Prestasi Prima', category: 'Guru 3', type: 'team' },
        { title: 'JUARA TIGA', subtitle: 'LKS MOBILE ROBOTICS', student: 'IDA NUGRAH & RAFLY ALDY', category: 'Guru 3', type: 'individual' }
    ];

    const itemsPerPage = 6;
    const totalAkademikPages = Math.ceil(prestasiAkademik.length / itemsPerPage);
    const totalNonAkademikPages = Math.ceil(prestasiNonAkademik.length / itemsPerPage);

    const currentAkademik = prestasiAkademik.slice(
        akademikPage * itemsPerPage,
        (akademikPage + 1) * itemsPerPage
    );

    const currentNonAkademik = prestasiNonAkademik.slice(
        nonAkademikPage * itemsPerPage,
        (nonAkademikPage + 1) * itemsPerPage
    );

    const PrestasiCard = ({ item }) => (
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform">
            <div className="p-6 text-center relative">
                {/* Header dengan logo */}
                <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/40 rounded-full"></div>
                    </div>
                    <div className="text-right">
                        <div className="bg-white/20 px-3 py-1 rounded text-xs text-white font-bold">
                            SMK PRESTASI PRIMA
                        </div>
                    </div>
                </div>

                {/* Congratulation text */}
                <h3 className="text-white text-2xl md:text-3xl font-black tracking-wider mb-4" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.3)' }}>
                    CONGRATULATION
                </h3>

                {/* Photo area dengan pattern kotak-kotak */}
                <div className="relative mb-4 min-h-[180px] flex items-center justify-center">
                    {/* Checkered pattern background */}
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)`
                    }}></div>

                    {item.type === 'team' ? (
                        <div className="relative z-10 grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-20 h-24 bg-gradient-to-br from-red-800 to-red-900 rounded shadow-lg"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="relative z-10 w-28 h-36 bg-gradient-to-br from-orange-600 to-orange-700 rounded shadow-lg"></div>
                    )}
                </div>

                {/* Award banner */}
                <div className="relative bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 rounded-lg p-4 shadow-xl" style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-600/20"></div>

                    <h4 className="relative text-3xl md:text-4xl font-black text-white mb-2" style={{
                        textShadow: '3px 3px 0px rgba(255,140,0,0.8), 2px 2px 0px rgba(0,0,0,0.3)',
                        WebkitTextStroke: '1px rgba(255,140,0,0.5)'
                    }}>
                        {item.title}
                    </h4>

                    {item.category && (
                        <p className="relative text-xs text-orange-800 font-bold mb-1">
                            {item.category}
                        </p>
                    )}

                    <p className="relative text-xs md:text-sm font-bold text-orange-900 uppercase mb-1">
                        {item.subtitle}
                    </p>

                    <p className="relative text-xs text-orange-900 font-semibold">
                        {item.student}
                    </p>

                    {item.prize && (
                        <p className="relative text-sm font-bold text-green-700 mt-1">
                            {item.prize}
                        </p>
                    )}
                </div>

                {/* Bottom dots decoration */}
                <div className="flex justify-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-2 h-2 bg-white/30 rounded-full"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Breadcrumb */}
            <div className="bg-white px-6 py-4 border-b mt-16">
                <div className="max-w-7xl mx-auto">
                    <p className="text-sm text-gray-600">
                        <span className="text-orange-500">Beranda</span> &gt;
                        <span className="text-orange-500"> Kehidupan Siswa</span> &gt;
                        <span> Prestasi</span>
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Prestasi Akademik Section */}
                <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">
                    Prestasi Akademik
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentAkademik.map((item, index) => (
                        <PrestasiCard key={index} item={item} />
                    ))}
                </div>

                {/* Pagination Akademik */}
                <div className="flex justify-center items-center gap-4 mb-20">
                    <button
                        onClick={() => setAkademikPage((prev) => (prev - 1 + totalAkademikPages) % totalAkademikPages)}
                        className="p-2 border-2 border-blue-900 rounded hover:bg-blue-900 hover:text-white transition-colors"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setAkademikPage((prev) => (prev + 1) % totalAkademikPages)}
                        className="p-2 border-2 border-blue-900 rounded hover:bg-blue-900 hover:text-white transition-colors"
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Prestasi Non-Akademik Section */}
                <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
                    Prestasi Non-Akademik
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentNonAkademik.map((item, index) => (
                        <PrestasiCard key={index} item={item} />
                    ))}
                </div>

                {/* Pagination Non-Akademik */}
                <div className="flex justify-center items-center gap-4">
                    <button
                        onClick={() => setNonAkademikPage((prev) => (prev - 1 + totalNonAkademikPages) % totalNonAkademikPages)}
                        className="p-2 border-2 border-blue-900 rounded hover:bg-blue-900 hover:text-white transition-colors"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setNonAkademikPage((prev) => (prev + 1) % totalNonAkademikPages)}
                        className="p-2 border-2 border-blue-900 rounded hover:bg-blue-900 hover:text-white transition-colors"
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
}