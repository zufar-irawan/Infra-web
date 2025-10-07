"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useEffect, useRef, useState } from "react";
import Jurusan from "@/app/sections/jurusan";

export default function VisiMisi() {
  const { lang } = useLang();

  const [showVisi, setShowVisi] = useState(false);
  const [showMisi, setShowMisi] = useState(false);

  const visiRef = useRef<HTMLDivElement | null>(null);
  const misiRef = useRef<HTMLDivElement | null>(null);

  // Pilih asset bilingual
  const visiSrc = lang === "id" ? "/svg/visi.svg" : "/svg/visi-eng.svg";
  const misiImgs = [
    lang === "id" ? "/svg/misi1.svg" : "/svg/misi1-eng.svg",
    lang === "id" ? "/svg/misi2.svg" : "/svg/misi2-eng.svg",
    lang === "id" ? "/svg/misi3.svg" : "/svg/misi3-eng.svg",
  ];

  // === animasi masuk saat scroll ===
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === visiRef.current) setShowVisi(true);
            if (entry.target === misiRef.current) setShowMisi(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (visiRef.current) observer.observe(visiRef.current);
    if (misiRef.current) observer.observe(misiRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Spacer agar tidak tertutup navbar */}
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
              href="/tentang/visi-misi"
              className="text-[#FE4D01] hover:underline"
            >
              {lang === "id" ? "Tentang Kami" : "About Us"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Visi Misi" : "Vision & Mission"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Konten Utama === */}
      <main className="flex-1 w-full bg-white">
        {/* === Section Judul Utama Visi & Misi === */}
        <section className="w-full bg-white py-14">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2
              className={`text-3xl sm:text-4xl font-bold text-[#243771] mb-4 transition-all duration-1000 ease-out ${
                showVisi ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {lang === "id" ? "Visi & Misi" : "Vision & Mission"}
            </h2>
            <p
              className={`text-gray-700 text-base sm:text-lg leading-relaxed transition-all duration-1000 delay-200 ease-out ${
                showVisi ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {lang === "id"
                ? "Kami percaya bahwa setiap siswa memiliki potensi dan keunikan untuk dikembangkan menjadi individu yang utuh dengan karakter kuat, dasar akademik, dan keterampilan."
                : "We believe that every student has the potential and uniqueness to be developed into a whole individual with strong character, academic foundation, and skills."}
            </p>
          </div>
        </section>

        {/* === Section Visi === */}
        <section
          ref={visiRef}
          className={`relative w-full bg-white py-12 transition-all duration-1000 ease-out ${
            showVisi ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#FE4D01] text-center mb-8">
              {lang === "id" ? "Visi" : "Vision"}
            </h3>
            <img
              src={visiSrc}
              alt={lang === "id" ? "Visi Sekolah" : "School Vision"}
              loading="lazy"
              decoding="async"
              className="
                w-[80%] sm:w-[90%] max-w-[755px]
                object-contain
                rounded-lg
                hover:scale-[1.03]
                transition-transform duration-500
                cursor-pointer
              "
            />
          </div>
        </section>

        {/* === Section Misi === */}
        <section
          ref={misiRef}
          className={`relative w-full bg-white py-16 transition-all duration-1000 ease-out ${
            showMisi ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#FE4D01] text-center mb-12">
              {lang === "id" ? "Misi" : "Mission"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {misiImgs.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={
                    lang === "id"
                      ? `Misi ${idx + 1}`
                      : `Mission ${idx + 1}`
                  }
                  loading="lazy"
                  decoding="async"
                  className="
                    w-[50%] sm:w-[65%] md:w-[80%] lg:w-[90%]
                    max-w-[384px]
                    object-contain
                    rounded-lg
                    hover:scale-[1.03]
                    transition-transform duration-500
                    cursor-pointer
                  "
                />
              ))}
            </div>
          </div>
        </section>

        {/* === Section Jurusan tetap ada === */}
        <Jurusan />

        {/* === Section Gedung === */}
        <section className="relative w-full bg-white overflow-hidden">
          <img
            src="/svg/gedung.svg"
            alt={lang === "id" ? "Gedung SMK Prestasi Prima" : "Prestasi Prima Building"}
            className="
              w-full h-[40vh] sm:h-[50vh] lg:h-screen
              object-cover object-center
              hover:scale-[1.02]
              transition-transform duration-700
            "
          />
        </section>
      </main>
    </>
  );
}
