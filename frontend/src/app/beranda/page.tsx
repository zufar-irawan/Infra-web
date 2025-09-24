"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Konten utama */}
      <section className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-4">Selamat datang di SMK Prestasi Prima</h1>
        <p className="mb-2">
          Ini adalah halaman utama. Scroll ke bawah untuk melihat footer.
        </p>
        <p className="mb-2">
          {/* Tambahkan konten dummy agar bisa discroll */}
          {Array.from({ length: 50 }).map((_, i) => (
            <span key={i}>Konten panjang... <br /></span>
          ))}
        </p>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
