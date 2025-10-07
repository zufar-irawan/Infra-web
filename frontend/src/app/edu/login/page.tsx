"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {showLoginSuccessAlert} from "@/components/LoginSuccess";
import axios from "axios";

export default function LoginRegisterPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("masuk");

    // Animation states for interactive experience
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [hasEmailValue, setHasEmailValue] = useState(false);
    const [hasPasswordValue, setHasPasswordValue] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true);

            if(activeTab === "masuk") {
                const res = await axios.post("/api/login", {email, password})

                if(res.data.login) {
                    showLoginSuccessAlert()

                    router.push("/edu/dashboard")
                } else {
                    setError(res.data.message)
                }
            }

        } catch (error: any) {
            if(error.response.status === 401 || error.response.status === 400) {
                setError(error.response.data.message)
            } else {
                console.error(error.response.data.message)
                alert(error.response?.data?.message || "Login gagal, coba lagi.")
            }
        } finally {
            setLoading(false);
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setHasEmailValue(e.target.value.length > 0);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setHasPasswordValue(e.target.value.length > 0);
    };

    const handleGoogleLogin = () => {
        console.log("Google login clicked");
    };

    // Helper function to validate email format
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Check if password meets minimum requirements (8 characters)
    const isValidPassword = (password: string) => {
        return password.length >= 8;
    };

    // Determine animation state based on user interactions - with improved icon stacking logic
    const getAnimationState = () => {
        if (loading) return 'loading';
        // Prioritize currently focused field
        if (isPasswordFocused) return 'password'; // Password icon muncul saat fokus
        if (isEmailFocused) return 'email';
        // Show email state if email is valid but password not focused yet
        if (hasEmailValue && isValidEmail(email) && !isPasswordFocused && !hasPasswordValue) return 'email';
        // Show password state if both email is valid and password has any value
        if (hasEmailValue && isValidEmail(email) && hasPasswordValue && !isValidPassword(password)) return 'password';
        // Show "all fields filled" state when both are valid but no field is focused
        if (hasEmailValue && isValidEmail(email) && hasPasswordValue && isValidPassword(password) && !isEmailFocused && !isPasswordFocused) return 'completed';
        return 'idle';
    };

    // Get completed steps for icon stacking - only when actually completed and ready to move
    const getCompletedSteps = () => {
        // @ts-ignore
        const steps = [];
        // Don't show any completed icons during loading
        // @ts-ignore
        if (loading) return steps;

        // Email is completed when valid AND user has moved to password
        if (hasEmailValue && isValidEmail(email) && (isPasswordFocused || (hasPasswordValue && isValidPassword(password)))) {
            steps.push('email');
        }
        // Password is completed when it has 8+ characters AND user submitted (loading)
        if (hasPasswordValue && isValidPassword(password) && loading) {
            steps.push('password');
        }
        return steps;
    };

    // Check if logo should be smaller (when there are completed steps)
    const shouldShrinkLogo = () => {
        return getCompletedSteps().length > 0;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
            {/* Centered Container with Two Sections - Responsive Layout */}
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row lg:h-[600px]">
                {/* Animation Container - Top on mobile (1/4 height), Left on desktop */}
                <div className="lg:flex-1 h-48 lg:h-full relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
                    {/* Background Pattern - Adjusted for mobile */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-2 left-4 lg:top-10 lg:left-10 w-12 h-12 lg:w-20 lg:h-20 border-2 border-white rounded-full animate-pulse"></div>
                        <div className="absolute top-8 right-6 lg:top-32 lg:right-16 w-10 h-10 lg:w-16 lg:h-16 border border-orange-300 rounded-full animate-bounce"></div>
                        <div className="absolute bottom-8 left-6 lg:bottom-32 lg:left-16 w-8 h-8 lg:w-12 lg:h-12 border border-white rounded-full animate-ping"></div>
                        <div className="absolute bottom-2 right-4 lg:bottom-16 lg:right-12 w-10 h-10 lg:w-14 lg:h-14 border-2 border-orange-300 rounded-full animate-pulse"></div>
                    </div>

                    {/* Main Animation Content - Adjusted for mobile */}
                    <div className="flex flex-col justify-center items-center w-full h-full px-4 py-4 lg:p-8 relative z-10">
                        {/* Logo Animation - Bergeser ke atas saat ada completed steps */}
                        <div className={`transition-all duration-500 ${
                            shouldShrinkLogo() ? 'scale-75 opacity-80 -translate-y-4 lg:-translate-y-6' : 
                            getAnimationState() === 'idle' ? 'scale-100 opacity-100' : 'scale-75 opacity-80'
                        }`}>
                            <div className="w-16 h-16 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mb-3 lg:mb-6">
                                <Image src={"/webp/smk.webp"} alt="Logo" width={40} height={40} className="lg:w-[60px] lg:h-[60px] rounded-full" />
                            </div>
                        </div>

                        {/* Dynamic Content Based on State - Mobile optimized with stacked icons */}
                        <div className="text-center text-white relative">
                            {/* Completed Steps Icons - Stacked above current step */}
                            <div className="absolute -top-8 lg:-top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-1 lg:space-y-2">
                                {getCompletedSteps().map((step, index) => (
                                    <div
                                        key={step}
                                        className={`w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center transition-all duration-500 animate-slide-up opacity-80 ${
                                            getAnimationState() !== step ? 'scale-75' : 'scale-100'
                                        }`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                ))}
                            </div>

                            {getAnimationState() === 'idle' && (
                                <div className="animate-fade-in">
                                    <h2 className="text-xl lg:text-3xl font-bold mb-1 lg:mb-3">Welcome to</h2>
                                    <h1 className="text-2xl lg:text-4xl font-black text-orange-400 mb-2 lg:mb-4">Presma EDU</h1>
                                    <p className="text-sm lg:text-lg text-blue-200 max-w-xs lg:max-w-sm hidden sm:block">
                                        Platform pembelajaran digital terdepan untuk masa depan yang lebih cerah
                                    </p>
                                </div>
                            )}

                            {getAnimationState() === 'email' && (
                                <div className="animate-slide-up">
                                    {hasEmailValue && isValidEmail(email) ? (
                                        // Valid email - show green checkmark
                                        <div className="w-12 h-12 lg:w-20 lg:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-4 animate-bounce">
                                            <svg className="w-6 h-6 lg:w-10 lg:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    ) : (
                                        // Email being typed or invalid - show orange email icon
                                        <div className="w-12 h-12 lg:w-20 lg:h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-4 animate-bounce">
                                            <svg className="w-6 h-6 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <h3 className="text-lg lg:text-2xl font-bold mb-1 lg:mb-3">
                                        {hasEmailValue && isValidEmail(email) ? "Email Valid!" : "Email Ready!"}
                                    </h3>
                                    <p className="text-blue-200 text-xs lg:text-base hidden sm:block">
                                        {hasEmailValue && isValidEmail(email)
                                            ? "Perfect! Your email is valid"
                                            : "Enter a valid email address"
                                        }
                                    </p>
                                </div>
                            )}

                            {getAnimationState() === 'password' && (
                                <div className="animate-slide-up">
                                    {hasPasswordValue && isValidPassword(password) ? (
                                        // Password valid (8+ characters) - show green checkmark
                                        <div className="w-12 h-12 lg:w-20 lg:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-4 animate-bounce">
                                            <svg className="w-6 h-6 lg:w-10 lg:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    ) : (
                                        // Password being typed or less than 8 chars - show blue lock icon
                                        <div className="w-12 h-12 lg:w-20 lg:h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-4 animate-pulse">
                                            <svg className="w-6 h-6 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                    )}
                                    <h3 className="text-lg lg:text-2xl font-bold mb-1 lg:mb-3">
                                        {hasPasswordValue && isValidPassword(password) ? "Password Strong!" : "Secure Access"}
                                    </h3>
                                    <p className="text-blue-200 text-xs lg:text-base hidden sm:block">
                                        {hasPasswordValue && isValidPassword(password)
                                            ? "Perfect! Your password is secure"
                                            : hasPasswordValue
                                                ? `${8 - password.length} more characters needed`
                                                : "Enter your password to continue"
                                        }
                                    </p>
                                </div>
                            )}

                            {getAnimationState() === 'completed' && (
                                <div className="animate-fade-in">
                                    <div className="w-12 h-12 lg:w-20 lg:h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-4 animate-pulse">
                                        <svg className="w-6 h-6 lg:w-10 lg:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg lg:text-2xl font-bold mb-1 lg:mb-3">Semua Field Terisi!</h3>
                                    <p className="text-blue-200 text-xs lg:text-base hidden sm:block">
                                        Siap untuk login! Tekan tombol masuk untuk melanjutkan
                                    </p>
                                </div>
                            )}

                            {getAnimationState() === 'loading' && (
                                <div className="animate-fade-in">
                                    <div className="w-12 h-12 lg:w-20 lg:h-20 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-2 lg:mb-4"></div>
                                    <h3 className="text-lg lg:text-2xl font-bold mb-1 lg:mb-3">Logging In...</h3>
                                    <p className="text-blue-200 text-xs lg:text-base hidden sm:block">
                                        Please wait while we verify your credentials
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Floating Elements - Adjusted for mobile */}
                        <div className="absolute top-1/4 left-2 lg:left-8 w-2 h-2 lg:w-3 lg:h-3 bg-orange-400 rounded-full animate-float"></div>
                        <div className="absolute top-1/3 right-4 lg:right-12 w-2 h-2 lg:w-4 lg:h-4 bg-white rounded-full animate-float-delayed"></div>
                        <div className="absolute bottom-1/4 left-4 lg:left-12 w-1 h-1 lg:w-2 lg:h-2 bg-orange-300 rounded-full animate-float"></div>
                        <div className="absolute bottom-1/3 right-2 lg:right-8 w-2 h-2 lg:w-3 lg:h-3 bg-blue-300 rounded-full animate-float-delayed"></div>
                    </div>
                </div>

                {/* Form Container - Bottom on mobile, Right on desktop */}
                <div className="lg:flex-1 flex items-center justify-center p-6 lg:p-8">
                    <div className="w-full max-w-sm">
                        {/* Card Content */}
                        <div className="mb-6">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                                Selamat Datang!
                            </h2>
                            <p className="text-gray-500 text-sm lg:text-base">
                                {activeTab === "masuk"
                                    ? "Silahkan login menggunakan akun anda."
                                    : "Silahkan daftar untuk membuat akun anda."}
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-4 lg:space-y-5" onSubmit={handleSubmit}>
                            <div className="relative">
                                <label className="block font-semibold text-gray-700 mb-2 text-sm lg:text-base">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onFocus={() => setIsEmailFocused(true)}
                                    onBlur={() => setIsEmailFocused(false)}
                                    placeholder="nama@example.com"
                                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 transform text-sm lg:text-base ${
                                        isEmailFocused ? 'scale-105 shadow-lg' : 'scale-100'
                                    } ${error ? "border-red-600" : "border-gray-200"}`}
                                />
                                {hasEmailValue && (
                                    <div className="absolute right-3 top-11 text-green-500">
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block font-semibold text-gray-700 mb-2 text-sm lg:text-base">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    placeholder="Masukkan password"
                                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 transform text-sm lg:text-base ${
                                        isPasswordFocused ? 'scale-105 shadow-lg' : 'scale-100'
                                    } ${error ? "border-red-600" : "border-gray-200"}`}
                                />
                                {hasPasswordValue && (
                                    <div className="absolute right-3 top-11 text-green-500">
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="px-4 w-full py-3 rounded-lg border bg-red-50 border-red-200 animate-shake">
                                    <p className="text-red-600 text-sm lg:text-base">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm lg:text-base ${
                                    loading 
                                        ? "bg-gray-400 cursor-not-allowed" 
                                        : activeTab === "masuk" 
                                            ? "bg-blue-900 hover:bg-blue-800 active:scale-95" 
                                            : "bg-orange-500 hover:bg-orange-600 active:scale-95"
                                }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Memproses...
                                    </div>
                                ) : (
                                    activeTab === "masuk" ? "Masuk" : "Daftar"
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-4 lg:my-5">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">atau</span>
                            </div>
                        </div>

                        {/* Google login */}
                        <button
                            onClick={handleGoogleLogin}
                            type="button"
                            className="w-full py-3 px-4 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 text-sm lg:text-base"
                        >
                            <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Lanjutkan dengan Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
