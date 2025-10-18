"use client";

import { useLang } from "../components/LangContext";
import { useEffect, useState } from "react";

interface Mitra {
  id: number;
  name: string;
  img_id: string;
  img_en: string;
}

export default function Mitra() {
  const { lang } = useLang();
  const [partners, setPartners] = useState<Mitra[]>([]);

  // Ambil data mitra dari API proxy Next.js
  useEffect(() => {
    fetch("/api/portal/mitra/public", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setPartners(j.data);
      })
      .catch((err) => console.error("❌ Gagal memuat data mitra:", err));
  }, []);

  return (
    <section
      id="mitra"
      className="relative bg-white overflow-hidden py-32 md:py-40"
    >
      {/* Dekorasi atas */}
      <div className="absolute top-0 left-0 w-full z-0">
        {Array.from({ length: 30 }, (_, i) => i * 6.4).map((pos, idx) => (
          <div
            key={`top-${idx}`}
            className="absolute w-[50px] h-[50px] bg-[#FE4D01]"
            style={{ left: `${pos}rem`, top: "0px" }}
          />
        ))}
      </div>

      {/* Dekorasi bawah */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        {Array.from({ length: 30 }, (_, i) => i * 6.4).map((pos, idx) => (
          <div
            key={`bottom-${idx}`}
            className="absolute w-[50px] h-[50px] bg-[#FE4D01]"
            style={{ left: `${pos}rem`, bottom: "0px" }}
          />
        ))}
      </div>

      {/* Konten Mitra */}
      <div className="container relative z-10 mx-auto px-6 md:px-20 lg:px-30">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="text-[#FE4D01]">
            {lang === "id" ? "Mitra" : "Partners"}
          </span>
        </h2>

        {/* Carousel Mitra */}
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none">
          <div className="absolute left-0 top-0 h-full w-20 z-20 bg-gradient-to-r from-white to-transparent" />
          <div
            className="marquee-inner flex will-change-transform min-w-[200%]"
            style={{ animationDuration: "25s" }}
          >
            <div className="flex items-center">
              {[...partners, ...partners].map((p, i) => (
                <div
                  key={`${p.id}-${i}`}
                  className="flex items-center justify-center mx-10"
                  style={{ minWidth: "160px" }}
                >
                  <img
                    src={lang === "id" ? p.img_id : p.img_en}
                    alt={p.name}
                    loading="lazy"
                    className="h-28 w-auto object-contain"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-20 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>

      {/* Animasi marquee */}
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
