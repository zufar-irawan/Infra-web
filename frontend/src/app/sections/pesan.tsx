"use client";

import { useLang } from "../components/LangContext";
import { useEffect, useRef, useState } from "react";

export default function Pesan() {
  const { lang } = useLang();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Data jurusan + jumlah
  const data = [
    { value: 280, label: "DKV" },
    { value: 210, label: "BCF" },
    { value: 280, label: "PPLG" },
    { value: 210, label: "TJKT" },
  ];

  // State animasi angka
  const [counts, setCounts] = useState(data.map(() => 0));

  // Observer untuk trigger animasi
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Jalankan animasi angka saat terlihat
  useEffect(() => {
    if (isVisible) {
      data.forEach((item, index) => {
        let start = 0;
        const end = item.value;
        const duration = 1500;
        const stepTime = Math.max(Math.floor(duration / end), 10);

        const counter = setInterval(() => {
          start += 5;
          if (start >= end) {
            start = end;
            clearInterval(counter);
          }
          setCounts((prev) => {
            const updated = [...prev];
            updated[index] = start;
            return updated;
          });
        }, stepTime);
      });
    }
  }, [isVisible]);

  return (
    <section
      id="pesan"
      ref={sectionRef}
      className="relative bg-[#243771] py-20 overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Grid angka */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-center justify-items-center">
          {data.map((item, index) => (
            <div
              key={item.label}
              className={`bg-white shadow-md w-[95px] h-[120px] flex flex-col items-center justify-center transform transition duration-500 hover:-translate-y-2 hover:shadow-xl ${
                isVisible ? "scale-105 opacity-100" : "scale-90 opacity-0"
              }`}
              style={{
                borderTopRightRadius: "20px",
                borderBottomLeftRadius: "20px",
              }}
            >
              <h3 className="text-xl md:text-2xl font-bold text-[#243771]">
                {counts[index]}
              </h3>
              <p className="mt-1 text-[#FE4D01] text-sm font-semibold uppercase">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dekorasi kotak oranye (50x50px) */}
      <div className="absolute top-0 left-40 w-[50px] h-[50px] bg-[#FE4D01]" />
      <div className="absolute bottom-12.5 left-12.5 w-[50px] h-[50px] bg-[#FE4D01]" />
      <div className="absolute bottom-0 left-0 w-[50px] h-[50px] bg-[#FE4D01]" />
      <div className="absolute top-0 right-12.5 w-[50px] h-[50px] bg-[#FE4D01]" />
      <div className="absolute bottom-0 right-40 w-[50px] h-[50px] bg-[#FE4D01]" />
    </section>
  );
}
