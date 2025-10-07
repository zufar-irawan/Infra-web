"use client";

import { Menu } from "lucide-react"
import { useState } from "react";

export default function DashHeader() {
    const [isUser] = useState('student')

    const pathname = typeof window !== "undefined" ? window.location.pathname : "";

    return (
        <section id="header" className="w-full flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
                {/* Tombol hamburger untuk mobile */}
                <button 
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => {
                        // Trigger sidebar open via custom event
                        window.dispatchEvent(new CustomEvent('toggleSidebar'))
                    }}
                >
                    <Menu className="w-6 h-6" />
                </button>
                
                <div>
                    <h1 className="text-lg sm:text-xl font-bold">
                        {pathname == '/edu/dashboard'
                            ? `Dashboard ${isUser === 'admin' ? "Admin" : isUser === 'teacher' ? "Guru" : "Siswa"}`
                        :pathname == 'edu/tugas'
                        }
                        
                        </h1>
                    <p className="text-black/60 text-sm sm:text-base">Selamat datang kembali, Hafiz!</p>
                </div>
            </div>
            <p className="bg-emerald-200 text-emerald-800 px-3 py-2 text-xs sm:text-sm rounded-sm">XII DKV 1</p>
        </section>
    )
}
