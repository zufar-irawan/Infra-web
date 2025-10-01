"use client"

import React, { useState } from 'react';
import { GraduationCap, Users, Award, School, Star } from 'lucide-react';
import Footer from '../components/footer';
import Navbar from '../components/header'

export default function PenerimaanSiswaPage() {
    const [expandedStep, setExpandedStep] = useState(null);
    const [expandedAfterStep, setExpandedAfterStep] = useState(null);

    const stats = [
        { icon: GraduationCap, value: '4,000', label: 'Lulusan' },
        { icon: Users, value: '2,000', label: 'Siswa' },
        { icon: Award, value: '3,000', label: 'Penghargaan' },
        { icon: School, value: '1,000', label: 'Kelas' }
    ];

    const pendaftaranSteps = [
        { number: '1', title: 'Langkah Pertama Pendaftaran' },
        { number: '2', title: 'Langkah Kedua Pendaftaran' },
        { number: '3', title: 'Langkah Ketiga Pendaftaran' },
        { number: '4', title: 'Langkah Keempat Pendaftaran' },
        { number: '5', title: 'Langkah Kelima Pendaftaran' }
    ];

    const afterSteps = [
        { number: '1', title: 'Langkah Pertama Setelah Pendaftaran' },
        { number: '2', title: 'Langkah Kedua Setelah Pendaftaran' },
        { number: '3', title: 'Langkah Ketiga Setelah Pendaftaran' },
        { number: '4', title: 'Langkah Keempat Setelah Pendaftaran' },
        { number: '5', title: 'Langkah Kelima Setelah Pendaftaran' }
    ];

    const toggleStep = (index: any | React.SetStateAction<null>) => {
        setExpandedStep(expandedStep === index ? null : index);
    };

    const toggleAfterStep = (index: any | React.SetStateAction<null>) => {
        setExpandedAfterStep(expandedAfterStep === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Breadcrumb */}
            <div className="bg-white mt-16 px-6 py-4 border-b">
                <div className="max-w-7xl mx-auto">
                    <p className="text-sm text-gray-600">
                        <span className="text-orange-500">Beranda</span> &gt;
                        <span className="text-orange-500"> Penerimaan Siswa</span> &gt;
                        <span> Daftar Sekarang</span>
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Title */}
                <h1 className="text-4xl font-bold text-center text-blue-900 mb-16">
                    Penerimaan Siswa SMK Prestasi Prima
                </h1>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                    {/* Image Placeholder */}
                    <div className="relative">
                        <div className="w-full h-80 bg-gradient-to-br from-blue-100 via-blue-200 to-orange-100 rounded-2xl shadow-xl overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-32 h-32 bg-white/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <School className="w-16 h-16 text-blue-800" />
                                    </div>
                                    <p className="text-blue-800 font-semibold text-lg">SMK Prestasi Prima</p>
                                    <p className="text-blue-600 text-sm">Gedung Sekolah</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <h2 className="text-3xl font-bold text-orange-500 mb-6">
                            Bergabunglah dengan Kami
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Kami menyambut siswa dari berbagai latar belakang, dimana mereka dan seluruh keluarga mereka menjadi bagian dari komunitas kami yang suportif. Kami percaya bahwa komunitas sekolahnya dan komunitas kami adalah salah satu kekuatan kami, dan kami bangga akan relasi erat yang kami miliki dengan seluruh keluarga di SMK Prestasi Prima. Bergabunglah dengan kami, dan temukan bagaimana keseluhan visi dan kebaragamaan latar belakang berkerja untuk menciptakan suatu hal yang istimewa!
                        </p>
                    </div>
                </div>

                {/* Statistics */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl shadow-2xl py-16 px-8 mb-20">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className="flex justify-center mb-4">
                                        <Icon className="w-12 h-12 text-orange-500" />
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-blue-200 text-sm font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 5 Langkah Pendaftaran */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center text-blue-900 mb-4">
                        5 Langkah Pendaftaran
                    </h2>
                    <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
                        Kami menyiapkan daftar pertanyaan yang sering diajukan oleh para orang tua. Jika Anda memiliki pertanyaan lainnya, jangan ragu untuk menghubungi kami. Konselor.
                    </p>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {pendaftaranSteps.map((step, index) => (
                            <div key={index} className="border-b border-gray-200">
                                <button
                                    onClick={() => toggleStep(index)}
                                    className="w-full py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-lg font-semibold text-blue-900">
                                        {step.number}?
                                    </span>
                                    <Star
                                        className={`w-6 h-6 transition-all ${expandedStep === index
                                            ? 'text-orange-500 fill-orange-500'
                                            : 'text-blue-900 fill-blue-900'
                                            }`}
                                    />
                                </button>
                                {expandedStep === index && (
                                    <div className="pb-4 px-2 text-gray-700">
                                        <p>{step.title}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5 Langkah Setelah Pendaftaran */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center text-blue-900 mb-4">
                        5 Langkah setelah Pendaftaran
                    </h2>
                    <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
                        Kami menyiapkan daftar pertanyaan yang sering diajukan oleh para orang tua. Jika Anda memiliki pertanyaan lainnya, jangan ragu untuk menghubungi kami. Konselor.
                    </p>

                    <div className="max-w-3xl mx-auto space-y-4 mb-8">
                        {afterSteps.map((step, index) => (
                            <div key={index} className="border-b border-gray-200">
                                <button
                                    onClick={() => toggleAfterStep(index)}
                                    className="w-full py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-lg font-semibold text-blue-900">
                                        {step.number}?
                                    </span>
                                    <Star
                                        className={`w-6 h-6 transition-all ${expandedAfterStep === index
                                            ? 'text-orange-500 fill-orange-500'
                                            : 'text-blue-900 fill-blue-900'
                                            }`}
                                    />
                                </button>
                                {expandedAfterStep === index && (
                                    <div className="pb-4 px-2 text-gray-700">
                                        <p>{step.title}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="text-center">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg">
                            Daftar Sekarang
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}