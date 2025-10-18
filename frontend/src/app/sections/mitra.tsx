"use client";

import { useLang } from "../components/LangContext";
import { useEffect, useState } from "react";
import axios from "axios";

interface Mitra {
  id: number;
  name: string;
  img_id: string;
  img_en: string;
}

const API_BASE_URL = "http://api.smkprestasiprima.sch.id/api";
const BASE_URL = API_BASE_URL.replace("/api", "");

export default function Mitra() {
  const { lang } = useLang();
  const [partners, setPartners] = useState<Mitra[]>([]);

  // Ambil data mitra dari API Laravel
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/mitra/public`)
      .then((res) => {
        if (res.data.success) setPartners(res.data.data);
      })
      .catch((err) => console.error("❌ Gagal memuat data mitra:", err));
  }, []);

  return (
    <section
      id="mitra"
      className="relative bg-white overflow-hidden py-32 md:py-40"
    >
      {/* === Dekorasi Kotak Baris 1 === */}
      <div className="absolute top-0 left-0 w-full z-0">
        {Array.from({ length: 30 }, (_, i) => i * 6.4).map((pos, idx) => (
          <div
            key={`top-${idx}`}
            className="absolute w-[50px] h-[50px] bg-[#FE4D01]"
            style={{ left: `${pos}rem`, top: "0px" }}
          />
        ))}
      </div>

      {/* === Dekorasi Kotak Baris 2 === */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        {Array.from({ length: 30 }, (_, i) => i * 6.4).map((pos, idx) => (
          <div
            key={`bottom-${idx}`}
            className="absolute w-[50px] h-[50px] bg-[#FE4D01]"
            style={{ left: `${pos}rem`, bottom: "0px" }}
          />
        ))}
      </div>

      {/* === Konten Mitra === */}
      <div className="container relative z-10 mx-auto px-6 md:px-20 lg:px-30">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="text-[#FE4D01]">
            {lang === "id" ? "Mitra" : "Partners"}
          </span>
        </h2>

        {/* === Carousel Mitra (auto scroll) === */}
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none">
          {/* Gradient kiri */}
          <div className="absolute left-0 top-0 h-full w-20 z-20 pointer-events-none bg-gradient-to-r from-white to-transparent" />

          {/* Isi marquee */}
          <div
            className="marquee-inner flex will-change-transform min-w-[200%]"
            style={{ animationDuration: "25s" }}
          >
            <div className="flex items-center">
              {[...partners, ...partners].map((p, index) => (
                <div
                  key={`${p.id}-${index}`}
                  className="flex items-center justify-center mx-10"
                  style={{ minWidth: "160px" }}
                >
                  <img
                    src={`${BASE_URL}${lang === "id" ? p.img_id : p.img_en}`}
                    alt={p.name}
                    loading="lazy"
                    className="h-28 w-auto object-contain"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Gradient kanan */}
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-20 pointer-events-none bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>

      {/* === Animasi marquee === */}
      <style jsx>{`
        .marquee-inner {
          animation: marqueeScroll linear infinite;
        }
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
