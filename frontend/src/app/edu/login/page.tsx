"use client"

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function LoginRegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log('Form submitted:', { ...formData });
    };

    const handleGoogleLogin = () => {
        console.log('Google login clicked');
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-orange-50">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-800 to-blue-900 rounded-full mx-auto flex items-center justify-center shadow-lg mb-4">
                        <img src="../smk.png" draggable="false" />
                    </div>
                    <h1 className="text-2xl font-black text-red-500 mb-2">
                        Presma EDU
                    </h1>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-bold text-gray-700 mb-1">
                            Selamat Datang!
                        </h2>
                        <p className=" text-gray-500 text-sm">
                            Silahkan login ke akun anda.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="user@example.com"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:border-orange-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:border-orange-500 transition-all"
                            />
                        </div>

                        <div className='space-y-3'>
                            <button
                                onClick={handleSubmit}
                                className="w-full py-3 px-4 rounded-lg border border-orange-500 font-bold text-white transition bg-orange-500 hover:bg-orange-600 cursor-pointer"
                            >
                                Masuk
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">atau</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="w-full py-3 px-4 rounded-lg border border-gray-200 font-medium text-gray-700 transition bg-transparent hover:bg-gray-100 cursor-pointer flex items-center justify-center gap-"
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
                    </div>

                    {/* <p className="text-center  text-gray-500 mt-6">
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
                    </p> */}
                </div>
            </div>
        </div>
    );
}
