"use client";

import Link from "next/link";
import { useLang } from "../../components/LangContext";
import { useEffect, useState } from "react";
import axios from "axios";

interface FacilityItem {
  id?: number;
  img: string;
  category: string;
}

export default function Fasilitas() {
  const { lang } = useLang();

  // === Data sementara ===
  const [facilities, setFacilities] = useState<FacilityItem[]>([
    // LABORATORIUM & STUDIO
    { img: "/svg/labDkv.svg", category: "Laboratorium & Studio" },
    { img: "/svg/labRpl.svg", category: "Laboratorium & Studio" },
    { img: "/svg/labTkj.svg", category: "Laboratorium & Studio" },
    { img: "/svg/labBc.svg", category: "Laboratorium & Studio" },
    { img: "/svg/studioBc.svg", category: "Laboratorium & Studio" },

    // FASILITAS AKADEMIK
    { img: "/svg/labDkv.svg", category: "Fasilitas Akademik" },
    { img: "/svg/labDkv.svg", category: "Fasilitas Akademik" },

    // FASILITAS OLAHRAGA
    { img: "/svg/labDkv.svg", category: "Fasilitas Olahraga" },

    // FASILITAS UMUM
    { img: "/svg/labDkv.svg", category: "Fasilitas Umum" },
    { img: "/svg/labDkv.svg", category: "Fasilitas Umum" },
    { img: "/svg/labDkv.svg", category: "Fasilitas Umum" },
    { img: "/svg/labDkv.svg", category: "Fasilitas Umum" },
  ]);

  // === Kelompokkan kategori ===
  const categories = [
    "Laboratorium & Studio",
    "Fasilitas Akademik",
    "Fasilitas Olahraga",
    "Fasilitas Umum",
  ];

  const groupedFacilities = categories.map((cat) => ({
    title: cat,
    items: facilities.filter((f) => f.category === cat),
  }));

  return (
    <>
      {/* Spacer */}
      <div className="h-[100px] bg-white" />

      {/* === Breadcrumbs === */}
      <section className="w-full py-4 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-medium space-x-2">
            <Link href="/" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Beranda" : "Home"}
            </Link>
            <span className="text-[#FE4D01]">{">"}</span>
            <Link href="/tentang/fasilitas" className="text-[#FE4D01] hover:underline">
              {lang === "id" ? "Tentang Kami" : "About Us"}
            </Link>
            <span className="text-[#243771]">{">"}</span>
            <span className="text-[#243771]">
              {lang === "id" ? "Fasilitas" : "Facilities"}
            </span>
          </nav>
        </div>
      </section>

      {/* === Konten Utama === */}
      <main className="flex-1 w-full bg-white">
        {/* === Section Fasilitas === */}
        <section className="w-full py-20">
          <div className="max-w-[95rem] mx-auto px-6">
            {/* Judul */}
            <h2 className="text-3xl sm:text-4xl font-bold text-[#243771] text-center mb-4">
              {lang === "id" ? "Fasilitas" : "Facilities"}
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12 text-sm sm:text-base">
              {lang === "id"
                ? "Kami percaya bahwa setiap siswa memiliki potensi dan keunikan untuk dikembangkan menjadi individu yang utuh dengan karakter kuat, dasar akademik, dan keterampilan."
                : "We believe every student has potential and uniqueness to be developed into a whole individual with strong character, academic foundation, and skills."}
            </p>

            {/* === Grid per kategori === */}
            {groupedFacilities.map((group, idx) => (
              <div key={idx} className="mb-24">
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#FE4D01] mb-10 text-center">
                  {group.title}
                </h3>

                <div
                  className="
                    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                    gap-8 justify-items-center
                  "
                >
                  {group.items.map((item, i) => (
                    <img
                      key={i}
                      src={item.img}
                      alt={`${group.title} ${i + 1}`}
                      loading="lazy"
                      className="
                        w-full
                        max-w-[420px]      /* sedikit lebih kecil */
                        aspect-[392/362]   /* jaga rasio */
                        object-contain
                        transition-transform duration-500
                        hover:scale-[1.04]
                        cursor-pointer
                      "
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* === Section Gedung === */}
        <section className="relative w-full bg-white overflow-hidden">
          <img
            src="/avif/gedung.avif"
            alt={lang === "id" ? "Gedung SMK Prestasi Prima" : "Prestasi Prima Building"}
            className="
              w-full h-[40vh] sm:h-[55vh] lg:h-screen
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
