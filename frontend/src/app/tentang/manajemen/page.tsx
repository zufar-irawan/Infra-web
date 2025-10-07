"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useEffect, useRef, useState } from "react";
import Jurusan from "@/app/sections/jurusan";

export default function Manajemen() {
  const { lang } = useLang();
  const [showStaff, setShowStaff] = useState(false);
  const staffRef = useRef<HTMLDivElement | null>(null);

  // Data sementara: gambar placeholder sirHendry.svg
  const staffList = Array.from({ length: 21 }, () => ({
    img: "/svg/sirHendry.svg",
  }));

  // === animasi masuk saat scroll ===
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
      {/* Spacer agar tidak ketiban navbar */}
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

        {/* === Section Manajemen Staf === */}
        <section
          ref={staffRef}
          className={`relative w-full bg-white py-14 transition-all duration-1000 ease-out ${
            showStaff ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] text-center mb-12">
              {lang === "id" ? "Manajemen Staf" : "Management Staff"}
            </h2>

            {/* Baris pertama: 3 foto di tengah */}
            <div className="flex justify-center gap-6 flex-wrap mb-10">
              {staffList.slice(0, 3).map((staff, idx) => (
                <img
                  key={idx}
                  src={staff.img}
                  alt={`Staff ${idx + 1}`}
                  className="w-[70%] sm:w-[180px] md:w-[200px] lg:w-[220px] object-contain transition-transform duration-500 hover:scale-[1.05]"
                />
              ))}
            </div>

            {/* Grid berikutnya */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
              {staffList.slice(3).map((staff, idx) => (
                <img
                  key={idx}
                  src={staff.img}
                  alt={`Staff ${idx + 4}`}
                  className="w-[70%] sm:w-[160px] md:w-[190px] lg:w-[210px] object-contain transition-transform duration-500 hover:scale-[1.05]"
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* === Section Gedung === */}
        <section className="relative w-full bg-white overflow-hidden">
          <img
            src="/svg/gedung.svg"
            alt={lang === "id" ? "Gedung SMK Prestasi Prima" : "Prestasi Prima Building"}
            className="w-full h-[40vh] sm:h-[50vh] lg:h-screen object-cover object-center hover:scale-[1.02] transition-transform duration-700"
          />
        </section>
      </main>
    </>
  );
}
