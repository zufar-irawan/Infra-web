"use client"

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function LoginRegisterPage() {
    const [activeTab, setActiveTab] = useState('masuk');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        peran: ''
    });

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log('Form submitted:', { ...formData, type: activeTab });
    };

    const handleGoogleLogin = () => {
        console.log('Google login clicked');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-800 to-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <div className="w-16 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                            <div className="text-white text-4xl">🖐️</div>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-orange-500 mb-2">
                        Situs Resmi SMK Prestasi Prima
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Daftar atau masuk ke akun kamu
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex mb-6 bg-gray-100 rounded-full p-1">
                        <button
                            onClick={() => setActiveTab('masuk')}
                            className={`flex-1 py-2.5 px-4 rounded-full font-semibold transition-all ${activeTab === 'masuk'
                                ? 'bg-blue-900 text-white shadow-md'
                                : 'bg-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Masuk
                        </button>
                        <button
                            onClick={() => setActiveTab('daftar')}
                            className={`flex-1 py-2.5 px-4 rounded-full font-semibold transition-all ${activeTab === 'daftar'
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'bg-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Daftar
                        </button>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            {activeTab === 'masuk' ? 'Selamat Datang Kembali' : 'Selamat Datang'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {activeTab === 'masuk'
                                ? 'Masuk ke akun anda untuk melanjutkan pembelajaran'
                                : 'Daftar untuk melanjutkan pembelajaran'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="nama@example.com"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Masukkan password"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Peran
                            </label>
                            <div className="relative">
                                <select
                                    name="peran"
                                    value={formData.peran}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700"
                                >
                                    <option value="">Siswa</option>
                                    <option value="siswa">Siswa</option>
                                    <option value="guru">Guru</option>
                                    <option value="staff">Staff</option>
                                    <option value="alumni">Alumni</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${activeTab === 'masuk'
                                ? 'bg-blue-900 hover:bg-blue-800'
                                : 'bg-orange-500 hover:bg-orange-600'
                                }`}
                        >
                            {activeTab === 'masuk' ? 'Masuk' : 'Daftar'}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">atau</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full py-3 px-4 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Lanjutkan dengan Google
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        {activeTab === 'masuk' ? (
                            <>
                                Belum punya akun?{' '}
                                <button
                                    onClick={() => setActiveTab('daftar')}
                                    className="text-orange-500 font-semibold hover:text-orange-600"
                                >
                                    Daftar sekarang
                                </button>
                            </>
                        ) : (
                            <>
                                Sudah punya akun?{' '}
                                <button
                                    onClick={() => setActiveTab('masuk')}
                                    className="text-blue-900 font-semibold hover:text-blue-800"
                                >
                                    Masuk di sini
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
