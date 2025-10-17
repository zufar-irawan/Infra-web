"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useState } from "react";
import Pesan from "@/app/sections/pesan";

export default function Identitas() {
  const { lang } = useLang();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Spacer biar tidak ketiban navbar */}
      <div className="h-[100px] bg-white" />

      {/* === Breadcrumbs === */}
      <section className="w-full py-4 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-medium space-x-2">
            <Link href="/" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Beranda" : "Home"}
            </Link>
            <span className="text-[#FE4D01]">{">"}</span>
            <Link
              href="/tentang/identitas"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Tentang Kami" : "About Us"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Identitas Sekolah" : "School Identity"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Konten Utama === */}
      <main className="flex-1 w-full bg-white">
        {/* === Section Profil dengan Kotak Dekorasi === */}
        <section className="relative w-full bg-white">
          {/* Dekorasi kotak - disembunyikan di mobile */}
          <div className="absolute bottom-0 right-0 w-[50px] h-[50px] bg-[#FE4D01] hidden sm:block" />
          <div className="absolute bottom-12 right-0 w-[50px] h-[50px] bg-[#243771] hidden sm:block" />
          <div className="absolute bottom-24 right-12 w-[50px] h-[50px] bg-[#243771] hidden sm:block" />

          <div className="max-w-6xl mx-auto px-4 pt-16 pb-24">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#243771] text-center mb-12">
              {lang === "id"
                ? "Identitas SMK Prestasi Prima"
                : "Identity of SMK Prestasi Prima"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Gambar */}
              <div>
                <img
                  src="/ged.jpg"
                  alt="SMK Prestasi Prima"
                  className="rounded-lg w-full h-auto object-cover aspect-[4/3] hover:scale-[1.03] hover:shadow-xl transition-transform duration-500"
                />
              </div>

              {/* Teks */}
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#243771] mb-4">
                  {lang === "id"
                    ? "Selamat datang di SMK Prestasi Prima!"
                    : "Welcome to SMK Prestasi Prima!"}
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify text-base sm:text-lg">
                  {lang === "id"
                    ? "Di sekolah Prestasi Prima yang unggul dan terpercaya, siswa dan siswi disiapkan untuk menjadi tenaga yang terampil dan mandiri. Tidak hanya itu, ketakwaan dan kecerdasan pun harus dimiliki, dan percaya diri selalu terjaga dengan berkarakter Pancasila. Jika ada yang lebih baik, baik saja tidak cukup."
                    : "At the superior and trusted Prestasi Prima school, students are prepared to become skilled and independent workforce. Moreover, piety and intelligence must be possessed, and self-confidence is always maintained with Pancasila character. If better is possible, good is not enough."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section tambahan */}
        <Pesan />

        {/* === Section Sejarah === */}
        <section className="relative w-full bg-white py-20 flex flex-col items-center">
          {/* Dekorasi kotak - disembunyikan di mobile */}
          <div className="absolute top-0 left-0 w-[50px] h-[50px] bg-[#243771] hidden sm:block" />
          <div className="absolute top-12 left-12 w-[50px] h-[50px] bg-[#243771] hidden sm:block" />

          <div className="max-w-6xl mx-auto px-4 w-full">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#243771] text-center mb-12">
              {lang === "id"
                ? "Sejarah SMK Prestasi Prima"
                : "History of SMK Prestasi Prima"}
            </h2>
          </div>

          {/* Gambar sejarah dengan overlay hover */}
          <div
            onClick={() => setShowModal(true)}
            className="
              relative
              max-w-[95%] sm:max-w-[800px] lg:max-w-[1100px]
              mx-auto cursor-pointer group
            "
          >
            <img
              src="/svg/sejarah.svg"
              alt={lang === "id" ? "Sejarah SMK Prestasi Prima" : "History of SMK Prestasi Prima"}
              className="
                w-full object-contain rounded-lg
                hover:scale-[1.02] transition-transform duration-500
              "
            />
            {/* Overlay gelap saat hover */}
            <div
              className="
                absolute inset-0 bg-black/30
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300 rounded-lg
                flex items-center justify-center
              "
            >
              <span className="text-white text-lg font-medium bg-black/40 px-4 py-2 rounded-md">
                {lang === "id" ? "Klik untuk melihat gambar" : "Click to view image"}
              </span>
            </div>
          </div>
        </section>

        {/* === Modal fullscreen untuk sejarah === */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-5xl w-[95%] max-h-[90%] overflow-auto shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Tombol close */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>

              <h3 className="text-xl sm:text-2xl font-semibold text-[#243771] mb-4 text-center">
                {lang === "id"
                  ? "Sejarah SMK Prestasi Prima"
                  : "History of SMK Prestasi Prima"}
              </h3>

              <img
                src="/svg/sejarah.svg"
                alt={lang === "id" ? "Sejarah SMK Prestasi Prima" : "History of SMK Prestasi Prima"}
                className="w-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {/* === Section Gedung === */}
        <section className="relative w-full bg-white overflow-hidden">
          <img
            src="/svg/gedung.svg"
            alt={lang === "id" ? "Gedung SMK Prestasi Prima" : "Prestasi Prima Building"}
            className="
              w-full h-[40vh] sm:h-[50vh] lg:h-screen
              object-cover object-center
              hover:scale-[1.02] transition-transform duration-700
            "
          />
        </section>
      </main>
    </>
  );
}
