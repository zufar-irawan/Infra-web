import React from "react";
import Navbar from "@/components/header"
import Footer from "@/app/components/footer";

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