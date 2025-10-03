"use client"

import Footer from '@/components/Footer';
import Navbar from '@/components/Header';

export default function Ekstrakurikuler() {

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

    return (
        <>
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
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md overflow-hidden 
                                        transform transition-transform duration-300 
                                        hover:scale-105 hover:shadow-xl">
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
            </div>
        </>
    );
}