"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "../components/LangContext";
import { useEffect, useState, useRef } from "react";

export default function Prestasi() {
  const { lang } = useLang();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // animasi masuk saat scroll
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

  // dummy data prestasi
  const achievements = ["/pp2.png", "/pp2.png", "/pp2.png", "/pp2.png"];

  return (
    <section id="prestasi" className="py-20 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Title */}
        <h2
          className={`text-3xl md:text-4xl font-bold text-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-[#243771]">
            {lang === "id" ? "" : ""}
          </span>
          <span className="text-[#FE4D01]">
            {lang === "id" ? "Prestasi" : "Achievements"}
          </span>
        </h2>

        {/* Grid Prestasi */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {achievements.map((img, i) => (
            <div
              key={i}
              className="bg-white rounded-[9px] shadow-md overflow-hidden transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{ width: "258px", height: "322px" }}
            >
              <Image
                src={img}
                alt={`Prestasi ${i + 1}`}
                width={258}
                height={322}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Button */}
        <div
          className={`flex justify-center mt-10 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Link
            href="/profil/prestasi"
            className="px-6 py-3 rounded-lg bg-[#FE4D01] text-white font-semibold shadow hover:bg-[#e44400] transition"
          >
            {lang === "id" ? "Pelajari Lebih Lanjut" : "Learn More"}
          </Link>
        </div>
      </div>
    </section>
  );
}
