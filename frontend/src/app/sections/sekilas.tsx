"use client";

import Image from "next/image";
import { useLang } from "../components/LangContext";
import { useEffect, useState, useRef } from "react";

export default function Sekilas() {
  const { lang } = useLang();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="py-20 bg-white"
      ref={sectionRef}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Title */}
        <h2
          className={`text-3xl md:text-4xl font-bold text-center mb-12 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-[#243771]">
            {lang === "id" ? "Sekilas " : "About "}
          </span>
          <span className="text-[#FE4D01]">SMK Prestasi Prima</span>
        </h2>

        {/* Content */}
        <div
          className={`flex flex-col md:flex-row items-center justify-center gap-10 transition-all duration-1000 delay-300 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Text Card */}
          <div
            className="bg-white rounded-[10px] shadow-md p-8 text-[#243771] leading-relaxed flex items-center justify-center text-center transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
            style={{ width: "590px", height: "352px" }}
          >
            {lang === "id" ? (
              <p>
                Di sekolah Prestasi Prima yang unggul dan terpercaya siswa &amp;
                siswi disiapkan untuk menjadi tenaga yang terampil dan mandiri.
                Tidak hanya itu ketakwaan dan kecerdasan pun harus dimiliki, dan
                percaya diri selalu terjaga dengan berkarakter Pancasila. Jika ada
                yang lebih baik, baik saja tidak cukup.
              </p>
            ) : (
              <p>
                At Prestasi Prima, students are prepared to become skilled and
                independent individuals. In addition to academic excellence,
                faith, intelligence, and confidence with Pancasila character
                must also be instilled. If better is possible, good is not enough.
              </p>
            )}
          </div>

          {/* Image */}
          <div
            className="rounded-[10px] overflow-hidden shadow-md transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl group"
            style={{ width: "590px", height: "352px" }}
          >
            <Image
              src="/pp2.png"
              alt="Sekilas SMK Prestasi Prima"
              width={590}
              height={352}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
