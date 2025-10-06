import React from "react";
import Navbar from "@/components/Header"
import SocialBar from "../components/Social";
import Footer from "@/components/Footer";

export default function TentangLayout(
    {children}: {children: React.ReactNode}
) {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <SocialBar />

            {children}

            <Footer />
        </div>
    )
}