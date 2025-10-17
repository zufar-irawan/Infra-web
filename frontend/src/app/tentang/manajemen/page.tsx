"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useEffect, useRef, useState } from "react";

export default function Manajemen() {
  const { lang } = useLang();
  const [showStaff, setShowStaff] = useState(false);
  const staffRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === staffRef.current) {
            setShowStaff(true);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (staffRef.current) observer.observe(staffRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Spacer agar tidak ketiban header */}
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
              href="/tentang/manajemen"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Tentang Kami" : "About Us"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Manajemen Staf" : "Management Staff"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Konten Utama === */}
      <main className="flex-1 w-full bg-white">
        <section
          ref={staffRef}
          className={`relative w-full bg-white py-16 transition-all duration-1000 ease-out ${
            showStaff ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#243771] text-center mb-12">
              {lang === "id" ? "Manajemen Staf" : "Management Staff"}
            </h2>

            {/* === Desktop view (gabung semua jadi satu gambar) === */}
            <div className="hidden lg:flex justify-center">
              <img
                src={`/${lang === "id" ? "guru-id.png" : "guru-eng.png"}`}
                alt="Semua Guru"
                className="w-full max-w-7xl object-contain"
              />
            </div>

            {/* === Mobile & Tablet view (gambar per baris) === */}
            <div className="flex flex-col items-center space-y-10 lg:hidden">
              <div className="flex justify-center">
                <img
                  src={`/${lang === "id" ? "atas-id.png" : "atas-eng.png"}`}
                  alt="Manajemen Atas"
                  className="w-[80%] sm:w-[90%] md:w-[70%] object-contain"
                />
              </div>

              <div className="flex justify-center">
                <img
                  src={`/${lang === "id" ? "baris2-id.png" : "baris2-eng.png"}`}
                  alt="Baris 2"
                  className="w-[85%] sm:w-[90%] md:w-[75%] object-contain"
                />
              </div>

              <div className="flex justify-center">
                <img
                  src={`/${lang === "id" ? "baris3-id.png" : "baris3-eng.png"}`}
                  alt="Baris 3"
                  className="w-[85%] sm:w-[90%] md:w-[75%] object-contain"
                />
              </div>

              <div className="flex justify-center">
                <img
                  src={`/${lang === "id" ? "baris4-id.png" : "baris4-eng.png"}`}
                  alt="Baris 4"
                  className="w-[85%] sm:w-[90%] md:w-[75%] object-contain"
                />
              </div>

              <div className="flex justify-center">
                <img
                  src={`/${lang === "id" ? "baris5-id.png" : "baris5-eng.png"}`}
                  alt="Baris 5"
                  className="w-[85%] sm:w-[90%] md:w-[75%] object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* === Section Gedung === */}
        <section className="relative w-full bg-white overflow-hidden">
          <img
            src="/avif/gedung.avif"
            alt={
              lang === "id"
                ? "Gedung SMK Prestasi Prima"
                : "Prestasi Prima Building"
            }
            className="w-full h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[80vh] xl:h-[90vh] object-cover object-center"
          />
        </section>
      </main>
    </>
  );
}
