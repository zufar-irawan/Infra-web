"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "../components/LangContext";
import { useEffect, useRef, useState } from "react";

export default function Prestasi() {
  const { lang } = useLang();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // slider state
  const [current, setCurrent] = useState(0);

  // dummy data prestasi
  const achievements = [
    {
      img: "/pp2.png",
      title: "Juara Dua",
      desc_id: "Prestasi lomba basket tingkat provinsi.",
      desc_en: "Second place in provincial basketball tournament.",
    },
    {
      img: "/pp2.png",
      title: "Juara Tiga",
      desc_id: "Kompetisi desain poster digital tingkat nasional.",
      desc_en: "Third place in national digital poster competition.",
    },
    {
      img: "/pp2.png",
      title: "Juara Satu",
      desc_id: "Kompetisi robotik antar sekolah.",
      desc_en: "First place in inter-school robotics competition.",
    },
  ];

  // animasi muncul saat scroll
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

  // next & prev slide
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % achievements.length);
  };
  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + achievements.length) % achievements.length);
  };

  return (
    <section id="prestasi" ref={sectionRef} className="relative overflow-hidden">
      {/* Background miring oranye */}
      <div className="absolute inset-0 bg-[#FE4D01] transform -skew-y-6 origin-top-left z-0"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 py-20">
        {/* Title */}
        <div
          className={`max-w-2xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#FE4D01] mb-4">
            {lang === "id" ? "Prestasi" : "Achievements"}
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            {lang === "id"
              ? "Dari berbagai macam program keahlian yang ada, lahirlah berbagai prestasi yang membanggakan nama sekolah. Namun, tidak hanya dari bidang akademik. Bidang non akademik juga sama membanggakannya."
              : "From the various expertise programs available, many achievements have brought pride to the school. Not only in academics, but also in non-academic fields."}
          </p>
        </div>

        {/* Slider */}
        <div className="mt-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Card prestasi */}
          <div className="relative flex-1 w-full max-w-md mx-auto">
            <div className="overflow-hidden rounded-lg shadow-lg bg-white transition-all duration-700">
              <Image
                src={achievements[current].img}
                alt={achievements[current].title}
                width={600}
                height={400}
                className="object-cover w-full h-[250px] md:h-[300px]"
              />
              <div className="p-4">
                <h3 className="text-[#243771] font-bold text-lg">
                  {achievements[current].title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {lang === "id"
                    ? achievements[current].desc_id
                    : achievements[current].desc_en}
                </p>
              </div>
            </div>

            {/* Slider buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={prevSlide}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#243771] text-white hover:bg-[#1a2a5c] transition"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#243771] text-white hover:bg-[#1a2a5c] transition"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/profil/prestasi"
            className="px-6 py-3 rounded-md bg-[#243771] text-white font-semibold hover:bg-[#1a2a5c] transition"
          >
            {lang === "id" ? "Selengkapnya" : "Learn More"}
          </Link>
        </div>
      </div>

      {/* Dekorasi kotak kotak bawah */}
      <div className="absolute bottom-0 left-0 w-full h-6 bg-[length:40px_40px] bg-repeat-x"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #FE4D01 25%, transparent 25%), linear-gradient(-45deg, #FE4D01 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #FE4D01 75%), linear-gradient(-45deg, transparent 75%, #FE4D01 75%)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
        }}
      ></div>
    </section>
  );
}
