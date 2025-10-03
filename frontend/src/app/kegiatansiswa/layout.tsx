import React from "react";
import Navbar from "@/components/Header"
import Footer from "@/components/Footer";

export default function KegiatanSiswaLayout(
    {children}: {children: React.ReactNode}
) {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div>
                {children}
            </div>

            <Footer />
        </div>
    )
}