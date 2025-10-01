"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/header';

export default function Ekstrakurikuler() {
    const [currentPage, setCurrentPage] = useState(0);

    const ekstrakurikuler = [
        { name: 'Paskibra', image: '/placeholder-paskibra.jpg' },
        { name: 'Futsal', image: '/placeholder-futsal.jpg' },
        { name: 'Rohani', image: '/placeholder-rohani.jpg' },
        { name: 'Badminton', image: '/placeholder-badminton.jpg' },
        { name: 'Bola Basket', image: '/placeholder-basket.jpg' },
        { name: 'Angkat Besi', image: '/placeholder-angkat-besi.jpg' },
        { name: 'Karate', image: '/placeholder-karate.jpg' },
        { name: 'Olimpik', image: '/placeholder-olimpik.jpg' }
    ];

    const prestasi = [
        { title: 'JUARA DUA', subtitle: 'BULU TANGKIS BEREGU PUTRA', student: 'Tim SMK Prestasi Prima', type: 'team' },
        { title: 'JUARA TIGA', subtitle: 'LKS GRAPHIC DESIGN TECHNOLOGY', student: 'BAYU JOHAN PERMANA SIRAIT', type: 'individual' },
        { title: 'JUARA TIGA', subtitle: 'KARATE PERORANGAN PUTRI', student: 'FITRIYANTI MEIYOU CAHAYA SOESANTO', type: 'individual' },
        { title: 'JUARA TIGA', subtitle: 'RENANG GAYA DADA 50M', student: 'ERZA DZAKY FAJRIN R WILY', type: 'individual' },
        { title: 'JUARA DUA', subtitle: 'BULU TANGKIS BEREGU PUTRA', student: 'Tim SMK Prestasi Prima', type: 'team' },
        { title: 'JUARA TIGA', subtitle: 'LKS MOBILE ROBOTICS APPLICATION', student: 'IDA NUGRAH JIHAN M & RAFLY ALDY', type: 'individual' },
        { title: 'JUARA DUA', subtitle: 'BULU TANGKIS BEREGU PUTRA', student: 'Tim SMK Prestasi Prima', type: 'team' },
        { title: 'JUARA TIGA', subtitle: 'LKS GRAPHIC DESIGN TECHNOLOGY', student: 'BAYU JOHAN PERMANA SIRAIT', type: 'individual' },
        { title: 'JUARA TIGA', subtitle: 'KARATE PERORANGAN PUTRI', student: 'FITRIYANTI MEIYOU CAHAYA SOESANTO', type: 'individual' }
    ];

    const itemsPerPage = 9;
    const totalPages = Math.ceil(prestasi.length / itemsPerPage);

    const currentPrestasi = prestasi.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Breadcrumb */}
            <div className="bg-white px-6 py-4 border-b mt-16">
                <div className="max-w-7xl mx-auto">
                    <p className="text-sm text-gray-600">
                        <span className="text-orange-500">Beranda</span> &gt;
                        <span className="text-orange-500"> Kehidupan Siswa</span> &gt;
                        <span> Ekstrakurikuler</span>
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Ekstrakurikuler Section */}
                <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">
                    Ekstrakurikuler
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {ekstrakurikuler.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="relative">
                                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-32 h-32 bg-white/50 rounded-full mx-auto mb-2"></div>
                                        <p className="text-blue-600 font-semibold">{item.name}</p>
                                    </div>
                                </div>
                                <div className="absolute right-0 top-0 bottom-0 w-12 bg-blue-900 flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold transform -rotate-90 whitespace-nowrap">
                                        {item.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Prestasi Non-Akademik Section */}
                <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
                    Prestasi Non-Akademik
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentPrestasi.map((item, index) => (
                        <div key={index} className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform">
                            <div className="p-6 text-center">
                                <div className="bg-white/20 rounded-t-lg p-4 mb-4">
                                    <img src="/api/placeholder/80/80" alt="SMK Logo" className="w-20 h-20 mx-auto mb-2" />
                                    <h3 className="text-white text-3xl font-black tracking-wider" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.3)' }}>
                                        CONGRATULATION
                                    </h3>
                                </div>

                                <div className="bg-white/30 rounded-lg p-4 mb-4 min-h-[200px] flex items-center justify-center">
                                    {item.type === 'team' ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="w-20 h-24 bg-white/40 rounded"></div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="w-32 h-40 bg-white/40 rounded"></div>
                                    )}
                                </div>

                                <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-lg p-4 relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' }}>
                                    <h4 className="text-4xl font-black text-white mb-2" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
                                        {item.title}
                                    </h4>
                                    <p className="text-sm font-bold text-orange-900 uppercase mb-1">
                                        {item.subtitle}
                                    </p>
                                    <p className="text-xs text-orange-900 font-semibold">
                                        {item.student}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4">
                    <button
                        onClick={prevPage}
                        className="p-2 border-2 border-blue-900 rounded hover:bg-blue-900 hover:text-white transition-colors"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextPage}
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