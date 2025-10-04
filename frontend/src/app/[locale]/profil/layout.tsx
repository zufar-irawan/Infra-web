import React from "react";
import Navbar from "../components/Header"
import Footer from "../components/Footer";

export default function ProfilLayout(
    {children}: {children: React.ReactNode}
) {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            {children}

            <Footer />
        </div>
    )
}